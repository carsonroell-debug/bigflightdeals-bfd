/**
 * Solo Destinations Data
 *
 * SEO-optimized destination data for solo travelers.
 * Each destination generates a static, crawlable page that feeds into Mission Engine.
 */

import type { MissionV1 } from '../types/mission';

export interface Destination {
  // URL & Identity
  slug: string;                    // URL slug: "lisbon", "barcelona"
  destinationCode: string;         // IATA: "LIS", "BCN"
  destinationName: string;         // "Lisbon", "Barcelona"
  country: string;                 // "Portugal", "Spain"
  region: string;                  // "Europe", "Southeast Asia"

  // Origin (default Toronto for v1)
  originCode: string;
  originName: string;

  // SEO Meta
  seo: {
    title: string;                 // Page title
    description: string;           // Meta description (150-160 chars)
    keywords: string[];            // SEO keywords
  };

  // Content
  hero: {
    tagline: string;               // Short punchy line
    description: string;           // 2-3 sentences
  };

  // Solo Travel Info
  soloScore: number;               // 1-10 solo-friendliness
  soloHighlights: string[];        // Why it's great for solo travelers
  vibes: string[];                 // Tags: "wifi", "beach", "culture"

  // Pricing
  flightBudget: {
    low: number;
    typical: number;
    currency: string;
  };
  dailyBudget: {
    budget: number;
    mid: number;
    currency: string;
  };

  // Timing
  bestMonths: string[];
  avoidMonths: string[];
  idealTripLength: { min: number; max: number };

  // Practical
  visaInfo: string;
  timezone: string;
  languages: string[];
  safetyRating: 'excellent' | 'good' | 'moderate';

  // Content Blocks
  sections: {
    whyGo: string;
    neighborhoods: { name: string; description: string }[];
    soloTips: string[];
    dayTrips: string[];
  };
}

/**
 * Generate a MissionV1 from destination data.
 * This is the bridge between SEO pages and Mission Engine.
 */
export const destinationToMission = (dest: Destination): MissionV1 => ({
  id: `${dest.originCode.toLowerCase()}-${dest.destinationCode.toLowerCase()}`,
  originCode: dest.originCode,
  destinationCode: dest.destinationCode,
  originLabel: `${dest.originName} (${dest.originCode})`,
  destinationLabel: `${dest.destinationName} (${dest.destinationCode})`,
  currency: dest.flightBudget.currency,
  budget: dest.flightBudget.typical,
  tags: dest.vibes,
  travelerType: 'solo',
  notes: dest.hero.description,
  source: 'deep_link',
});

// ─────────────────────────────────────────────────────────────────────────────
// Destination Database
// ─────────────────────────────────────────────────────────────────────────────

export const destinations: Destination[] = [
  {
    slug: 'lisbon',
    destinationCode: 'LIS',
    destinationName: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Lisbon from Toronto | Cheap Flights & Guide',
      description: 'Find cheap flights to Lisbon from Toronto. Perfect for solo travelers: great Wi-Fi, walkable streets, amazing food. Budget flights from $500 CAD.',
      keywords: ['lisbon solo travel', 'toronto to lisbon flights', 'cheap flights lisbon', 'portugal solo trip', 'lisbon digital nomad'],
    },

    hero: {
      tagline: 'Europe\'s best-kept secret for solo travelers',
      description: 'Lisbon offers the perfect blend of old-world charm and modern amenities. Cobblestone streets, world-class pastéis de nata, and some of Europe\'s fastest Wi-Fi make it ideal for solo adventurers and digital nomads alike.',
    },

    soloScore: 9,
    soloHighlights: [
      'Extremely safe for solo travelers',
      'English widely spoken',
      'Excellent public transport',
      'Thriving digital nomad community',
      'Affordable compared to Western Europe',
    ],
    vibes: ['wifi', 'culture', 'food', 'walkable', 'safe', 'europe', 'portugal'],

    flightBudget: { low: 450, typical: 550, currency: 'CAD' },
    dailyBudget: { budget: 50, mid: 80, currency: 'EUR' },

    bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    idealTripLength: { min: 5, max: 14 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 90 days (Schengen)',
    timezone: 'WET (UTC+0, UTC+1 summer)',
    languages: ['Portuguese', 'English'],
    safetyRating: 'excellent',

    sections: {
      whyGo: 'Lisbon consistently ranks among the best cities for solo travelers. The combination of safety, affordability, and culture makes it a no-brainer. The city is compact enough to explore on foot, yet has enough depth for weeks of discovery. Pastéis de nata at Manteigaria, sunset at Miradouro da Senhora do Monte, and late-night fado in Alfama—these are experiences that feel even more special when you\'re on your own schedule.',
      neighborhoods: [
        { name: 'Alfama', description: 'The oldest district. Winding alleys, fado music, and authentic vibes. Best for: atmosphere seekers.' },
        { name: 'Baixa', description: 'Downtown grid. Easy navigation, main shopping, transit hub. Best for: first-timers.' },
        { name: 'Bairro Alto', description: 'Nightlife central. Quiet days, lively nights. Best for: social solo travelers.' },
        { name: 'LX Factory', description: 'Creative hub in converted warehouse. Cafes, shops, Sunday market. Best for: digital nomads.' },
      ],
      soloTips: [
        'Get a Viva Viagem card for metro/tram—much cheaper than single tickets',
        'Book Time Out Market lunch for communal seating and easy solo dining',
        'Join a free walking tour on day one to orient yourself',
        'Work from Copenhagen Coffee Lab or Fábrica Coffee Roasters for fast Wi-Fi',
      ],
      dayTrips: ['Sintra (palaces & castles, 40 min)', 'Cascais (beach town, 30 min)', 'Setúbal (seafood & dolphins, 1 hr)'],
    },
  },

  {
    slug: 'barcelona',
    destinationCode: 'BCN',
    destinationName: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Barcelona from Toronto | Flights & Guide',
      description: 'Book cheap flights to Barcelona from Toronto. Beach, culture, nightlife—perfect for solo travelers. Flights from $600 CAD. Complete solo guide inside.',
      keywords: ['barcelona solo travel', 'toronto to barcelona flights', 'spain solo trip', 'barcelona beach', 'barcelona nightlife'],
    },

    hero: {
      tagline: 'Where beach meets culture meets nightlife',
      description: 'Barcelona delivers everything a solo traveler could want: Mediterranean beaches, Gaudí architecture, world-class dining, and nightlife that doesn\'t start until midnight. It\'s a city where being alone never means being lonely.',
    },

    soloScore: 9,
    soloHighlights: [
      'Beach access right in the city',
      'Incredible food scene with tapas culture',
      'Easy to meet people at hostels and bars',
      'Walkable Gothic Quarter',
      'Strong digital nomad presence',
    ],
    vibes: ['beach', 'nightlife', 'culture', 'food', 'wifi', 'europe', 'spain'],

    flightBudget: { low: 500, typical: 650, currency: 'CAD' },
    dailyBudget: { budget: 60, mid: 100, currency: 'EUR' },

    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    avoidMonths: ['August'],
    idealTripLength: { min: 5, max: 10 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 90 days (Schengen)',
    timezone: 'CET (UTC+1, UTC+2 summer)',
    languages: ['Spanish', 'Catalan', 'English'],
    safetyRating: 'good',

    sections: {
      whyGo: 'Barcelona is the rare city that truly has it all. Morning coffee in the Gothic Quarter, afternoon at Barceloneta Beach, evening tapas crawl through El Born, and late-night drinks on a rooftop bar. The city\'s layout makes solo exploration intuitive, and the tapas culture means eating alone is not just accepted—it\'s the norm.',
      neighborhoods: [
        { name: 'Gothic Quarter', description: 'Medieval maze of streets. Historic, atmospheric, central. Best for: history buffs.' },
        { name: 'El Born', description: 'Trendy bars, boutiques, Picasso Museum. Best for: foodies and nightlife.' },
        { name: 'Gràcia', description: 'Village feel within the city. Local vibe, cute plazas. Best for: longer stays.' },
        { name: 'Barceloneta', description: 'Beach neighborhood. Seafood, sand, sea. Best for: beach lovers.' },
      ],
      soloTips: [
        'Book La Boqueria market tour for a social food experience',
        'Get tapas at the bar—you\'ll chat with locals and other travelers',
        'Visit Sagrada Família at 8am to beat crowds',
        'Use T-Casual card for 10 metro/bus rides at reduced price',
      ],
      dayTrips: ['Montserrat (mountain monastery, 1 hr)', 'Sitges (beach town, 40 min)', 'Girona (Game of Thrones filming, 1.5 hr)'],
    },
  },

  {
    slug: 'porto',
    destinationCode: 'OPO',
    destinationName: 'Porto',
    country: 'Portugal',
    region: 'Europe',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Porto from Toronto | Budget Flights & Guide',
      description: 'Discover Porto solo: cheaper than Lisbon, equally charming. Direct flights from Toronto from $520 CAD. Wine, tiles, and river views await.',
      keywords: ['porto solo travel', 'toronto to porto flights', 'portugal budget travel', 'porto wine', 'douro valley'],
    },

    hero: {
      tagline: 'Lisbon\'s underrated northern sister',
      description: 'Porto offers everything Lisbon does, but with fewer crowds and lower prices. The Douro River views, port wine cellars, and azulejo-covered buildings create a city that feels like a living museum.',
    },

    soloScore: 9,
    soloHighlights: [
      'More affordable than Lisbon',
      'Compact and very walkable',
      'Incredible port wine culture',
      'Fewer tourists, more authentic',
      'Easy day trips to Douro Valley',
    ],
    vibes: ['wine', 'culture', 'budget', 'quiet', 'walkable', 'europe', 'portugal'],

    flightBudget: { low: 480, typical: 550, currency: 'CAD' },
    dailyBudget: { budget: 40, mid: 65, currency: 'EUR' },

    bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    idealTripLength: { min: 4, max: 7 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 90 days (Schengen)',
    timezone: 'WET (UTC+0, UTC+1 summer)',
    languages: ['Portuguese', 'English'],
    safetyRating: 'excellent',

    sections: {
      whyGo: 'Porto is for travelers who\'ve done Lisbon and want something different, or those seeking a more intimate Portuguese experience. The city\'s relationship with port wine means there\'s always a tasting to attend, and the Ribeira district along the Douro is one of Europe\'s most photogenic waterfronts. Solo travelers appreciate the slower pace and genuine warmth of locals.',
      neighborhoods: [
        { name: 'Ribeira', description: 'UNESCO waterfront. Colorful houses, river views. Best for: photos and atmosphere.' },
        { name: 'Baixa', description: 'Downtown shopping and cafes. Bolhão Market, São Bento station. Best for: central base.' },
        { name: 'Foz do Douro', description: 'Where river meets ocean. Beach walks, seafood. Best for: relaxation.' },
        { name: 'Vila Nova de Gaia', description: 'Across the river. Port wine cellars galore. Best for: wine lovers.' },
      ],
      soloTips: [
        'Do a port wine cellar tour in Gaia—easy to join groups',
        'Walk across Dom Luís I Bridge at sunset',
        'Get a francesinha (local sandwich) at Café Santiago',
        'Take the Six Bridges cruise for easy river orientation',
      ],
      dayTrips: ['Douro Valley (wine region, 2 hr)', 'Braga (religious city, 1 hr)', 'Guimarães (birthplace of Portugal, 1 hr)'],
    },
  },

  {
    slug: 'madrid',
    destinationCode: 'MAD',
    destinationName: 'Madrid',
    country: 'Spain',
    region: 'Europe',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Madrid from Toronto | Flights & Guide',
      description: 'Fly to Madrid from Toronto from $580 CAD. Spain\'s capital offers world-class museums, tapas, and nightlife. Perfect hub for solo Iberian adventures.',
      keywords: ['madrid solo travel', 'toronto to madrid flights', 'spain capital', 'prado museum', 'madrid tapas'],
    },

    hero: {
      tagline: 'Spain\'s grand capital, your Iberian launchpad',
      description: 'Madrid combines royal grandeur with neighborhood charm. From the Prado to late-night tapas in La Latina, the city rewards those who stay up late and explore deep. It\'s also the perfect hub for day trips across Spain.',
    },

    soloScore: 8,
    soloHighlights: [
      'World-class museums (Prado, Reina Sofía)',
      'Legendary nightlife scene',
      'Central location for Spain exploration',
      'Excellent high-speed rail connections',
      'Tapas culture welcomes solo diners',
    ],
    vibes: ['culture', 'nightlife', 'food', 'museums', 'hub', 'europe', 'spain'],

    flightBudget: { low: 520, typical: 620, currency: 'CAD' },
    dailyBudget: { budget: 55, mid: 90, currency: 'EUR' },

    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    idealTripLength: { min: 4, max: 7 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 90 days (Schengen)',
    timezone: 'CET (UTC+1, UTC+2 summer)',
    languages: ['Spanish', 'English'],
    safetyRating: 'good',

    sections: {
      whyGo: 'Madrid operates on its own clock—dinner at 10pm, clubs at 2am, churros at 5am. For solo travelers, this extended schedule means more opportunities to meet people and explore. The city\'s excellent metro makes navigation easy, and the concentration of world-class art in the Golden Triangle of museums is unmatched.',
      neighborhoods: [
        { name: 'Sol/Centro', description: 'Heart of the city. Puerta del Sol, Plaza Mayor. Best for: first-time visitors.' },
        { name: 'La Latina', description: 'Sunday Rastro market, tapas bars. Best for: foodies.' },
        { name: 'Malasaña', description: 'Hipster quarter. Vintage shops, craft cocktails. Best for: younger travelers.' },
        { name: 'Chueca', description: 'LGBTQ+ hub. Vibrant, welcoming, great nightlife. Best for: social solo travelers.' },
      ],
      soloTips: [
        'Get the Paseo del Arte ticket for Prado, Reina Sofía, and Thyssen',
        'Join the Sunday El Rastro flea market crowd in La Latina',
        'Book a tapas tour to learn the local way of ordering',
        'Take the high-speed AVE to Toledo for an easy day trip',
      ],
      dayTrips: ['Toledo (medieval city, 30 min AVE)', 'Segovia (aqueduct & roast pig, 30 min AVE)', 'El Escorial (royal monastery, 1 hr)'],
    },
  },

  {
    slug: 'mexico-city',
    destinationCode: 'MEX',
    destinationName: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Mexico City from Toronto | Flights & Guide',
      description: 'Mexico City solo travel guide. Flights from Toronto from $400 CAD. Incredible food, culture, and value. One of the world\'s best cities for solo travelers.',
      keywords: ['mexico city solo travel', 'toronto to mexico city flights', 'cdmx travel', 'mexico city food', 'mexico city digital nomad'],
    },

    hero: {
      tagline: 'Mega-city with mega-value for solo travelers',
      description: 'CDMX is a revelation. World-class museums, street food that rivals fine dining, mezcal bars, ancient ruins, and neighborhoods each with their own personality. Your dollar goes incredibly far here.',
    },

    soloScore: 9,
    soloHighlights: [
      'Incredible value—luxury on a budget',
      'Best street food scene in the Americas',
      'Huge digital nomad community',
      'Rich cultural offerings',
      'Direct flights from Toronto',
    ],
    vibes: ['food', 'culture', 'budget', 'wifi', 'art', 'north-america', 'mexico'],

    flightBudget: { low: 350, typical: 450, currency: 'CAD' },
    dailyBudget: { budget: 35, mid: 60, currency: 'USD' },

    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    avoidMonths: ['June', 'July', 'August', 'September'],
    idealTripLength: { min: 5, max: 14 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 180 days',
    timezone: 'CST (UTC-6)',
    languages: ['Spanish', 'English'],
    safetyRating: 'moderate',

    sections: {
      whyGo: 'Mexico City has transformed into one of the world\'s most exciting destinations. The food scene rivals any global capital, from $2 tacos to innovative tasting menus. The digital nomad community in Roma and Condesa means you\'ll never lack for coworking companions or coffee shop recommendations. And the sheer depth of culture—from Aztec ruins to Frida Kahlo—could fill months.',
      neighborhoods: [
        { name: 'Roma Norte', description: 'Tree-lined streets, cafes, art deco. Best for: digital nomads.' },
        { name: 'Condesa', description: 'Parks, restaurants, expat-friendly. Best for: longer stays.' },
        { name: 'Centro Histórico', description: 'Zócalo, historic buildings, Palacio de Bellas Artes. Best for: culture.' },
        { name: 'Coyoacán', description: 'Frida Kahlo\'s neighborhood. Bohemian, colorful. Best for: art lovers.' },
      ],
      soloTips: [
        'Use Uber—it\'s safe, cheap, and avoids taxi scams',
        'Join a food tour in the first days to learn what to order',
        'Work from Blend Station or Cardinal Casa de Café',
        'Visit Teotihuacán early morning before tour buses arrive',
      ],
      dayTrips: ['Teotihuacán (pyramids, 1 hr)', 'Xochimilco (floating gardens, 1 hr)', 'Puebla (colonial city, 2 hr)'],
    },
  },

  {
    slug: 'bangkok',
    destinationCode: 'BKK',
    destinationName: 'Bangkok',
    country: 'Thailand',
    region: 'Southeast Asia',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Bangkok from Toronto | Flights & Guide',
      description: 'Bangkok solo travel from Toronto. Gateway to Southeast Asia with flights from $800 CAD. Street food paradise, temples, and incredible value.',
      keywords: ['bangkok solo travel', 'toronto to bangkok flights', 'thailand solo trip', 'bangkok street food', 'bangkok temples'],
    },

    hero: {
      tagline: 'Your gateway to Southeast Asia',
      description: 'Bangkok is organized chaos at its finest. Temples glittering next to malls, street food carts beside Michelin restaurants, ancient traditions meeting modern innovation. It\'s overwhelming in the best way.',
    },

    soloScore: 9,
    soloHighlights: [
      'Ultimate backpacker infrastructure',
      'Incredible street food ($1-2 meals)',
      'Easy to meet other travelers',
      'Gateway to Thai islands and beyond',
      'World-class massage and wellness',
    ],
    vibes: ['food', 'temples', 'budget', 'backpacker', 'asia', 'thailand', 'warm'],

    flightBudget: { low: 750, typical: 900, currency: 'CAD' },
    dailyBudget: { budget: 30, mid: 50, currency: 'USD' },

    bestMonths: ['November', 'December', 'January', 'February'],
    avoidMonths: ['April', 'May'],
    idealTripLength: { min: 4, max: 7 },

    visaInfo: 'Canadian citizens: Visa exemption for 30 days on arrival',
    timezone: 'ICT (UTC+7)',
    languages: ['Thai', 'English'],
    safetyRating: 'good',

    sections: {
      whyGo: 'Bangkok is the classic introduction to Southeast Asia for a reason. The infrastructure for solo travelers is unmatched—from hostels to street food to domestic flights. You can live like royalty on a budget, eating your way through street stalls and getting daily massages. The city also serves as a perfect hub for exploring Thailand and beyond.',
      neighborhoods: [
        { name: 'Khao San Road', description: 'Backpacker central. Hostels, bars, chaos. Best for: first-timers, meeting people.' },
        { name: 'Silom/Sathorn', description: 'Business district. Sky bars, upscale dining. Best for: flash solo travelers.' },
        { name: 'Sukhumvit', description: 'Modern Bangkok. Malls, BTS access, diverse food. Best for: longer stays.' },
        { name: 'Old City (Rattanakosin)', description: 'Grand Palace, Wat Pho. Best for: temples and history.' },
      ],
      soloTips: [
        'Get a Rabbit Card for BTS/MRT—saves time and money',
        'Eat where locals eat: if it\'s packed, it\'s good',
        'Book temples early morning before heat and crowds',
        'Use Grab (Southeast Asia\'s Uber) for easy transport',
      ],
      dayTrips: ['Ayutthaya (ancient capital, 1.5 hr)', 'Floating markets (Amphawa, 1.5 hr)', 'Kanchanaburi (River Kwai, 2.5 hr)'],
    },
  },

  {
    slug: 'ho-chi-minh-city',
    destinationCode: 'SGN',
    destinationName: 'Ho Chi Minh City',
    country: 'Vietnam',
    region: 'Southeast Asia',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Ho Chi Minh City from Toronto | Guide',
      description: 'Ho Chi Minh City (Saigon) solo travel guide. Flights from Toronto from $850 CAD. Vietnam\'s buzzing metropolis: pho, coffee, history, and chaos.',
      keywords: ['ho chi minh city solo travel', 'saigon travel', 'vietnam solo trip', 'toronto to vietnam flights', 'vietnam street food'],
    },

    hero: {
      tagline: 'Vietnam\'s unstoppable southern engine',
      description: 'Ho Chi Minh City moves at a pace all its own. Millions of motorbikes, some of the world\'s best coffee, pho for breakfast, and a history that demands attention. It\'s intense, affordable, and utterly captivating.',
    },

    soloScore: 8,
    soloHighlights: [
      'Ultra-affordable daily costs',
      'Coffee culture is unreal',
      'Best pho you\'ll ever have',
      'Growing digital nomad scene',
      'Fascinating war history',
    ],
    vibes: ['food', 'coffee', 'budget', 'history', 'asia', 'vietnam', 'warm'],

    flightBudget: { low: 800, typical: 950, currency: 'CAD' },
    dailyBudget: { budget: 25, mid: 45, currency: 'USD' },

    bestMonths: ['December', 'January', 'February', 'March'],
    avoidMonths: ['June', 'July', 'August', 'September'],
    idealTripLength: { min: 4, max: 7 },

    visaInfo: 'Canadian citizens: e-Visa required (single entry 30 days, ~$25 USD)',
    timezone: 'ICT (UTC+7)',
    languages: ['Vietnamese', 'English'],
    safetyRating: 'good',

    sections: {
      whyGo: 'HCMC is where your travel dollar stretches the furthest. A bowl of pho costs $2, a quality hotel room $25, and a day exploring war history museums is practically free. The coffee culture—with its drip coffee and condensed milk—is addictive. And the energy of the city, with its rivers of motorbikes, is unlike anywhere else.',
      neighborhoods: [
        { name: 'District 1', description: 'Tourist center. War Remnants Museum, Ben Thanh Market. Best for: first-timers.' },
        { name: 'District 3', description: 'Local vibe, great cafes, less touristy. Best for: digital nomads.' },
        { name: 'Thao Dien (District 2)', description: 'Expat area. Western comforts, riverside. Best for: longer stays.' },
        { name: 'Cho Lon (District 5)', description: 'Chinatown. Temples, markets, authentic food. Best for: cultural exploration.' },
      ],
      soloTips: [
        'Cross streets confidently—motorbikes will go around you',
        'Get ca phe sua da (iced milk coffee) from any local shop',
        'Book Cu Chi Tunnels tour for essential history',
        'Use Grab for motorbike taxis—cheapest way to get around',
      ],
      dayTrips: ['Cu Chi Tunnels (war history, 2 hr)', 'Mekong Delta (river life, full day)', 'Vung Tau (beach town, 2 hr)'],
    },
  },

  {
    slug: 'tenerife',
    destinationCode: 'TFS',
    destinationName: 'Tenerife',
    country: 'Spain',
    region: 'Europe',
    originCode: 'YYZ',
    originName: 'Toronto',

    seo: {
      title: 'Solo Travel to Tenerife from Toronto | Flights & Guide',
      description: 'Tenerife solo travel: year-round sunshine in the Canary Islands. Flights from Toronto from $650 CAD. Perfect for digital nomads and beach lovers.',
      keywords: ['tenerife solo travel', 'canary islands', 'toronto to tenerife flights', 'tenerife digital nomad', 'tenerife beaches'],
    },

    hero: {
      tagline: 'Year-round sun in the Atlantic',
      description: 'Tenerife offers what most of Europe can\'t: warm weather in winter. The largest Canary Island has black sand beaches, Spain\'s highest peak, and a growing digital nomad community. It\'s Europe\'s escape from European weather.',
    },

    soloScore: 8,
    soloHighlights: [
      'Warm weather year-round',
      'Strong digital nomad community',
      'Mix of beach and mountain activities',
      'European infrastructure, African sun',
      'Direct flights from many cities',
    ],
    vibes: ['beach', 'warm', 'wifi', 'hiking', 'relaxation', 'europe', 'spain'],

    flightBudget: { low: 600, typical: 750, currency: 'CAD' },
    dailyBudget: { budget: 50, mid: 80, currency: 'EUR' },

    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
    avoidMonths: [],
    idealTripLength: { min: 7, max: 21 },

    visaInfo: 'Canadian citizens: No visa required for stays up to 90 days (Schengen)',
    timezone: 'WET (UTC+0, UTC+1 summer)',
    languages: ['Spanish', 'English'],
    safetyRating: 'excellent',

    sections: {
      whyGo: 'Tenerife is the European digital nomad\'s secret weapon. When the rest of Europe is grey and cold, Tenerife is 22°C and sunny. The island has everything: beaches for morning swims, mountains for weekend hikes, and enough coworking spaces to keep you productive. It\'s like someone designed an island specifically for remote workers who also like piña coladas.',
      neighborhoods: [
        { name: 'Santa Cruz', description: 'Island capital. Local life, shopping, culture. Best for: authentic experience.' },
        { name: 'Puerto de la Cruz', description: 'Northern town. Green, lush, traditional. Best for: nature lovers.' },
        { name: 'Los Cristianos/Playa de las Américas', description: 'Southern resorts. Beaches, nightlife. Best for: beach and party.' },
        { name: 'La Laguna', description: 'UNESCO old town. University city, culture. Best for: history and architecture.' },
      ],
      soloTips: [
        'Rent a car to explore the island properly',
        'Hike Teide National Park—Spain\'s highest point',
        'Work from Restation or The House coworking spaces',
        'Try papas arrugadas con mojo (wrinkly potatoes with sauce)',
      ],
      dayTrips: ['Mount Teide (volcano, half day)', 'Masca Valley (hiking, half day)', 'La Gomera (neighboring island, ferry day trip)'],
    },
  },
];

/**
 * Get destination by slug.
 */
export const getDestinationBySlug = (slug: string): Destination | undefined => {
  return destinations.find((d) => d.slug === slug);
};

/**
 * Get all destination slugs for routing.
 */
export const getDestinationSlugs = (): string[] => {
  return destinations.map((d) => d.slug);
};
