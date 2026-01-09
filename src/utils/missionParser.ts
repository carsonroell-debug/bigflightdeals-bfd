/**
 * Mission Parser
 * 
 * Heuristic parser for natural language mission input.
 * Extracts budget, days, month, origin hints, and vibe keywords.
 */

export interface ParsedMission {
  originHint?: string;      // e.g. "Toronto"
  budget?: number;            // from $ or CAD pattern
  monthHint?: string;         // "March" etc
  daysHint?: number;          // "10 days"
  vibeHints: string[];        // "warm", "wifi", "beach", "cheap"
}

/**
 * Parse natural language mission text into structured hints.
 */
export const parseMissionText = (text: string): ParsedMission => {
  const lowerText = text.toLowerCase();
  const vibeHints: string[] = [];

  // Extract budget: $1200, 1200, CAD 1200, etc.
  let budget: number | undefined;
  const budgetPatterns = [
    /\$\s*(\d{1,6}(?:,\d{3})*)/,           // $1200, $1,200
    /cad\s*(\d{1,6}(?:,\d{3})*)/i,         // CAD 1200
    /usd\s*(\d{1,6}(?:,\d{3})*)/i,         // USD 1200
    /\b(\d{1,6}(?:,\d{3})*)\s*(?:dollars?|cad|usd)/i, // 1200 dollars
  ];

  for (const pattern of budgetPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      budget = parseInt(match[1].replace(/,/g, ''), 10);
      break;
    }
  }

  // Extract days: "10 days", "7 day", "two weeks" (14), "a week" (7)
  let daysHint: number | undefined;
  const daysPatterns = [
    /\b(\d+)\s*days?\b/i,                   // 10 days, 7 day
    /\b(\d+)\s*weeks?\b/i,                  // 2 weeks -> multiply by 7
    /\bone\s*week\b/i,                      // one week -> 7
    /\btwo\s*weeks\b/i,                     // two weeks -> 14
    /\bthree\s*weeks\b/i,                   // three weeks -> 21
  ];

  for (const pattern of daysPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      if (pattern.source.includes('week')) {
        const num = match[1] ? parseInt(match[1], 10) : 
                   (match[0].includes('one') ? 1 : 
                   (match[0].includes('two') ? 2 : 3));
        daysHint = num * 7;
      } else {
        daysHint = parseInt(match[1], 10);
      }
      break;
    }
  }

  // Extract month: match month names
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  let monthHint: string | undefined;
  for (const month of months) {
    if (lowerText.includes(month)) {
      monthHint = month.charAt(0).toUpperCase() + month.slice(1);
      break;
    }
  }

  // Extract origin hint: Toronto/YYZ/YTO
  let originHint: string | undefined;
  if (lowerText.includes('toronto') || lowerText.includes('yyz') || lowerText.includes('yto')) {
    originHint = 'Toronto';
  }

  // Extract vibe keywords
  const vibeKeywords = [
    'warm', 'cold', 'beach', 'hike', 'city', 'nightlife', 'quiet',
    'wifi', 'wi-fi', 'cheap', 'europe', 'asia', 'se asia', 'southeast asia',
    'portugal', 'spain', 'iberia', 'mediterranean', 'tropical', 'mountains',
    'culture', 'food', 'adventure', 'relax', 'party', 'budget'
  ];

  for (const keyword of vibeKeywords) {
    if (lowerText.includes(keyword)) {
      // Normalize some keywords
      let normalized = keyword;
      if (keyword === 'se asia' || keyword === 'southeast asia') {
        normalized = 'se asia';
      } else if (keyword === 'wi-fi') {
        normalized = 'wifi';
      }
      if (!vibeHints.includes(normalized)) {
        vibeHints.push(normalized);
      }
    }
  }

  return {
    originHint,
    budget,
    monthHint,
    daysHint,
    vibeHints,
  };
};
