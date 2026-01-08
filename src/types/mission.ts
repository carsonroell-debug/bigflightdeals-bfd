/**
 * Mission Types
 * 
 * Formal contract for mission execution - enables AI agent control.
 * This turns the UI into an API surface that can be driven programmatically.
 */

export interface MissionInput {
  origin: string; // IATA code (e.g., "YTO")
  destination: string; // IATA code (e.g., "LIS")
  dateRange?: {
    start: string; // ISO date string (e.g., "2024-06-01")
    end?: string; // ISO date string (e.g., "2024-06-15")
  };
  budget?: {
    amount: number;
    currency: string; // e.g., "CAD", "USD"
  };
  travelerType: "solo" | "couple";
}

/**
 * Extended mission with display names for UI
 */
export interface Mission extends MissionInput {
  originName?: string; // Display name (e.g., "Toronto (YYZ)")
  destinationName?: string; // Display name (e.g., "Lisbon (LIS)")
}
