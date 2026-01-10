/**
 * Sitemap Generator
 *
 * Generates sitemap.xml from destination and route data.
 * Run with: npm run sitemap
 *
 * Since routes are dynamically generated, we replicate the generation logic here.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const BASE_URL = 'https://bigflightdeals.com';

// ─────────────────────────────────────────────────────────────────────────────
// Hub Origins (must match routes.ts)
// ─────────────────────────────────────────────────────────────────────────────

const HUB_ORIGINS = {
  toronto: 'Toronto',
  montreal: 'Montreal',
  vancouver: 'Vancouver',
  newyork: 'New York',
  boston: 'Boston',
  chicago: 'Chicago',
  miami: 'Miami',
  losangeles: 'Los Angeles',
  sanfrancisco: 'San Francisco',
  london: 'London',
  paris: 'Paris',
  amsterdam: 'Amsterdam',
  berlin: 'Berlin',
  madrid: 'Madrid',
};

// ─────────────────────────────────────────────────────────────────────────────
// Destinations (must match routes.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DESTINATIONS = {
  // Europe
  lisbon: 'Lisbon',
  barcelona: 'Barcelona',
  rome: 'Rome',
  athens: 'Athens',
  prague: 'Prague',
  budapest: 'Budapest',
  istanbul: 'Istanbul',
  paris: 'Paris',
  amsterdam: 'Amsterdam',
  berlin: 'Berlin',
  madrid: 'Madrid',
  porto: 'Porto',
  vienna: 'Vienna',
  milan: 'Milan',
  florence: 'Florence',
  krakow: 'Krakow',
  seville: 'Seville',
  // UK
  london: 'London',
  edinburgh: 'Edinburgh',
  dublin: 'Dublin',
  // Nordics
  reykjavik: 'Reykjavik',
  copenhagen: 'Copenhagen',
  stockholm: 'Stockholm',
  oslo: 'Oslo',
  helsinki: 'Helsinki',
  // Asia
  tokyo: 'Tokyo',
  taipei: 'Taipei',
  bangkok: 'Bangkok',
  hanoi: 'Hanoi',
  bali: 'Bali',
  singapore: 'Singapore',
  seoul: 'Seoul',
  hochiminh: 'Ho Chi Minh City',
  hongkong: 'Hong Kong',
  kualalumpur: 'Kuala Lumpur',
  // Americas
  mexicocity: 'Mexico City',
  medellin: 'Medellin',
  lima: 'Lima',
  buenosaires: 'Buenos Aires',
  bogota: 'Bogota',
  sanjose: 'San Jose',
  santiago: 'Santiago',
  // Caribbean
  sanjuan: 'San Juan',
  havana: 'Havana',
  cancun: 'Cancun',
  puntacana: 'Punta Cana',
};

// ─────────────────────────────────────────────────────────────────────────────
// Route Combinations (must match routes.ts)
// ─────────────────────────────────────────────────────────────────────────────

const NA_ORIGINS = ['toronto', 'montreal', 'vancouver', 'newyork', 'boston', 'chicago', 'miami', 'losangeles', 'sanfrancisco'];
const EUROPE_DESTS = ['lisbon', 'barcelona', 'rome', 'athens', 'prague', 'budapest', 'istanbul', 'paris', 'amsterdam', 'berlin', 'madrid', 'porto', 'vienna', 'milan', 'florence', 'krakow', 'seville'];
const UK_DESTS = ['london', 'edinburgh', 'dublin'];
const NORDIC_DESTS = ['reykjavik', 'copenhagen', 'stockholm', 'oslo', 'helsinki'];
const AMERICAS_DESTS = ['mexicocity', 'medellin', 'lima', 'buenosaires', 'bogota', 'sanjose', 'santiago'];
const CARIBBEAN_DESTS = ['sanjuan', 'havana', 'cancun', 'puntacana'];
const EU_ORIGINS = ['london', 'paris', 'amsterdam', 'berlin', 'madrid'];
const EU_TO_EU_DESTS = ['lisbon', 'barcelona', 'rome', 'athens', 'prague', 'budapest', 'istanbul', 'porto', 'vienna', 'milan', 'florence', 'krakow', 'seville'];
const NA_TO_ASIA_DESTS = ['tokyo', 'taipei', 'bangkok', 'bali', 'singapore', 'seoul', 'hongkong'];
const EU_TO_ASIA_DESTS = ['tokyo', 'bangkok', 'bali', 'singapore', 'seoul', 'hongkong'];

// ─────────────────────────────────────────────────────────────────────────────
// Slug Generation
// ─────────────────────────────────────────────────────────────────────────────

function toSlug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function createSlug(originKey, destKey) {
  const origin = HUB_ORIGINS[originKey];
  const dest = DESTINATIONS[destKey];
  if (!origin || !dest || origin === dest) return null;
  return `${toSlug(origin)}-to-${toSlug(dest)}`;
}

// Generate all route slugs
const routeSlugsSet = new Set();

// North America → Europe
for (const origin of NA_ORIGINS) {
  for (const dest of EUROPE_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// North America → UK/Ireland
for (const origin of NA_ORIGINS) {
  for (const dest of UK_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// North America → Nordics
for (const origin of NA_ORIGINS) {
  for (const dest of NORDIC_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// North America → Asia
for (const origin of NA_ORIGINS) {
  for (const dest of NA_TO_ASIA_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// North America → Americas
for (const origin of NA_ORIGINS) {
  for (const dest of AMERICAS_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// North America → Caribbean
for (const origin of NA_ORIGINS) {
  for (const dest of CARIBBEAN_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// Europe → Europe
for (const origin of EU_ORIGINS) {
  for (const dest of EU_TO_EU_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// Europe → UK/Nordics
for (const origin of EU_ORIGINS) {
  for (const dest of [...UK_DESTS, ...NORDIC_DESTS]) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

// Europe → Asia
for (const origin of EU_ORIGINS) {
  for (const dest of EU_TO_ASIA_DESTS) {
    const slug = createSlug(origin, dest);
    if (slug) routeSlugsSet.add(slug);
  }
}

const routeSlugs = Array.from(routeSlugsSet);

// ─────────────────────────────────────────────────────────────────────────────
// Parse Destination Slugs from destinations.ts
// ─────────────────────────────────────────────────────────────────────────────

const destinationsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/destinations.ts'),
  'utf-8'
);

const destinationSlugs = [];
const destSlugMatches = destinationsFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
for (const match of destSlugMatches) {
  destinationSlugs.push(match[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Pages
// ─────────────────────────────────────────────────────────────────────────────

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/destinations', priority: '0.9', changefreq: 'weekly' },
  { path: '/routes', priority: '0.9', changefreq: 'weekly' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Generate Sitemap XML
// ─────────────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
for (const page of staticPages) {
  xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Add destination pages
for (const slug of destinationSlugs) {
  xml += `  <url>
    <loc>${BASE_URL}/destinations/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add route pages
for (const slug of routeSlugs) {
  xml += `  <url>
    <loc>${BASE_URL}/routes/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

xml += '</urlset>\n';

// Write sitemap
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml);

console.log(`Sitemap generated with ${staticPages.length + destinationSlugs.length + routeSlugs.length} URLs`);
console.log(`- Static pages: ${staticPages.length}`);
console.log(`- Destinations: ${destinationSlugs.length}`);
console.log(`- Routes: ${routeSlugs.length}`);
console.log(`Written to: ${sitemapPath}`);
