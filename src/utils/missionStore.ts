/**
 * Mission Store
 *
 * Centralized localStorage management for mission state.
 * Keys:
 *   - bfd_mission: Last executed mission
 *   - bfd_saved_missions: Array of saved missions
 *
 * Never throws - fails silently with console warnings if storage unavailable.
 */

import type { MissionV1 } from '../types/mission';

const LAST_MISSION_KEY = 'bfd_mission';
const SAVED_MISSIONS_KEY = 'bfd_saved_missions';

// Soft limit for saved missions (Pro feature teaser)
export const MAX_SAVED_MISSIONS = 3;

// ────────────────────────────────────────────────────────────────────────────
// Last Mission (persists across refresh)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Get the last executed mission from localStorage.
 */
export const getLastMission = (): MissionV1 | null => {
  try {
    const stored = localStorage.getItem(LAST_MISSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as MissionV1;
  } catch (error) {
    console.warn('[missionStore] Failed to read last mission:', error);
    return null;
  }
};

/**
 * Set the last executed mission in localStorage.
 */
export const setLastMission = (mission: MissionV1): void => {
  try {
    localStorage.setItem(LAST_MISSION_KEY, JSON.stringify(mission));
  } catch (error) {
    console.warn('[missionStore] Failed to save last mission:', error);
  }
};

/**
 * Clear the last mission from localStorage.
 */
export const clearLastMission = (): void => {
  try {
    localStorage.removeItem(LAST_MISSION_KEY);
  } catch (error) {
    console.warn('[missionStore] Failed to clear last mission:', error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// Saved Missions (user's bookmarked missions)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Get all saved missions from localStorage.
 */
export const getSavedMissions = (): MissionV1[] => {
  try {
    const stored = localStorage.getItem(SAVED_MISSIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as MissionV1[];
  } catch (error) {
    console.warn('[missionStore] Failed to read saved missions:', error);
    return [];
  }
};

/**
 * Save a mission to the saved missions list.
 * Avoids duplicates by checking mission id.
 */
export const saveMission = (mission: MissionV1): void => {
  try {
    const saved = getSavedMissions();
    // Check for duplicate
    if (saved.some((m) => m.id === mission.id)) {
      console.log('[missionStore] Mission already saved:', mission.id);
      return;
    }
    // Add with timestamp if missing
    const missionToSave: MissionV1 = {
      ...mission,
      createdAt: mission.createdAt || new Date().toISOString(),
    };
    saved.push(missionToSave);
    localStorage.setItem(SAVED_MISSIONS_KEY, JSON.stringify(saved));
  } catch (error) {
    console.warn('[missionStore] Failed to save mission:', error);
  }
};

/**
 * Remove a mission from saved missions by id.
 */
export const removeSavedMission = (id: string): void => {
  try {
    const saved = getSavedMissions();
    const filtered = saved.filter((m) => m.id !== id);
    localStorage.setItem(SAVED_MISSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('[missionStore] Failed to remove saved mission:', error);
  }
};

/**
 * Check if user can save more missions (soft limit).
 * Returns true if under limit, false if at/over limit.
 */
export const canSaveMission = (): boolean => {
  const saved = getSavedMissions();
  return saved.length < MAX_SAVED_MISSIONS;
};

/**
 * Check if last mission is recent (within N days).
 */
export const isLastMissionRecent = (days: number = 7): boolean => {
  const mission = getLastMission();
  if (!mission?.createdAt) return false;

  const createdAt = new Date(mission.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays < days;
};

// ────────────────────────────────────────────────────────────────────────────
// Legacy aliases for backward compatibility
// ────────────────────────────────────────────────────────────────────────────

export const setMission = setLastMission;
export const getMission = getLastMission;
export const clearMission = clearLastMission;
