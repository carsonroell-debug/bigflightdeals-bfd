/**
 * Mission Suggestions
 * 
 * Rules-based mission suggestion generator (v1 heuristic).
 * Generates 1-3 route suggestions based on parsed mission hints.
 */

import type { MissionInput } from '../types/mission';
import type { ParsedMission } from './missionParser';

/**
 * Route database for suggestions
 */
interface RouteSuggestion {
  id: string;
  originCode: string;
  destinationCode: string;
  originLabel: string;
  destinationLabel: string;
  rationale: string;
  minBudget?: number;
  goodMonths?: string[];
  vibeMatch?: string[];
}

const ROUTE_DATABASE: RouteSuggestion[] = [
  {
    id: 'yto-lis',
    originCode: 'YTO',
    destinationCode: 'LIS',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Lisbon (LIS)',
    rationale: 'Perfect for shoulder season. Great Wi-Fi, walkable city, excellent food scene. Budget-friendly once you arrive.',
    minBudget: 500,
    goodMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    vibeMatch: ['warm', 'wifi', 'europe', 'portugal', 'city', 'food'],
  },
  {
    id: 'yto-bcn',
    originCode: 'YTO',
    destinationCode: 'BCN',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Barcelona (BCN)',
    rationale: 'Vibrant city with beaches nearby. Great for solo travelers who want culture, nightlife, and good Wi-Fi.',
    minBudget: 600,
    goodMonths: ['April', 'May', 'June', 'September', 'October'],
    vibeMatch: ['warm', 'wifi', 'europe', 'spain', 'city', 'nightlife', 'beach'],
  },
  {
    id: 'yto-mad',
    originCode: 'YTO',
    destinationCode: 'MAD',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Madrid (MAD)',
    rationale: 'Central Spain hub. Direct flights available. Perfect base for exploring Iberia solo.',
    minBudget: 580,
    goodMonths: ['March', 'April', 'May', 'October', 'November'],
    vibeMatch: ['warm', 'europe', 'spain', 'city', 'food', 'culture'],
  },
  {
    id: 'yto-opo',
    originCode: 'YTO',
    destinationCode: 'OPO',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Porto (OPO)',
    rationale: 'Hidden gem. Smaller airport, fewer crowds, cheaper than Lisbon. Great for a relaxed solo trip.',
    minBudget: 520,
    goodMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    vibeMatch: ['warm', 'europe', 'portugal', 'quiet', 'cheap', 'city'],
  },
  {
    id: 'yto-tfs',
    originCode: 'YTO',
    destinationCode: 'TFS',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Tenerife (TFS)',
    rationale: 'Year-round warm weather. Great Wi-Fi, affordable, perfect for digital nomads or beach lovers.',
    minBudget: 700,
    goodMonths: ['January', 'February', 'March', 'April', 'May', 'September', 'October', 'November', 'December'],
    vibeMatch: ['warm', 'wifi', 'beach', 'tropical', 'relax'],
  },
  {
    id: 'yto-mex',
    originCode: 'YTO',
    destinationCode: 'MEX',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Mexico City (MEX)',
    rationale: 'Incredible value, amazing food, great Wi-Fi. Perfect for budget solo travelers who love culture.',
    minBudget: 600,
    goodMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    vibeMatch: ['warm', 'wifi', 'cheap', 'city', 'food', 'culture', 'budget'],
  },
  {
    id: 'yto-bkk',
    originCode: 'YTO',
    destinationCode: 'BKK',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Bangkok (BKK)',
    rationale: 'Gateway to Southeast Asia. Incredible value, great food, excellent Wi-Fi. Perfect for longer trips.',
    minBudget: 900,
    goodMonths: ['November', 'December', 'January', 'February', 'March'],
    vibeMatch: ['warm', 'wifi', 'asia', 'se asia', 'cheap', 'food', 'culture', 'budget'],
  },
  {
    id: 'yto-sgn',
    originCode: 'YTO',
    destinationCode: 'SGN',
    originLabel: 'Toronto (YTO)',
    destinationLabel: 'Ho Chi Minh City (SGN)',
    rationale: 'Ultra-budget friendly. Amazing food, great Wi-Fi, perfect for digital nomads on a tight budget.',
    minBudget: 950,
    goodMonths: ['November', 'December', 'January', 'February', 'March'],
    vibeMatch: ['warm', 'wifi', 'asia', 'se asia', 'cheap', 'food', 'budget'],
  },
];

/**
 * Score a route suggestion based on parsed mission hints.
 */
const scoreRoute = (route: RouteSuggestion, parsed: ParsedMission): number => {
  let score = 0;

  // Budget match
  if (parsed.budget && route.minBudget) {
    if (parsed.budget >= route.minBudget) {
      score += 10;
    } else {
      score -= 5; // Penalize if budget too low
    }
  }

  // Month match
  if (parsed.monthHint && route.goodMonths) {
    if (route.goodMonths.includes(parsed.monthHint)) {
      score += 8;
    }
  }

  // Vibe match
  if (route.vibeMatch && parsed.vibeHints.length > 0) {
    const matches = route.vibeMatch.filter(v => parsed.vibeHints.includes(v));
    score += matches.length * 3;
  }

  // Days hint (prefer routes that work for the duration)
  if (parsed.daysHint) {
    if (parsed.daysHint >= 7 && parsed.daysHint <= 14) {
      // Most routes work well for 7-14 days
      score += 2;
    }
  }

  return score;
};

/**
 * Generate mission suggestions based on parsed hints.
 */
export const getMissionSuggestions = (parsed: ParsedMission): MissionInput[] => {
  // Default origin to Toronto if not specified
  const originCode = 'YTO';

  // Filter routes that match origin
  const candidateRoutes = ROUTE_DATABASE.filter(
    route => route.originCode === originCode
  );

  // Score and sort routes
  const scoredRoutes = candidateRoutes
    .map(route => ({
      route,
      score: scoreRoute(route, parsed),
    }))
    .filter(item => item.score > 0) // Only include routes with positive scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3

  // Convert to MissionInput
  return scoredRoutes.map(({ route }) => ({
    id: route.id,
    originCode: route.originCode,
    destinationCode: route.destinationCode,
    originLabel: route.originLabel,
    destinationLabel: route.destinationLabel,
    currency: 'CAD',
    budget: parsed.budget,
    travelerType: 'solo',
    notes: route.rationale,
    source: 'mission_input',
  }));
};
