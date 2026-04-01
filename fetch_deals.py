#!/usr/bin/env python3
"""
fetch_deals.py — Daily flight deal fetching agent for BigFlightDeals (BFD).

Playbook:
  1. Load existing deals.json (if any).
  2. Expire deals older than MAX_DEAL_AGE_DAYS.
  3. Generate/refresh deals using the OpenAI API (GPT-4.1-mini) as the intelligence layer.
  4. Normalize and validate each deal against the FlightDeal schema.
  5. Merge new deals with surviving existing deals (dedup by id).
  6. Write the final list to client/public/data/deals.json.

Output schema (FlightDeal):
  {
    "id":               str,   # e.g. "yyz-lis"
    "from":             str,   # e.g. "Toronto (YYZ)"
    "to":               str,   # e.g. "Lisbon (LIS)"
    "originCode":       str,   # IATA city/airport code
    "destinationCode":  str,   # IATA city/airport code
    "price":            int,   # target price in currency units
    "currency":         str,   # e.g. "CAD"
    "bestSeason":       str,   # optional
    "notes":            str,   # optional
    "fetchedAt":        str,   # ISO-8601 UTC timestamp
    "expiresAt":        str    # ISO-8601 UTC timestamp
  }
"""

import json
import os
import sys
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from openai import OpenAI

# ── Configuration ────────────────────────────────────────────────────────────

REPO_ROOT       = Path(__file__).parent
DEALS_JSON_PATH = REPO_ROOT / "public" / "data" / "deals.json"

MAX_DEAL_AGE_DAYS = 7          # deals older than this are expired
TARGET_DEAL_COUNT = 12         # how many deals to maintain in the file
MODEL             = "gpt-4.1-mini"

# Focus market: solo travellers departing from Toronto (YYZ)
ORIGIN_CITY     = "Toronto"
ORIGIN_CODE     = "YTO"
CURRENCY        = "CAD"

# ── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
log = logging.getLogger("fetch_deals")

# ── Helpers ──────────────────────────────────────────────────────────────────

def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def load_existing_deals() -> list[dict]:
    if not DEALS_JSON_PATH.exists():
        log.info("No existing deals.json found — starting fresh.")
        return []
    try:
        with open(DEALS_JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        deals = data if isinstance(data, list) else data.get("deals", [])
        log.info("Loaded %d existing deal(s) from deals.json.", len(deals))
        return deals
    except (json.JSONDecodeError, OSError) as exc:
        log.warning("Could not parse existing deals.json (%s) — starting fresh.", exc)
        return []


def expire_old_deals(deals: list[dict]) -> list[dict]:
    """Remove deals whose expiresAt timestamp is in the past."""
    now = now_utc()
    surviving = []
    for deal in deals:
        expires_at_str = deal.get("expiresAt")
        if not expires_at_str:
            # Legacy deal without expiry — keep it but it will be refreshed
            surviving.append(deal)
            continue
        try:
            expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
            if expires_at > now:
                surviving.append(deal)
            else:
                log.info("Expired deal removed: %s (expired %s)", deal.get("id"), expires_at_str)
        except ValueError:
            surviving.append(deal)  # malformed date — keep for safety
    log.info("%d deal(s) survived expiration check.", len(surviving))
    return surviving


def normalize_deal(raw: dict, fetched_at: datetime) -> dict | None:
    """Normalize and validate a raw deal dict. Returns None if invalid."""
    required_fields = ["id", "from", "to", "originCode", "destinationCode", "price", "currency"]
    for field in required_fields:
        if field not in raw or raw[field] is None:
            log.warning("Deal missing required field '%s': %s", field, raw)
            return None

    try:
        price = int(raw["price"])
        if price <= 0:
            raise ValueError("price must be positive")
    except (ValueError, TypeError) as exc:
        log.warning("Invalid price in deal %s: %s", raw.get("id"), exc)
        return None

    expires_at = fetched_at + timedelta(days=MAX_DEAL_AGE_DAYS)

    return {
        "id":              str(raw["id"]).strip().lower(),
        "from":            str(raw["from"]).strip(),
        "to":              str(raw["to"]).strip(),
        "originCode":      str(raw["originCode"]).strip().upper(),
        "destinationCode": str(raw["destinationCode"]).strip().upper(),
        "price":           price,
        "currency":        str(raw["currency"]).strip().upper(),
        "bestSeason":      str(raw.get("bestSeason", "")).strip() or None,
        "notes":           str(raw.get("notes", "")).strip() or None,
        "fetchedAt":       iso(fetched_at),
        "expiresAt":       iso(expires_at),
    }


def fetch_deals_from_llm(existing_ids: set[str], count: int) -> list[dict]:
    """
    Use OpenAI to generate realistic flight deal targets for solo travellers
    departing from Toronto (YYZ). Returns a list of raw deal dicts.
    """
    client = OpenAI()  # uses OPENAI_API_KEY + base_url from environment

    today_str = now_utc().strftime("%B %d, %Y")

    system_prompt = (
        "You are a flight deal research agent for BigFlightDeals.com, "
        "a site focused on solo budget travellers departing from Toronto, Canada (YYZ/YTO). "
        "Your job is to produce realistic, curated flight deal targets based on "
        "current seasonal patterns, typical airline pricing, and solo travel appeal. "
        "Deals should be diverse in destination (mix of Europe, Caribbean, Mexico, Asia, "
        "South America, domestic Canada/USA). Prices should be realistic CAD round-trip "
        "economy targets for a solo traveller booking 4-12 weeks ahead. "
        "Return ONLY a valid JSON array — no markdown, no explanation."
    )

    user_prompt = (
        f"Today is {today_str}. Generate exactly {count} flight deal targets for solo travellers "
        f"departing from Toronto (YYZ/YTO). "
        f"Do NOT include deals with these IDs (already in the feed): {sorted(existing_ids) if existing_ids else 'none'}. "
        "Each deal must be a JSON object with these fields:\n"
        "  id            (string, lowercase, format: 'yyz-<dest3>' e.g. 'yyz-lis')\n"
        "  from          (string, e.g. 'Toronto (YYZ)')\n"
        "  to            (string, e.g. 'Lisbon (LIS)')\n"
        "  originCode    (string, IATA city code, e.g. 'YTO')\n"
        "  destinationCode (string, IATA city code, e.g. 'LIS')\n"
        "  price         (integer, CAD round-trip target price)\n"
        "  currency      (string, always 'CAD')\n"
        "  bestSeason    (string, e.g. 'March–May, Sept–Nov')\n"
        "  notes         (string, 1-2 sentence tip for solo travellers)\n"
        "\nReturn ONLY the JSON array."
    )

    log.info("Requesting %d new deal(s) from LLM (%s)…", count, MODEL)
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        raw_content = response.choices[0].message.content.strip()
        log.debug("LLM raw response: %s", raw_content[:500])

        # Strip markdown code fences if present
        if raw_content.startswith("```"):
            raw_content = raw_content.split("```")[1]
            if raw_content.startswith("json"):
                raw_content = raw_content[4:]
            raw_content = raw_content.strip()

        deals = json.loads(raw_content)
        if not isinstance(deals, list):
            raise ValueError("Expected a JSON array from LLM")
        log.info("LLM returned %d raw deal(s).", len(deals))
        return deals

    except (json.JSONDecodeError, ValueError, KeyError) as exc:
        log.error("Failed to parse LLM response: %s", exc)
        return []
    except Exception as exc:  # noqa: BLE001
        log.error("LLM API call failed: %s", exc)
        return []


def merge_deals(existing: list[dict], new_deals: list[dict]) -> list[dict]:
    """Merge new deals into existing, deduplicating by id. New deals take precedence."""
    merged: dict[str, dict] = {d["id"]: d for d in existing}
    for deal in new_deals:
        merged[deal["id"]] = deal
    return list(merged.values())


def write_deals(deals: list[dict]) -> None:
    DEALS_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": iso(now_utc()),
        "count":       len(deals),
        "deals":       deals,
    }
    with open(DEALS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    log.info("Wrote %d deal(s) to %s", len(deals), DEALS_JSON_PATH)


# ── Main ─────────────────────────────────────────────────────────────────────

def main() -> int:
    log.info("=== BFD fetch_deals.py starting ===")
    fetched_at = now_utc()

    # Step 1: Load existing deals
    existing_deals = load_existing_deals()

    # Step 2: Expire old deals
    surviving_deals = expire_old_deals(existing_deals)
    existing_ids = {d["id"] for d in surviving_deals}

    # Step 3: Determine how many new deals to fetch
    needed = max(0, TARGET_DEAL_COUNT - len(surviving_deals))
    log.info("Surviving: %d | Target: %d | Fetching: %d new deal(s).",
             len(surviving_deals), TARGET_DEAL_COUNT, needed)

    new_validated: list[dict] = []
    if needed > 0:
        raw_new = fetch_deals_from_llm(existing_ids, needed)

        # Step 4: Normalize and validate
        for raw in raw_new:
            normalized = normalize_deal(raw, fetched_at)
            if normalized and normalized["id"] not in existing_ids:
                new_validated.append(normalized)
                existing_ids.add(normalized["id"])
            elif normalized:
                log.info("Skipping duplicate deal id: %s", normalized["id"])

        log.info("%d new deal(s) validated successfully.", len(new_validated))
    else:
        log.info("Feed is full — no new deals needed.")

    # Step 5: Merge
    final_deals = merge_deals(surviving_deals, new_validated)

    # Step 6: Write output
    write_deals(final_deals)

    log.info("=== BFD fetch_deals.py complete — %d deal(s) in feed ===", len(final_deals))
    return 0


if __name__ == "__main__":
    sys.exit(main())
