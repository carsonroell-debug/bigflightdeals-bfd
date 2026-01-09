/**
 * Sitemap Generator
 *
 * Generates sitemap.xml from destination and route data.
 * Run with: npm run sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const BASE_URL = 'https://bigflightdeals.com';

// Read and parse the destinations data
const destinationsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/destinations.ts'),
  'utf-8'
);

// Read and parse the routes data
const routesFile = fs.readFileSync(
  path.join(__dirname, '../src/data/routes.ts'),
  'utf-8'
);

// Extract slugs from destinations
const destinationSlugs = [];
const destSlugMatches = destinationsFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
for (const match of destSlugMatches) {
  destinationSlugs.push(match[1]);
}

// Extract slugs from routes
const routeSlugs = [];
const routeSlugMatches = routesFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
for (const match of routeSlugMatches) {
  routeSlugs.push(match[1]);
}

// Static pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/destinations', priority: '0.9', changefreq: 'weekly' },
  { path: '/routes', priority: '0.9', changefreq: 'weekly' },
];

// Generate sitemap XML
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
