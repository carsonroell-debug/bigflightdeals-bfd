/**
 * Mission Types
 *
 * Formal contract for mission execution - enables AI agent control.
 * This turns the UI into an API surface that can be driven programmatically.
 */

export type TravelerType = "solo" | "couple" | "family" | "other";
export type CabinClass = "economy" | "business" | "first";
export type MissionSource = "deals_grid" | "mission_input" | "deep_link" | "saved";

/**
 * MissionV1 - The core mission interface for the Mission Engine.
 *
 * This interface represents a single flight search mission with all
 * relevant constraints and metadata.
 */
export interface MissionV1 {
  id: string;                     // stable id (e.g., "yyz-lis" or uuid)
  originCode: string;             // e.g., "YTO" or "YYZ"
  destinationCode: string;        // e.g., "LIS"
  originLabel: string;            // e.g., "Toronto (YTO)"
  destinationLabel: string;       // e.g., "Lisbon (LIS)"

  // Date constraints
  departDate?: string;            // ISO date string "2025-03-15"
  returnDate?: string;            // ISO date string "2025-03-25"

  // Traveler details
  adults?: number;                // default 1
  cabin?: CabinClass;             // economy, business, first

  // Budget/price
  currency?: string;              // "CAD", "USD"
  budget?: number;                // target budget

  // Flexibility hints
  tripLengthDays?: number;        // e.g., 10
  month?: string;                 // e.g., "March"
  dateFlex?: "any" | "weekend" | "weekday" | "exact";

  // Categorization
  tags?: string[];                // ["warm", "wifi", "beach", "europe"]
  travelerType?: TravelerType;

  // Metadata
  notes?: string;
  source?: MissionSource;
  createdAt?: string;             // ISO timestamp

  // Widget/affiliate config (inherited from environment by default)
  locale?: string;                // "en", "fr"
  marker?: string;                // affiliate marker (from env)
}

/**
 * Parsed constraints from natural language input.
 */
export interface ParsedConstraints {
  originHint?: string;
  budget?: number;
  monthHint?: string;
  daysHint?: number;
  vibeHints: string[];
}

/**
 * Result of mission execution.
 */
export interface MissionExecutionResult {
  mission: MissionV1;
  widgetParams: Record<string, string>;
  deepLink?: string;
}

// Legacy alias for backward compatibility
export type MissionInput = MissionV1;

export interface MissionState {
  mission: MissionV1;
  isOpen: boolean;
}
