import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { articles } from "../src/lib/articles";
import { authorRoles } from "../src/lib/authors";
import { primaryLocales } from "../src/lib/i18n";
import manifest from "../src/lib/medicine-slug-manifest.json";
import { SITE_URL } from "../src/lib/seo";
import { surgeries } from "../src/lib/surgeries";

const typedManifest = manifest as {
  targetSitemapUrls: number;
  locales: string[];
  localizedStaticPaths: string[];
  sitemapMedicineSlugs: string[];
  articleSlugs: string[];
  surgerySlugs: string[];
  authorSlugs: string[];
};
const locales = [...primaryLocales];
if (JSON.stringify(locales) !== JSON.stringify(typedManifest.locales)) {
  throw new Error("Manifest locale list is stale; run scripts/prepare-static-site.ts first.");
}

const urls = new Set<string>();
const add = (url: string) => {
  const normalized = url.replace(/\/$/, "") + "/";
  if (urls.has(normalized)) throw new Error(`Duplicate sitemap URL: ${normalized}`);
  urls.add(normalized);
};

add(`${SITE_URL}/`);
for (const locale of locales) {
  for (const route of typedManifest.localizedStaticPaths) {
    add(`${SITE_URL}/${locale}/${route}`);
  }
  add(`${SITE_URL}/${locale}/surgeries/`);
  for (const slug of surgeries.map((surgery) => surgery.slug)) add(`${SITE_URL}/${locale}/surgeries/${slug}/`);
  for (const slug of articles.map((article) => article.slug)) add(`${SITE_URL}/${locale}/articles/${slug}/`);
  for (const slug of authorRoles.map((role) => role.slug)) add(`${SITE_URL}/${locale}/authors/${slug}/`);
  for (const slug of typedManifest.sitemapMedicineSlugs) add(`${SITE_URL}/${locale}/medicine/${slug}/`);
}

if (urls.size !== typedManifest.targetSitemapUrls) {
  throw new Error(`Sitemap contains ${urls.size} URLs, expected exactly ${typedManifest.targetSitemapUrls}.`);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...urls].map((url) => `  <url><loc>${url}</loc></url>`),
  '</urlset>',
  "",
].join("\n");

writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with exactly ${urls.size} unique URLs.`);
