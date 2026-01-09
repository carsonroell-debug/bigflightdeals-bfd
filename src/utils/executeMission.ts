/**
 * Mission Execution
 *
 * Central executor for mission execution - all UI components call this.
 * This is the single source of truth for mission execution and widget params.
 */

import type { MissionV1, MissionExecutionResult } from '../types/mission';
import { setLastMission } from './missionStore';
import { track } from './analytics';

/**
 * Build widget parameters from a mission.
 * These params are passed to the Travelpayouts widget URL.
 *
 * Does NOT hardcode marker - uses environment config or mission.marker.
 */
const buildWidgetParams = (mission: MissionV1): Record<string, string> => {
  const params: Record<string, string> = {
    origin: mission.originCode,
    destination: mission.destinationCode,
  };

  // Optional date params
  if (mission.departDate) {
    params.depart_date = mission.departDate;
  }
  if (mission.returnDate) {
    params.return_date = mission.returnDate;
  }

  // Adults (default 1)
  params.adults = String(mission.adults || 1);

  // Cabin class
  if (mission.cabin) {
    params.trip_class = mission.cabin === 'first' ? '3' : mission.cabin === 'business' ? '2' : '0';
  }

  // Locale/currency from mission or environment
  if (mission.locale) {
    params.locale = mission.locale;
  }
  if (mission.currency) {
    params.currency = mission.currency.toLowerCase();
  }

  // Marker from mission (falls back to env in widgetInjection.ts)
  if (mission.marker) {
    params.marker = mission.marker;
  }

  return params;
};

/**
 * Build an affiliate deep link for the mission.
 */
const buildDeepLink = (mission: MissionV1): string => {
  const base = 'https://www.aviasales.com/search';
  const origin = mission.originCode;
  const dest = mission.destinationCode;

  // Basic search URL format: origin + dest + date
  let path = `${origin}${dest}`;

  // Add date if available (format: DDMM)
  if (mission.departDate) {
    const d = new Date(mission.departDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    path += dd + mm;
  }

  // Add return date if round trip
  if (mission.returnDate) {
    const d = new Date(mission.returnDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    path += dd + mm;
  }

  // Adults
  path += String(mission.adults || 1);

  return `${base}/${path}`;
};

/**
 * Execute a mission.
 *
 * - Adds createdAt if missing
 * - Writes to missionStore (localStorage)
 * - Tracks analytics event
 * - Returns normalized mission with widgetParams and deepLink
 */
export const executeMission = (
  mission: MissionV1,
  _opts?: { openModal?: boolean }
): MissionExecutionResult => {
  // Normalize mission: add createdAt if missing
  const normalizedMission: MissionV1 = {
    ...mission,
    createdAt: mission.createdAt || new Date().toISOString(),
  };

  // Write to missionStore (localStorage)
  setLastMission(normalizedMission);

  // Build widget params
  const widgetParams = buildWidgetParams(normalizedMission);

  // Build deep link
  const deepLink = buildDeepLink(normalizedMission);

  // Track analytics event
  track('mission_executed', {
    origin: normalizedMission.originCode,
    destination: normalizedMission.destinationCode,
    source: normalizedMission.source || 'mission_input',
    id: normalizedMission.id,
  });

  // Dispatch custom event for UI components to listen
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('bfd-mission-executed', {
        detail: normalizedMission,
      })
    );
  }

  return {
    mission: normalizedMission,
    widgetParams,
    deepLink,
  };
};
