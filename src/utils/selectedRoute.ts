/**
 * Selected Route Utilities
 * 
 * Manages the selected flight route (origin + destination) in localStorage
 * so the widget can pre-fill the search form.
 */

export interface SelectedRoute {
  originCode: string;
  destinationCode: string;
  originName?: string;
  destinationName?: string;
}

const STORAGE_KEY = 'bfd_selected_route';

/**
 * Save the selected route to localStorage
 */
export const setSelectedRoute = (route: SelectedRoute): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(route));
    // Dispatch custom event to notify components of route change
    window.dispatchEvent(new CustomEvent('bfd-route-selected', { detail: route }));
  } catch (error) {
    console.warn('[selectedRoute] Failed to save route to localStorage:', error);
  }
};

/**
 * Get the selected route from localStorage
 */
export const getSelectedRoute = (): SelectedRoute | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const route = JSON.parse(stored) as SelectedRoute;
    
    // Validate that required fields exist
    if (!route.originCode || !route.destinationCode) {
      console.warn('[selectedRoute] Invalid route data in localStorage');
      clearSelectedRoute();
      return null;
    }
    
    return route;
  } catch (error) {
    console.warn('[selectedRoute] Failed to read route from localStorage:', error);
    return null;
  }
};

/**
 * Clear the selected route from localStorage
 */
export const clearSelectedRoute = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Dispatch custom event to notify components of route clear
    window.dispatchEvent(new CustomEvent('bfd-route-cleared'));
  } catch (error) {
    console.warn('[selectedRoute] Failed to clear route from localStorage:', error);
  }
};
