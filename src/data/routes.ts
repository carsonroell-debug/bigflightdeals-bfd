/**
 * Programmatic SEO Routes Data
 *
 * High-intent flight routes for transactional queries (e.g., "Toronto to Lisbon flights").
 * Each route generates a static, crawlable page that funnels users into Mission Engine.
 *
 * CATALOG: 250+ routes across multiple hub origins and solo-friendly destinations.
 */

import type { MissionV1 } from '../types/mission';

export interface FlightRoute {
  // URL & Identity
  slug: string;                    // URL slug: "toronto-to-lisbon"

  // Origin
  originCity: string;              // "Toronto"
  originIata: string;              // "YYZ" (if known)
  originCountry: string;           // "Canada"

  // Destination
  destCity: string;                // "Lisbon"
  destIata: string;                // "LIS" (if known)
  destCountry: string;             // "Portugal"

  // Categorization
  regionTag: 'europe' | 'asia' | 'americas' | 'caribbean' | 'oceania' | 'africa' | 'nordics' | 'uk';

  // Travel hints
  bestMonths: string[];            // ["March", "April", "May"]
  budgetRange: { min: number; max: number; currency: string };
  tripLengthDays: number;          // Suggested trip length

  // Tags for matching/filtering
  tags: string[];                  // ["solo", "budget", "wifi", "culture"]
}

/**
 * Convert a FlightRoute to a MissionV1 for the Mission Engine.
 * This is the bridge between route pages and the modal/widget.
 */
export const routeToMission = (route: FlightRoute): MissionV1 => {
  // Choose first best month or current+1 if none
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = new Date().getMonth();
  const nextMonth = monthNames[(currentMonth + 1) % 12];
  const month = route.bestMonths.length > 0 ? route.bestMonths[0] : nextMonth;

  // Budget midpoint
  const budgetMidpoint = Math.round((route.budgetRange.min + route.budgetRange.max) / 2);

  return {
    id: route.slug,
    originCode: route.originIata,
    destinationCode: route.destIata,
    originLabel: `${route.originCity} (${route.originIata})`,
    destinationLabel: `${route.destCity} (${route.destIata})`,
    currency: route.budgetRange.currency,
    budget: budgetMidpoint,
    tripLengthDays: route.tripLengthDays,
    month,
    tags: route.tags,
    travelerType: 'solo',
    source: 'deep_link',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Hub Origins Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface HubOrigin {
  city: string;
  iata: string;
  country: string;
  currency: string;
}

const HUB_ORIGINS: Record<string, HubOrigin> = {
  toronto: { city: 'Toronto', iata: 'YYZ', country: 'Canada', currency: 'CAD' },
  montreal: { city: 'Montreal', iata: 'YUL', country: 'Canada', currency: 'CAD' },
  vancouver: { city: 'Vancouver', iata: 'YVR', country: 'Canada', currency: 'CAD' },
  newyork: { city: 'New York', iata: 'JFK', country: 'United States', currency: 'USD' },
  boston: { city: 'Boston', iata: 'BOS', country: 'United States', currency: 'USD' },
  chicago: { city: 'Chicago', iata: 'ORD', country: 'United States', currency: 'USD' },
  miami: { city: 'Miami', iata: 'MIA', country: 'United States', currency: 'USD' },
  losangeles: { city: 'Los Angeles', iata: 'LAX', country: 'United States', currency: 'USD' },
  sanfrancisco: { city: 'San Francisco', iata: 'SFO', country: 'United States', currency: 'USD' },
  london: { city: 'London', iata: 'LHR', country: 'United Kingdom', currency: 'GBP' },
  paris: { city: 'Paris', iata: 'CDG', country: 'France', currency: 'EUR' },
  amsterdam: { city: 'Amsterdam', iata: 'AMS', country: 'Netherlands', currency: 'EUR' },
  berlin: { city: 'Berlin', iata: 'BER', country: 'Germany', currency: 'EUR' },
  madrid: { city: 'Madrid', iata: 'MAD', country: 'Spain', currency: 'EUR' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Destination Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface DestinationConfig {
  city: string;
  iata: string;
  country: string;
  region: FlightRoute['regionTag'];
  bestMonths: string[];
  tripDays: number;
  baseTags: string[];
  budgetTier: 'low' | 'mid' | 'high';
}

const DESTINATIONS: Record<string, DestinationConfig> = {
  // EUROPE
  lisbon: {
    city: 'Lisbon', iata: 'LIS', country: 'Portugal', region: 'europe',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'wifi', 'culture', 'food'], budgetTier: 'low',
  },
  barcelona: {
    city: 'Barcelona', iata: 'BCN', country: 'Spain', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'beach', 'nightlife', 'culture'], budgetTier: 'mid',
  },
  rome: {
    city: 'Rome', iata: 'FCO', country: 'Italy', region: 'europe',
    bestMonths: ['April', 'May', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'history', 'food', 'culture'], budgetTier: 'mid',
  },
  athens: {
    city: 'Athens', iata: 'ATH', country: 'Greece', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'history', 'beach', 'culture'], budgetTier: 'low',
  },
  prague: {
    city: 'Prague', iata: 'PRG', country: 'Czech Republic', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'nightlife', 'history', 'culture'], budgetTier: 'low',
  },
  budapest: {
    city: 'Budapest', iata: 'BUD', country: 'Hungary', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'nightlife', 'history', 'culture'], budgetTier: 'low',
  },
  istanbul: {
    city: 'Istanbul', iata: 'IST', country: 'Turkey', region: 'europe',
    bestMonths: ['April', 'May', 'September', 'October', 'November'],
    tripDays: 7, baseTags: ['solo', 'budget', 'history', 'food', 'culture'], budgetTier: 'low',
  },
  paris: {
    city: 'Paris', iata: 'CDG', country: 'France', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'culture', 'food', 'history'], budgetTier: 'high',
  },
  amsterdam: {
    city: 'Amsterdam', iata: 'AMS', country: 'Netherlands', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'nightlife', 'wifi'], budgetTier: 'mid',
  },
  berlin: {
    city: 'Berlin', iata: 'BER', country: 'Germany', region: 'europe',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'nightlife', 'history', 'culture'], budgetTier: 'mid',
  },
  madrid: {
    city: 'Madrid', iata: 'MAD', country: 'Spain', region: 'europe',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    tripDays: 5, baseTags: ['solo', 'budget', 'food', 'culture', 'nightlife'], budgetTier: 'mid',
  },
  porto: {
    city: 'Porto', iata: 'OPO', country: 'Portugal', region: 'europe',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'low',
  },
  vienna: {
    city: 'Vienna', iata: 'VIE', country: 'Austria', region: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'history', 'food'], budgetTier: 'mid',
  },
  milan: {
    city: 'Milan', iata: 'MXP', country: 'Italy', region: 'europe',
    bestMonths: ['April', 'May', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'food', 'history'], budgetTier: 'mid',
  },
  florence: {
    city: 'Florence', iata: 'FLR', country: 'Italy', region: 'europe',
    bestMonths: ['April', 'May', 'September', 'October'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'food', 'history'], budgetTier: 'mid',
  },
  krakow: {
    city: 'Krakow', iata: 'KRK', country: 'Poland', region: 'europe',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'history', 'culture', 'nightlife'], budgetTier: 'low',
  },
  seville: {
    city: 'Seville', iata: 'SVQ', country: 'Spain', region: 'europe',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'food', 'history'], budgetTier: 'low',
  },

  // UK
  london: {
    city: 'London', iata: 'LHR', country: 'United Kingdom', region: 'uk',
    bestMonths: ['April', 'May', 'June', 'September'],
    tripDays: 7, baseTags: ['solo', 'budget', 'culture', 'history', 'food'], budgetTier: 'high',
  },
  edinburgh: {
    city: 'Edinburgh', iata: 'EDI', country: 'United Kingdom', region: 'uk',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'history', 'culture', 'hiking'], budgetTier: 'mid',
  },
  dublin: {
    city: 'Dublin', iata: 'DUB', country: 'Ireland', region: 'uk',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'nightlife', 'history'], budgetTier: 'mid',
  },

  // NORDICS
  reykjavik: {
    city: 'Reykjavik', iata: 'KEF', country: 'Iceland', region: 'nordics',
    bestMonths: ['June', 'July', 'August', 'September'],
    tripDays: 7, baseTags: ['solo', 'budget', 'hiking', 'culture'], budgetTier: 'high',
  },
  copenhagen: {
    city: 'Copenhagen', iata: 'CPH', country: 'Denmark', region: 'nordics',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'food', 'wifi'], budgetTier: 'high',
  },
  stockholm: {
    city: 'Stockholm', iata: 'ARN', country: 'Sweden', region: 'nordics',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'history', 'wifi'], budgetTier: 'high',
  },
  oslo: {
    city: 'Oslo', iata: 'OSL', country: 'Norway', region: 'nordics',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 5, baseTags: ['solo', 'budget', 'hiking', 'culture', 'wifi'], budgetTier: 'high',
  },
  helsinki: {
    city: 'Helsinki', iata: 'HEL', country: 'Finland', region: 'nordics',
    bestMonths: ['May', 'June', 'July', 'August'],
    tripDays: 5, baseTags: ['solo', 'budget', 'culture', 'wifi'], budgetTier: 'high',
  },

  // ASIA
  tokyo: {
    city: 'Tokyo', iata: 'NRT', country: 'Japan', region: 'asia',
    bestMonths: ['March', 'April', 'October', 'November'],
    tripDays: 14, baseTags: ['solo', 'budget', 'culture', 'food', 'wifi'], budgetTier: 'high',
  },
  taipei: {
    city: 'Taipei', iata: 'TPE', country: 'Taiwan', region: 'asia',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'mid',
  },
  bangkok: {
    city: 'Bangkok', iata: 'BKK', country: 'Thailand', region: 'asia',
    bestMonths: ['November', 'December', 'January', 'February'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'culture', 'nightlife'], budgetTier: 'low',
  },
  hanoi: {
    city: 'Hanoi', iata: 'HAN', country: 'Vietnam', region: 'asia',
    bestMonths: ['October', 'November', 'March', 'April'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'history', 'culture'], budgetTier: 'low',
  },
  bali: {
    city: 'Bali', iata: 'DPS', country: 'Indonesia', region: 'asia',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    tripDays: 14, baseTags: ['solo', 'budget', 'beach', 'wifi', 'culture'], budgetTier: 'mid',
  },
  singapore: {
    city: 'Singapore', iata: 'SIN', country: 'Singapore', region: 'asia',
    bestMonths: ['February', 'March', 'April', 'September', 'October'],
    tripDays: 7, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'mid',
  },
  seoul: {
    city: 'Seoul', iata: 'ICN', country: 'South Korea', region: 'asia',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'mid',
  },
  hochiminh: {
    city: 'Ho Chi Minh City', iata: 'SGN', country: 'Vietnam', region: 'asia',
    bestMonths: ['December', 'January', 'February', 'March'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'history', 'culture'], budgetTier: 'low',
  },
  hongkong: {
    city: 'Hong Kong', iata: 'HKG', country: 'Hong Kong', region: 'asia',
    bestMonths: ['October', 'November', 'December', 'March', 'April'],
    tripDays: 7, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'mid',
  },
  kualalumpur: {
    city: 'Kuala Lumpur', iata: 'KUL', country: 'Malaysia', region: 'asia',
    bestMonths: ['January', 'February', 'June', 'July'],
    tripDays: 7, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'low',
  },

  // AMERICAS
  mexicocity: {
    city: 'Mexico City', iata: 'MEX', country: 'Mexico', region: 'americas',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    tripDays: 7, baseTags: ['solo', 'budget', 'food', 'culture', 'wifi'], budgetTier: 'low',
  },
  medellin: {
    city: 'Medellin', iata: 'MDE', country: 'Colombia', region: 'americas',
    bestMonths: ['December', 'January', 'February', 'July', 'August'],
    tripDays: 10, baseTags: ['solo', 'budget', 'wifi', 'culture', 'nightlife'], budgetTier: 'low',
  },
  lima: {
    city: 'Lima', iata: 'LIM', country: 'Peru', region: 'americas',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'history', 'culture'], budgetTier: 'low',
  },
  buenosaires: {
    city: 'Buenos Aires', iata: 'EZE', country: 'Argentina', region: 'americas',
    bestMonths: ['October', 'November', 'March', 'April'],
    tripDays: 10, baseTags: ['solo', 'budget', 'food', 'nightlife', 'culture'], budgetTier: 'mid',
  },
  bogota: {
    city: 'Bogota', iata: 'BOG', country: 'Colombia', region: 'americas',
    bestMonths: ['December', 'January', 'February', 'March'],
    tripDays: 7, baseTags: ['solo', 'budget', 'culture', 'food', 'history'], budgetTier: 'low',
  },
  sanjose: {
    city: 'San Jose', iata: 'SJO', country: 'Costa Rica', region: 'americas',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    tripDays: 10, baseTags: ['solo', 'budget', 'hiking', 'beach', 'culture'], budgetTier: 'mid',
  },
  santiago: {
    city: 'Santiago', iata: 'SCL', country: 'Chile', region: 'americas',
    bestMonths: ['October', 'November', 'March', 'April'],
    tripDays: 7, baseTags: ['solo', 'budget', 'food', 'culture', 'hiking'], budgetTier: 'mid',
  },

  // CARIBBEAN
  sanjuan: {
    city: 'San Juan', iata: 'SJU', country: 'Puerto Rico', region: 'caribbean',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    tripDays: 5, baseTags: ['solo', 'budget', 'beach', 'history', 'nightlife'], budgetTier: 'mid',
  },
  havana: {
    city: 'Havana', iata: 'HAV', country: 'Cuba', region: 'caribbean',
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    tripDays: 7, baseTags: ['solo', 'budget', 'culture', 'history', 'food'], budgetTier: 'low',
  },
  cancun: {
    city: 'Cancun', iata: 'CUN', country: 'Mexico', region: 'caribbean',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    tripDays: 7, baseTags: ['solo', 'budget', 'beach', 'nightlife'], budgetTier: 'mid',
  },
  puntacana: {
    city: 'Punta Cana', iata: 'PUJ', country: 'Dominican Republic', region: 'caribbean',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    tripDays: 7, baseTags: ['solo', 'budget', 'beach'], budgetTier: 'mid',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Budget Ranges by Route Type
// ─────────────────────────────────────────────────────────────────────────────

type OriginType = 'canada' | 'usa' | 'europe';
type BudgetTier = 'low' | 'mid' | 'high';
type RegionType = 'europe' | 'asia' | 'americas' | 'caribbean' | 'nordics' | 'uk';

const BUDGET_RANGES: Record<OriginType, Record<RegionType, Record<BudgetTier, { min: number; max: number }>>> = {
  canada: {
    europe: { low: { min: 450, max: 700 }, mid: { min: 550, max: 850 }, high: { min: 650, max: 1000 } },
    uk: { low: { min: 500, max: 750 }, mid: { min: 550, max: 850 }, high: { min: 600, max: 950 } },
    nordics: { low: { min: 500, max: 800 }, mid: { min: 600, max: 900 }, high: { min: 700, max: 1100 } },
    asia: { low: { min: 750, max: 1100 }, mid: { min: 900, max: 1300 }, high: { min: 1000, max: 1500 } },
    americas: { low: { min: 350, max: 550 }, mid: { min: 450, max: 700 }, high: { min: 550, max: 850 } },
    caribbean: { low: { min: 350, max: 550 }, mid: { min: 400, max: 650 }, high: { min: 450, max: 700 } },
  },
  usa: {
    europe: { low: { min: 400, max: 650 }, mid: { min: 500, max: 800 }, high: { min: 600, max: 950 } },
    uk: { low: { min: 450, max: 700 }, mid: { min: 500, max: 800 }, high: { min: 550, max: 900 } },
    nordics: { low: { min: 450, max: 750 }, mid: { min: 550, max: 850 }, high: { min: 650, max: 1000 } },
    asia: { low: { min: 700, max: 1000 }, mid: { min: 850, max: 1200 }, high: { min: 950, max: 1400 } },
    americas: { low: { min: 250, max: 450 }, mid: { min: 350, max: 550 }, high: { min: 450, max: 700 } },
    caribbean: { low: { min: 200, max: 400 }, mid: { min: 300, max: 500 }, high: { min: 350, max: 550 } },
  },
  europe: {
    europe: { low: { min: 50, max: 150 }, mid: { min: 100, max: 250 }, high: { min: 150, max: 350 } },
    uk: { low: { min: 50, max: 150 }, mid: { min: 80, max: 200 }, high: { min: 100, max: 250 } },
    nordics: { low: { min: 80, max: 200 }, mid: { min: 120, max: 280 }, high: { min: 150, max: 350 } },
    asia: { low: { min: 400, max: 700 }, mid: { min: 500, max: 850 }, high: { min: 600, max: 1000 } },
    americas: { low: { min: 400, max: 700 }, mid: { min: 500, max: 850 }, high: { min: 600, max: 950 } },
    caribbean: { low: { min: 450, max: 750 }, mid: { min: 550, max: 900 }, high: { min: 650, max: 1000 } },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Route Generation Utility
// ─────────────────────────────────────────────────────────────────────────────

function getOriginType(origin: HubOrigin): OriginType {
  if (origin.country === 'Canada') return 'canada';
  if (origin.country === 'United States') return 'usa';
  return 'europe';
}

function createSlug(origin: string, dest: string): string {
  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${toSlug(origin)}-to-${toSlug(dest)}`;
}

function generateRoute(
  originKey: string,
  destKey: string
): FlightRoute | null {
  const origin = HUB_ORIGINS[originKey];
  const dest = DESTINATIONS[destKey];

  if (!origin || !dest) return null;

  // Skip routes where origin and destination are the same city
  if (origin.city === dest.city) return null;

  const originType = getOriginType(origin);
  const regionForBudget = (dest.region === 'oceania' || dest.region === 'africa') ? 'europe' : dest.region;
  const budgetConfig = BUDGET_RANGES[originType]?.[regionForBudget]?.[dest.budgetTier];

  if (!budgetConfig) return null;

  return {
    slug: createSlug(origin.city, dest.city),
    originCity: origin.city,
    originIata: origin.iata,
    originCountry: origin.country,
    destCity: dest.city,
    destIata: dest.iata,
    destCountry: dest.country,
    regionTag: dest.region,
    bestMonths: dest.bestMonths,
    budgetRange: { ...budgetConfig, currency: origin.currency },
    tripLengthDays: dest.tripDays,
    tags: dest.baseTags,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Combinations
// ─────────────────────────────────────────────────────────────────────────────

// North American origins to European destinations
const NA_ORIGINS = ['toronto', 'montreal', 'vancouver', 'newyork', 'boston', 'chicago', 'miami', 'losangeles', 'sanfrancisco'];
const EUROPE_DESTS = ['lisbon', 'barcelona', 'rome', 'athens', 'prague', 'budapest', 'istanbul', 'paris', 'amsterdam', 'berlin', 'madrid', 'porto', 'vienna', 'milan', 'florence', 'krakow', 'seville'];
const UK_DESTS = ['london', 'edinburgh', 'dublin'];
const NORDIC_DESTS = ['reykjavik', 'copenhagen', 'stockholm', 'oslo', 'helsinki'];
const AMERICAS_DESTS = ['mexicocity', 'medellin', 'lima', 'buenosaires', 'bogota', 'sanjose', 'santiago'];
const CARIBBEAN_DESTS = ['sanjuan', 'havana', 'cancun', 'puntacana'];

// European origins for intra-Europe and Europe→Asia routes
const EU_ORIGINS = ['london', 'paris', 'amsterdam', 'berlin', 'madrid'];
const EU_TO_EU_DESTS = ['lisbon', 'barcelona', 'rome', 'athens', 'prague', 'budapest', 'istanbul', 'porto', 'vienna', 'milan', 'florence', 'krakow', 'seville'];
const EU_TO_ASIA_DESTS = ['tokyo', 'bangkok', 'bali', 'singapore', 'seoul', 'hongkong'];

// ─────────────────────────────────────────────────────────────────────────────
// Generate Routes Array
// ─────────────────────────────────────────────────────────────────────────────

const generatedRoutes: FlightRoute[] = [];

// North America → Europe
for (const origin of NA_ORIGINS) {
  for (const dest of EUROPE_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// North America → UK/Ireland
for (const origin of NA_ORIGINS) {
  for (const dest of UK_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// North America → Nordics
for (const origin of NA_ORIGINS) {
  for (const dest of NORDIC_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// North America → Asia (select destinations to keep manageable)
const NA_TO_ASIA_DESTS = ['tokyo', 'taipei', 'bangkok', 'bali', 'singapore', 'seoul', 'hongkong'];
for (const origin of NA_ORIGINS) {
  for (const dest of NA_TO_ASIA_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// North America → Americas
for (const origin of NA_ORIGINS) {
  for (const dest of AMERICAS_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// North America → Caribbean
for (const origin of NA_ORIGINS) {
  for (const dest of CARIBBEAN_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// Europe → Europe (intra-Europe, major hubs only)
for (const origin of EU_ORIGINS) {
  for (const dest of EU_TO_EU_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// Europe → UK/Nordics
for (const origin of EU_ORIGINS) {
  for (const dest of [...UK_DESTS, ...NORDIC_DESTS]) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// Europe → Asia (select routes)
for (const origin of EU_ORIGINS) {
  for (const dest of EU_TO_ASIA_DESTS) {
    const route = generateRoute(origin, dest);
    if (route) generatedRoutes.push(route);
  }
}

// Deduplicate by slug (should already be unique but safety check)
const slugSet = new Set<string>();
export const routes: FlightRoute[] = generatedRoutes.filter((route) => {
  if (slugSet.has(route.slug)) return false;
  slugSet.add(route.slug);
  return true;
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get route by slug.
 */
export const getRouteBySlug = (slug: string): FlightRoute | undefined => {
  return routes.find((r) => r.slug === slug);
};

/**
 * Get all route slugs for routing/sitemap.
 */
export const getRouteSlugs = (): string[] => {
  return routes.map((r) => r.slug);
};

/**
 * Get routes grouped by region.
 */
export const getRoutesByRegion = (): Record<string, FlightRoute[]> => {
  return routes.reduce<Record<string, FlightRoute[]>>((acc, route) => {
    // Capitalize region tag for display
    const regionDisplay: Record<string, string> = {
      europe: 'Europe',
      asia: 'Asia',
      americas: 'Americas',
      caribbean: 'Caribbean',
      oceania: 'Oceania',
      africa: 'Africa',
      nordics: 'Nordics',
      uk: 'UK & Ireland',
    };
    const region = regionDisplay[route.regionTag] || route.regionTag.charAt(0).toUpperCase() + route.regionTag.slice(1);
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(route);
    return acc;
  }, {});
};

/**
 * Get routes to a specific destination (for internal linking).
 */
export const getRoutesToDestination = (destCity: string, limit = 4): FlightRoute[] => {
  return routes
    .filter((r) => r.destCity.toLowerCase() === destCity.toLowerCase())
    .slice(0, limit);
};

/**
 * Get routes from a specific origin (for internal linking).
 */
export const getRoutesFromOrigin = (originCity: string, limit = 6): FlightRoute[] => {
  return routes
    .filter((r) => r.originCity.toLowerCase() === originCity.toLowerCase())
    .slice(0, limit);
};

/**
 * Get popular routes (for homepage section).
 */
export const getPopularRoutes = (limit = 6): FlightRoute[] => {
  // Prioritize diverse regions and common destinations
  const priorityDestinations = ['Lisbon', 'Barcelona', 'Mexico City', 'Tokyo', 'London', 'Bangkok'];
  const popular: FlightRoute[] = [];

  for (const dest of priorityDestinations) {
    // Find Toronto route first, then any North American origin
    const torontoRoute = routes.find((r) => r.destCity === dest && r.originCity === 'Toronto');
    const anyRoute = routes.find((r) => r.destCity === dest);
    const route = torontoRoute || anyRoute;
    if (route && popular.length < limit) {
      popular.push(route);
    }
  }

  // Fill remaining slots with Toronto routes
  for (const route of routes) {
    if (!popular.includes(route) && popular.length < limit && route.originCity === 'Toronto') {
      popular.push(route);
    }
  }

  return popular.slice(0, limit);
};
