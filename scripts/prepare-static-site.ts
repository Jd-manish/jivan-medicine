import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import medicineRows from "../public/data/medicines.json";
import { articles, legacyArticleRedirects } from "../src/lib/articles";
import { surgeryArticles } from "../src/lib/articles-surgery";
import { authorRoles } from "../src/lib/authors";
import { primaryLocales } from "../src/lib/i18n";
import { INDEXABLE_LOCALES, SITE_URL } from "../src/lib/seo";
import { surgeries } from "../src/lib/surgeries";
import { surgeryPriceEvidence } from "../src/lib/surgery-price-evidence";
import { matchesMedicineSearch, misspellingCorrection } from "../src/lib/search-utils";
import { searchProcedureIndex, surgerySearchIndex } from "../src/lib/surgery-search-index";

// Locales that get the full route set (articles, authors, medicine pages).
const LOCALES = [...primaryLocales];
// Locales allowed into the sitemap / search index. See src/lib/seo.ts.
const SITEMAP_LOCALES = [...INDEXABLE_LOCALES];
const LOCALIZED_STATIC_PATHS = [
  "",
  "search",
  "medicines",
  "mission",
  "support",
  "articles",
  "about",
  "contact",
  "editorial-policy",
  "methodology",
  "privacy",
  "terms",
  "medical-disclaimer",
  "corrections",
];
const outputPath = join(process.cwd(), "src", "lib", "medicine-slug-manifest.json");
const publicDirectory = join(process.cwd(), "public");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const catalog = medicineRows as Array<{
  slug: string;
  name: string;
  genericSalt: string;
  priceStatus: string;
  usEuPrice: number;
  indiaPrice: number;
  brandNames?: string;
  useCases?: string;
  therapyArea?: string;
  category?: string;
}>;
const verified = catalog
  .filter((medicine) => medicine.priceStatus === "market_checked")
  .sort((a, b) => b.usEuPrice / Math.max(b.indiaPrice, 1) - a.usEuPrice / Math.max(a.indiaPrice, 1));
const generatedMedicineSlugs = verified.map((medicine) => medicine.slug);
assert(generatedMedicineSlugs.length > 0, "No market-checked medicine detail pages found.");
assert(new Set(generatedMedicineSlugs).size === generatedMedicineSlugs.length, "Duplicate verified medicine slug found.");

const articleSlugs = articles.map((article) => article.slug);
const surgerySlugs = surgeries.map((surgery) => surgery.slug);
const authorSlugs = authorRoles.map((role) => role.slug);
assert(new Set(articleSlugs).size === articleSlugs.length, "Duplicate article slug found.");
assert(new Set(surgerySlugs).size === surgerySlugs.length, "Duplicate surgery slug found.");
assert(new Set(authorSlugs).size === authorSlugs.length, "Duplicate author-role slug found.");
assert(surgeries.length === 25, `Expected 25 operation pages; found ${surgeries.length}.`);
assert(surgeryArticles.length === 10, `Expected exactly 10 surgery/medical-tourism articles; found ${surgeryArticles.length}.`);

const requiredProcedures = [
  "appendectomy",
  "gallbladder-removal",
  "hysterectomy",
  "ivf-treatment",
  "knee-arthroscopy",
  "pacemaker-implantation",
  "shoulder-replacement",
  "tonsillectomy",
];
for (const slug of requiredProcedures) assert(surgerySlugs.includes(slug), `Missing requested procedure ${slug}.`);

const articleSlugSet = new Set(articleSlugs);
for (const article of articles) {
  for (const relatedSlug of article.related) {
    assert(articleSlugSet.has(relatedSlug), `Article ${article.slug} links to missing related slug ${relatedSlug}.`);
  }
}
for (const [legacySlug, targetSlug] of Object.entries(legacyArticleRedirects)) {
  assert(articleSlugSet.has(targetSlug), `Legacy article ${legacySlug} redirects to missing target ${targetSlug}.`);
}

const marketForPriceKey = {
  india: "India",
  us: "United States",
  eu: "Europe",
  australia: "Australia",
} as const;
for (const surgery of surgeries) {
  const evidence = surgeryPriceEvidence[surgery.slug] ?? [];
  assert(evidence.length > 0, `Operation ${surgery.slug} has no price evidence.`);
  for (const market of Object.keys(marketForPriceKey) as Array<keyof typeof marketForPriceKey>) {
    if (surgery.prices[market]) {
      assert(
        evidence.some((item) => item.market === marketForPriceKey[market]),
        `Operation ${surgery.slug} has a displayed ${market} price without matching market evidence.`,
      );
    }
  }
  for (const item of evidence) {
    assert(/^https:\/\//.test(item.url), `Operation ${surgery.slug} has a non-HTTPS evidence link.`);
    assert(item.publisher.trim().length > 0 && item.reportedPrice.trim().length > 0, `Operation ${surgery.slug} has incomplete evidence.`);
  }
}

const typoCorrection = misspellingCorrection("migrane");
assert(typoCorrection === "migraine", `Expected migrane correction to migraine, got ${typoCorrection}.`);
const migraineCount = catalog.filter((medicine) => matchesMedicineSearch(typoCorrection, medicine)).length;
assert(migraineCount === 145, `Expected 145 migraine matches, found ${migraineCount}.`);
assert(surgerySearchIndex.length === surgeries.length, "Procedure search index and operation route inventory do not match.");
for (const surgery of surgeries) {
  assert(surgerySearchIndex.some((entry) => entry.slug === surgery.slug), `Procedure search index is missing ${surgery.slug}.`);
}
assert(searchProcedureIndex("appendectomy cost India").some((entry) => entry.slug === "appendectomy"), "Procedure search did not match an operation query with cost/market words.");
assert(searchProcedureIndex("shoulder replacement in Australia").some((entry) => entry.slug === "shoulder-replacement"), "Procedure search did not match a natural-language surgery query.");

for (const locale of SITEMAP_LOCALES) {
  assert(LOCALES.includes(locale), `Indexable locale ${locale} is not in the generated route locale set.`);
}

// Every indexable page belongs in the sitemap: all market-checked medicine
// pages (the same manifest generateStaticParams uses), for every indexable
// locale. No artificial URL cap — a page that is indexable but missing from
// the sitemap is just a page Google discovers later, if at all.
const sitemapMedicineSlugs = generatedMedicineSlugs;
const perLocaleUrlCount =
  LOCALIZED_STATIC_PATHS.length + 1 + surgerySlugs.length + articleSlugs.length + authorSlugs.length + sitemapMedicineSlugs.length;
const targetSitemapUrls = 1 + SITEMAP_LOCALES.length * perLocaleUrlCount;
const manifest = {
  targetSitemapUrls,
  locales: LOCALES,
  sitemapLocales: SITEMAP_LOCALES,
  localizedStaticPaths: LOCALIZED_STATIC_PATHS,
  generatedMedicineSlugs,
  sitemapMedicineSlugs,
  articleSlugs,
  surgerySlugs,
  authorSlugs,
};

mkdirSync(join(process.cwd(), "src", "lib"), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

// Preserve link equity for legacy article URLs identified in the content
// registry. Add both slash forms for static hosts with differing normalization.
// Note: Cloudflare Pages `_redirects` cannot express domain-level rules, so
// the www → apex 301 is a Cloudflare Redirect Rule in the dashboard (see
// SEO-INDEXING.md). Every page already declares the apex URL as canonical.
const redirectLines = ["# Generated by scripts/prepare-static-site.ts — do not edit by hand."];
for (const locale of LOCALES) {
  for (const [legacySlug, targetSlug] of Object.entries(legacyArticleRedirects)) {
    for (const trailingSlash of [false, true]) {
      const slash = trailingSlash ? "/" : "";
      redirectLines.push(`/${locale}/articles/${legacySlug}${slash} /${locale}/articles/${targetSlug}/ 301`);
    }
  }
}

// Locale-less URL shapes. The site was served from an earlier Netlify
// deployment before it moved to Cloudflare Pages on the same domain, and a
// link, bookmark or social post from that period points at /medicines/ rather
// than /en/medicines/. Those requests would otherwise 404. English is the
// indexable locale, so it is the correct target for every bare path; none of
// these prefixes exist at the site root today, so no live URL is affected.
for (const path of LOCALIZED_STATIC_PATHS) {
  if (!path) continue;
  for (const trailingSlash of [false, true]) {
    const slash = trailingSlash ? "/" : "";
    redirectLines.push(`/${path}${slash} /en/${path}/ 301`);
  }
}
for (const section of ["articles", "surgeries", "medicine"]) {
  redirectLines.push(`/${section}/* /en/${section}/:splat 301`);
}
writeFileSync(join(publicDirectory, "_redirects"), `${redirectLines.join("\n")}\n`);

// robots.txt is generated so the Sitemap directive can never drift from the
// configured NEXT_PUBLIC_SITE_URL. Everything is crawlable: pages that must
// stay out of the index carry a <meta name="robots" content="noindex">, which
// Google can only see if it is allowed to fetch them.
const robotsLines = [
  "# Generated by scripts/prepare-static-site.ts — do not edit by hand.",
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
];
writeFileSync(join(publicDirectory, "robots.txt"), `${robotsLines.join("\n")}\n`);

console.log(`Prepared ${generatedMedicineSlugs.length} generated medicine slugs (all included in the sitemap for ${SITEMAP_LOCALES.join(", ")}).`);
console.log(`Prepared ${articleSlugs.length} article routes, ${surgerySlugs.length} surgery routes, ${authorSlugs.length} author routes, and ${targetSitemapUrls} sitemap URLs.`);
console.log(`Wrote public/robots.txt pointing at ${SITE_URL}/sitemap.xml.`);
console.log(`Search regression check: migrane → migraine (${migraineCount} results).`);
