/**
 * Build script: generates a static sitemap.xml from the medicine catalog.
 * Run after build-medicines-json.ts and before next build.
 *
 * Usage: npx tsx scripts/build-sitemap.ts
 */

import { writeFileSync } from "fs";
import { join } from "path";

const baseUrl = "https://jivan.health";
const locales = ["en", "de", "fr", "es", "it"];
const now = new Date().toISOString();

// Static pages
const staticPaths = [
  "", "search", "mission", "support", "articles", "about", "contact",
  "editorial-policy", "methodology", "privacy", "terms", "medical-disclaimer", "corrections",
];

// Load medicines
const medicines = require("../public/data/medicines.json");
const verified = medicines.filter((m: any) => m.priceStatus === "market_checked");

const urls: string[] = [];

// Add static pages for all locales
for (const locale of locales) {
  for (const path of staticPaths) {
    const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
    urls.push(`<url><loc>${url}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${path === "" ? "1.0" : path === "search" ? "0.9" : "0.6"}</priority></url>`);
  }
}

// Add medicine pages (only verified/market-checked, up to 500)
for (const m of verified.slice(0, 500)) {
  for (const locale of locales) {
    urls.push(`<url><loc>${baseUrl}/${locale}/medicine/${m.slug}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml);
console.log(`✓ Wrote sitemap.xml with ${urls.length} URLs`);