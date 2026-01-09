/**
 * Mission Execution
 * 
 * Central executor for mission execution - all UI components call this.
 * This is the single source of truth for mission execution.
 */

import type { MissionInput } from '../types/mission';
import { setMission } from './missionStore';
import { track } from './analytics';

/**
 * Execute a mission.
 * 
 * - Adds createdAt if missing
 * - Writes to missionStore (localStorage)
 * - Tracks analytics event
 * - Returns the normalized mission
 * 
 * @param mission - The mission to execute
 * @param opts - Optional execution options
 * @returns The normalized mission with createdAt
 */
export const executeMission = (
  mission: MissionInput,
  _opts?: { openModal?: boolean }
): MissionInput => {
  // Normalize mission: add createdAt if missing
  const normalizedMission: MissionInput = {
    ...mission,
    createdAt: mission.createdAt || new Date().toISOString(),
  };

  // Write to missionStore (localStorage)
  setMission(normalizedMission);

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

  return normalizedMission;
};
