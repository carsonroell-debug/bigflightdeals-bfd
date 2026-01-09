/**
 * Programmatic SEO Routes Data
 *
 * High-intent flight routes for transactional queries (e.g., "Toronto to Lisbon flights").
 * Each route generates a static, crawlable page that funnels users into Mission Engine.
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
  regionTag: 'europe' | 'asia' | 'americas' | 'caribbean' | 'oceania' | 'africa';

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
// Routes Database - 20+ high-intent routes from Toronto
// ─────────────────────────────────────────────────────────────────────────────

export const routes: FlightRoute[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // EUROPE
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'toronto-to-lisbon',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Lisbon',
    destIata: 'LIS',
    destCountry: 'Portugal',
    regionTag: 'europe',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    budgetRange: { min: 450, max: 700, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'budget', 'wifi', 'culture', 'walkable', 'europe'],
  },
  {
    slug: 'toronto-to-barcelona',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Barcelona',
    destIata: 'BCN',
    destCountry: 'Spain',
    regionTag: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    budgetRange: { min: 500, max: 750, currency: 'CAD' },
    tripLengthDays: 8,
    tags: ['solo', 'beach', 'nightlife', 'culture', 'food', 'europe'],
  },
  {
    slug: 'toronto-to-london',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'London',
    destIata: 'LHR',
    destCountry: 'United Kingdom',
    regionTag: 'europe',
    bestMonths: ['April', 'May', 'June', 'September'],
    budgetRange: { min: 500, max: 900, currency: 'CAD' },
    tripLengthDays: 7,
    tags: ['solo', 'culture', 'museums', 'history', 'europe'],
  },
  {
    slug: 'toronto-to-paris',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Paris',
    destIata: 'CDG',
    destCountry: 'France',
    regionTag: 'europe',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    budgetRange: { min: 550, max: 850, currency: 'CAD' },
    tripLengthDays: 7,
    tags: ['solo', 'culture', 'food', 'art', 'romantic', 'europe'],
  },
  {
    slug: 'toronto-to-madrid',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Madrid',
    destIata: 'MAD',
    destCountry: 'Spain',
    regionTag: 'europe',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    budgetRange: { min: 520, max: 720, currency: 'CAD' },
    tripLengthDays: 6,
    tags: ['solo', 'culture', 'nightlife', 'food', 'museums', 'europe'],
  },
  {
    slug: 'toronto-to-porto',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Porto',
    destIata: 'OPO',
    destCountry: 'Portugal',
    regionTag: 'europe',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    budgetRange: { min: 480, max: 650, currency: 'CAD' },
    tripLengthDays: 5,
    tags: ['solo', 'budget', 'wine', 'culture', 'walkable', 'europe'],
  },
  {
    slug: 'toronto-to-dublin',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Dublin',
    destIata: 'DUB',
    destCountry: 'Ireland',
    regionTag: 'europe',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    budgetRange: { min: 450, max: 700, currency: 'CAD' },
    tripLengthDays: 6,
    tags: ['solo', 'pubs', 'culture', 'english-speaking', 'europe'],
  },
  {
    slug: 'toronto-to-reykjavik',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Reykjavik',
    destIata: 'KEF',
    destCountry: 'Iceland',
    regionTag: 'europe',
    bestMonths: ['June', 'July', 'August', 'September'],
    budgetRange: { min: 400, max: 600, currency: 'CAD' },
    tripLengthDays: 5,
    tags: ['solo', 'nature', 'adventure', 'northern-lights', 'europe'],
  },
  {
    slug: 'toronto-to-amsterdam',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Amsterdam',
    destIata: 'AMS',
    destCountry: 'Netherlands',
    regionTag: 'europe',
    bestMonths: ['April', 'May', 'June', 'September'],
    budgetRange: { min: 550, max: 800, currency: 'CAD' },
    tripLengthDays: 5,
    tags: ['solo', 'culture', 'cycling', 'museums', 'nightlife', 'europe'],
  },
  {
    slug: 'toronto-to-rome',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Rome',
    destIata: 'FCO',
    destCountry: 'Italy',
    regionTag: 'europe',
    bestMonths: ['April', 'May', 'September', 'October'],
    budgetRange: { min: 600, max: 900, currency: 'CAD' },
    tripLengthDays: 7,
    tags: ['solo', 'history', 'food', 'culture', 'art', 'europe'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ASIA
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'toronto-to-tokyo',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Tokyo',
    destIata: 'NRT',
    destCountry: 'Japan',
    regionTag: 'asia',
    bestMonths: ['March', 'April', 'October', 'November'],
    budgetRange: { min: 900, max: 1400, currency: 'CAD' },
    tripLengthDays: 14,
    tags: ['solo', 'culture', 'food', 'safe', 'technology', 'asia'],
  },
  {
    slug: 'toronto-to-bangkok',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Bangkok',
    destIata: 'BKK',
    destCountry: 'Thailand',
    regionTag: 'asia',
    bestMonths: ['November', 'December', 'January', 'February'],
    budgetRange: { min: 750, max: 1100, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'budget', 'food', 'temples', 'backpacker', 'asia'],
  },
  {
    slug: 'toronto-to-ho-chi-minh-city',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Ho Chi Minh City',
    destIata: 'SGN',
    destCountry: 'Vietnam',
    regionTag: 'asia',
    bestMonths: ['December', 'January', 'February', 'March'],
    budgetRange: { min: 800, max: 1100, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'budget', 'food', 'coffee', 'history', 'asia'],
  },
  {
    slug: 'toronto-to-bali',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Bali',
    destIata: 'DPS',
    destCountry: 'Indonesia',
    regionTag: 'asia',
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    budgetRange: { min: 1000, max: 1500, currency: 'CAD' },
    tripLengthDays: 14,
    tags: ['solo', 'beach', 'yoga', 'digital-nomad', 'wifi', 'asia'],
  },
  {
    slug: 'toronto-to-seoul',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Seoul',
    destIata: 'ICN',
    destCountry: 'South Korea',
    regionTag: 'asia',
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    budgetRange: { min: 900, max: 1300, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'food', 'technology', 'nightlife', 'culture', 'asia'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AMERICAS
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'toronto-to-mexico-city',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Mexico City',
    destIata: 'MEX',
    destCountry: 'Mexico',
    regionTag: 'americas',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    budgetRange: { min: 350, max: 550, currency: 'CAD' },
    tripLengthDays: 7,
    tags: ['solo', 'budget', 'food', 'culture', 'wifi', 'americas'],
  },
  {
    slug: 'toronto-to-bogota',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Bogota',
    destIata: 'BOG',
    destCountry: 'Colombia',
    regionTag: 'americas',
    bestMonths: ['December', 'January', 'February', 'March'],
    budgetRange: { min: 400, max: 650, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'budget', 'coffee', 'culture', 'digital-nomad', 'americas'],
  },
  {
    slug: 'toronto-to-lima',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Lima',
    destIata: 'LIM',
    destCountry: 'Peru',
    regionTag: 'americas',
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    budgetRange: { min: 500, max: 800, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'food', 'adventure', 'culture', 'history', 'americas'],
  },
  {
    slug: 'toronto-to-buenos-aires',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Buenos Aires',
    destIata: 'EZE',
    destCountry: 'Argentina',
    regionTag: 'americas',
    bestMonths: ['October', 'November', 'March', 'April'],
    budgetRange: { min: 700, max: 1100, currency: 'CAD' },
    tripLengthDays: 12,
    tags: ['solo', 'budget', 'food', 'nightlife', 'culture', 'americas'],
  },
  {
    slug: 'toronto-to-medellin',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Medellin',
    destIata: 'MDE',
    destCountry: 'Colombia',
    regionTag: 'americas',
    bestMonths: ['December', 'January', 'February', 'July', 'August'],
    budgetRange: { min: 450, max: 700, currency: 'CAD' },
    tripLengthDays: 10,
    tags: ['solo', 'budget', 'wifi', 'digital-nomad', 'spring-weather', 'americas'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CARIBBEAN
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'toronto-to-san-juan',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'San Juan',
    destIata: 'SJU',
    destCountry: 'Puerto Rico',
    regionTag: 'caribbean',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    budgetRange: { min: 350, max: 550, currency: 'CAD' },
    tripLengthDays: 5,
    tags: ['solo', 'beach', 'history', 'nightlife', 'us-territory', 'caribbean'],
  },
  {
    slug: 'toronto-to-havana',
    originCity: 'Toronto',
    originIata: 'YYZ',
    originCountry: 'Canada',
    destCity: 'Havana',
    destIata: 'HAV',
    destCountry: 'Cuba',
    regionTag: 'caribbean',
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    budgetRange: { min: 400, max: 600, currency: 'CAD' },
    tripLengthDays: 7,
    tags: ['solo', 'budget', 'culture', 'history', 'music', 'caribbean'],
  },
];

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
    const region = route.regionTag.charAt(0).toUpperCase() + route.regionTag.slice(1);
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
 * Get popular routes (for homepage section).
 */
export const getPopularRoutes = (limit = 6): FlightRoute[] => {
  // Prioritize diverse regions and common destinations
  const priorityDestinations = ['Lisbon', 'Barcelona', 'Mexico City', 'Tokyo', 'London', 'Bangkok'];
  const popular: FlightRoute[] = [];

  for (const dest of priorityDestinations) {
    const route = routes.find((r) => r.destCity === dest);
    if (route && popular.length < limit) {
      popular.push(route);
    }
  }

  // Fill remaining slots
  for (const route of routes) {
    if (!popular.includes(route) && popular.length < limit) {
      popular.push(route);
    }
  }

  return popular.slice(0, limit);
};
