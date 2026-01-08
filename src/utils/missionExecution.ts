/**
 * Mission Execution Utilities
 * 
 * Executes missions programmatically - enables AI agent control.
 * This is the API surface that agents can call to trigger flight searches.
 */

import { setSelectedRoute } from './selectedRoute';
import type { MissionInput, Mission } from '../types/mission';

/**
 * Executes a mission by:
 * 1. Prefilling the Travelpayouts widget with route
 * 2. Locking the route in localStorage
 * 3. Emitting mission_executed event to GA4
 * 
 * This function can be called by:
 * - UI components (on button click)
 * - AI agents (via JSON payload)
 * - External systems (via API)
 * - Browser extensions
 * - Telegram bots
 * - Email links
 */
export const executeMission = (mission: MissionInput): void => {
  // 1. Lock the route in localStorage
  setSelectedRoute({
    originCode: mission.origin,
    destinationCode: mission.destination,
    originName: undefined, // Will be populated by UI if available
    destinationName: undefined, // Will be populated by UI if available
  });

  // 2. Emit mission_executed event to GA4
  if (typeof window !== 'undefined') {
    // Check for gtag (GA4) - typed as unknown to avoid any
    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', 'mission_executed', {
        event_category: 'mission',
        event_label: `${mission.origin}_${mission.destination}`,
        origin: mission.origin,
        destination: mission.destination,
        traveler_type: mission.travelerType,
        has_budget: !!mission.budget,
        has_date_range: !!mission.dateRange,
        budget_amount: mission.budget?.amount,
        budget_currency: mission.budget?.currency,
      });
    } else {
      // Fallback: log to console if GA4 not available
      console.log('[executeMission] Mission executed:', {
        origin: mission.origin,
        destination: mission.destination,
        travelerType: mission.travelerType,
        budget: mission.budget,
        dateRange: mission.dateRange,
      });
    }
  }

  // 3. Dispatch custom event for UI components to listen
  window.dispatchEvent(
    new CustomEvent('bfd-mission-executed', {
      detail: mission,
    })
  );
};

/**
 * Converts a MissionInput to a display-friendly Mission
 * by adding display names if available
 */
export const enrichMission = (
  mission: MissionInput,
  originName?: string,
  destinationName?: string
): Mission => {
  return {
    ...mission,
    originName,
    destinationName,
  };
};
