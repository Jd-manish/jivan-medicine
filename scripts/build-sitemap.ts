import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { articles } from "../src/lib/articles";
import { authorRoles } from "../src/lib/authors";
import manifest from "../src/lib/medicine-slug-manifest.json";
import { INDEXABLE_LOCALES, SITE_URL } from "../src/lib/seo";
import { surgeries } from "../src/lib/surgeries";

/**
 * Sitemap layout
 *
 *   /sitemap.xml                 sitemap index (submit this one in Search Console)
 *   /sitemaps/pages.xml          root + static pages per indexable locale
 *   /sitemaps/articles.xml       guides & case studies (+ author role pages), with lastmod
 *   /sitemaps/procedures.xml     operation / procedure cost pages
 *   /sitemaps/medicines.xml      every market-checked medicine page
 *
 * Splitting by section lets Search Console report "discovered / indexed" per
 * sitemap, which is the quickest way to see which part of the site Google is
 * holding back. Only locales in INDEXABLE_LOCALES are listed; every other
 * locale renders `noindex, follow` and must not be submitted.
 */

const typedManifest = manifest as {
  targetSitemapUrls: number;
  sitemapLocales: string[];
  localizedStaticPaths: string[];
  sitemapMedicineSlugs: string[];
  articleSlugs: string[];
  surgerySlugs: string[];
  authorSlugs: string[];
};

const locales = [...INDEXABLE_LOCALES];
if (JSON.stringify(locales) !== JSON.stringify(typedManifest.sitemapLocales)) {
  throw new Error("Manifest sitemap locale list is stale; run scripts/prepare-static-site.ts first.");
}

type Entry = { loc: string; lastmod?: string };

const seen = new Set<string>();
function entry(url: string, lastmod?: string): Entry {
  const loc = url.replace(/\/$/, "") + "/";
  if (seen.has(loc)) throw new Error(`Duplicate sitemap URL: ${loc}`);
  seen.add(loc);
  return lastmod ? { loc, lastmod } : { loc };
}

function isoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

const pages: Entry[] = [entry(`${SITE_URL}/`)];
const articleEntries: Entry[] = [];
const procedureEntries: Entry[] = [];
const medicineEntries: Entry[] = [];

for (const locale of locales) {
  for (const route of typedManifest.localizedStaticPaths) {
    pages.push(entry(`${SITE_URL}/${locale}/${route}`));
  }
  procedureEntries.push(entry(`${SITE_URL}/${locale}/surgeries/`));
  for (const surgery of surgeries) {
    if (!typedManifest.surgerySlugs.includes(surgery.slug)) throw new Error(`Surgery ${surgery.slug} missing from manifest.`);
    procedureEntries.push(entry(`${SITE_URL}/${locale}/surgeries/${surgery.slug}/`));
  }
  for (const article of articles) {
    if (!typedManifest.articleSlugs.includes(article.slug)) throw new Error(`Article ${article.slug} missing from manifest.`);
    // Only a real editorial date is a valid lastmod; never stamp the build time.
    articleEntries.push(entry(`${SITE_URL}/${locale}/articles/${article.slug}/`, isoDate(article.updatedAt)));
  }
  for (const role of authorRoles) {
    if (!typedManifest.authorSlugs.includes(role.slug)) throw new Error(`Author role ${role.slug} missing from manifest.`);
    articleEntries.push(entry(`${SITE_URL}/${locale}/authors/${role.slug}/`));
  }
  for (const slug of typedManifest.sitemapMedicineSlugs) {
    medicineEntries.push(entry(`${SITE_URL}/${locale}/medicine/${slug}/`));
  }
}

const total = pages.length + articleEntries.length + procedureEntries.length + medicineEntries.length;
if (total !== typedManifest.targetSitemapUrls) {
  throw new Error(`Sitemap contains ${total} URLs, expected exactly ${typedManifest.targetSitemapUrls} from the manifest.`);
}
if (total > 50_000) {
  throw new Error("A single sitemap must not exceed 50,000 URLs; shard the medicines sitemap.");
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function urlset(entries: Entry[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((item) =>
      item.lastmod
        ? `  <url><loc>${escapeXml(item.loc)}</loc><lastmod>${item.lastmod}</lastmod></url>`
        : `  <url><loc>${escapeXml(item.loc)}</loc></url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");
}

const sitemapFiles: Array<{ name: string; entries: Entry[] }> = [
  { name: "pages.xml", entries: pages },
  { name: "articles.xml", entries: articleEntries },
  { name: "procedures.xml", entries: procedureEntries },
  { name: "medicines.xml", entries: medicineEntries },
];

const publicDir = join(process.cwd(), "public");
const sitemapsDir = join(publicDir, "sitemaps");
rmSync(sitemapsDir, { recursive: true, force: true });
mkdirSync(sitemapsDir, { recursive: true });
for (const file of sitemapFiles) {
  writeFileSync(join(sitemapsDir, file.name), urlset(file.entries));
}

const index = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapFiles.map((file) => `  <sitemap><loc>${escapeXml(`${SITE_URL}/sitemaps/${file.name}`)}</loc></sitemap>`),
  "</sitemapindex>",
  "",
].join("\n");
writeFileSync(join(publicDir, "sitemap.xml"), index);

const written = readdirSync(sitemapsDir).sort();
console.log(
  `Wrote public/sitemap.xml (index) + ${written.length} child sitemaps with ${total} unique URLs for ${locales.join(", ")}: ` +
    sitemapFiles.map((file) => `${file.name}=${file.entries.length}`).join(", "),
);
