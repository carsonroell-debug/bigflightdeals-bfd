/**
 * Mission Store
 * 
 * Centralized localStorage management for mission state.
 * Uses localStorage key: "bfd_mission"
 */

import type { MissionInput } from '../types/mission';

const STORAGE_KEY = 'bfd_mission';

/**
 * Save a mission to localStorage
 */
export const setMission = (mission: MissionInput): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
  } catch (error) {
    console.warn('[missionStore] Failed to save mission to localStorage:', error);
  }
};

/**
 * Get the current mission from localStorage
 */
export const getMission = (): MissionInput | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as MissionInput;
  } catch (error) {
    console.warn('[missionStore] Failed to read mission from localStorage:', error);
    return null;
  }
};

/**
 * Clear the mission from localStorage
 */
export const clearMission = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[missionStore] Failed to clear mission from localStorage:', error);
  }
};
