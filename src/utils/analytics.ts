/**
 * Analytics Utilities
 * 
 * Lightweight analytics helper for tracking user events.
 * Uses GA4 (gtag) if available, falls back to console.log in development.
 */

/**
 * Track an event with optional parameters.
 * 
 * @param eventName - The event name (e.g., "deal_mission_opened")
 * @param params - Optional event parameters
 */
export const track = (eventName: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;

  // Check for gtag (GA4)
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  
  if (typeof gtag === 'function') {
    // Send to GA4
    gtag('event', eventName, {
      event_category: 'bfd',
      ...params,
    });
  } else {
    // Fallback: log to console in development
    console.log(`[Analytics] ${eventName}`, params || {});
  }
};
