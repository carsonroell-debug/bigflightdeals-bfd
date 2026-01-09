/**
 * Mission Types
 * 
 * Formal contract for mission execution - enables AI agent control.
 * This turns the UI into an API surface that can be driven programmatically.
 */

export type TravelerType = "solo" | "couple" | "family" | "other";

export interface MissionInput {
  id: string;                // stable id (e.g., "yyz-lis" or uuid)
  originCode: string;        // e.g., "YTO" or "YYZ"
  destinationCode: string;   // e.g., "LIS"
  originLabel: string;       // e.g., "Toronto (YTO)"
  destinationLabel: string;  // e.g., "Lisbon (LIS)"
  currency?: string;         // "CAD"
  budget?: number;           // optional
  dateFlex?: "any" | "weekend" | "weekday" | "exact"; // optional
  travelerType?: TravelerType;
  notes?: string;
  source?: "deals_grid" | "mission_input" | "deep_link";
  createdAt?: string; // ISO string
}

export interface MissionState {
  mission: MissionInput;
  isOpen: boolean;
}
