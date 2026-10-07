import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import medicineRows from "../public/data/medicines.json";
import { articles, legacyArticleRedirects } from "../src/lib/articles";
import { surgeryArticles } from "../src/lib/articles-surgery";
import { authorRoles } from "../src/lib/authors";
import { primaryLocales } from "../src/lib/i18n";
import { surgeries } from "../src/lib/surgeries";
import { surgeryPriceEvidence } from "../src/lib/surgery-price-evidence";
import { matchesMedicineSearch, misspellingCorrection } from "../src/lib/search-utils";
import { searchProcedureIndex, surgerySearchIndex } from "../src/lib/surgery-search-index";

const TARGET_SITEMAP_URLS = 2036;
const LOCALES = [...primaryLocales];
const LOCALIZED_STATIC_PATHS = [
  "",
  "search",
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

const nonMedicineUrlCount = 1 + LOCALES.length * (
  LOCALIZED_STATIC_PATHS.length + 1 + surgerySlugs.length + articleSlugs.length + authorSlugs.length
);
const remainingMedicineUrls = TARGET_SITEMAP_URLS - nonMedicineUrlCount;
assert(remainingMedicineUrls > 0 && remainingMedicineUrls % LOCALES.length === 0,
  `Target ${TARGET_SITEMAP_URLS} cannot be met using the current localized route inventory (${nonMedicineUrlCount} non-medicine URLs).`);
const sitemapMedicineLimit = remainingMedicineUrls / LOCALES.length;
assert(sitemapMedicineLimit <= generatedMedicineSlugs.length,
  `Sitemap needs ${sitemapMedicineLimit} medicine slugs, but only ${generatedMedicineSlugs.length} pages are generated.`);

// Preserve catalog priority order. Every sitemap medicine slug is a subset of
// the exact market-checked route manifest used by generateStaticParams.
const sitemapMedicineSlugs = generatedMedicineSlugs.slice(0, sitemapMedicineLimit);
const manifest = {
  targetSitemapUrls: TARGET_SITEMAP_URLS,
  locales: LOCALES,
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
const redirectLines = ["# Generated by scripts/prepare-static-site.ts — do not edit by hand."];
for (const locale of LOCALES) {
  for (const [legacySlug, targetSlug] of Object.entries(legacyArticleRedirects)) {
    for (const trailingSlash of [false, true]) {
      const slash = trailingSlash ? "/" : "";
      redirectLines.push(`/${locale}/articles/${legacySlug}${slash} /${locale}/articles/${targetSlug}/ 301`);
    }
  }
}
writeFileSync(join(publicDirectory, "_redirects"), `${redirectLines.join("\n")}\n`);

console.log(`Prepared ${generatedMedicineSlugs.length} generated medicine slugs (${sitemapMedicineSlugs.length} included in sitemap per locale set).`);
console.log(`Prepared ${articleSlugs.length} article routes, ${surgerySlugs.length} surgery routes, ${authorSlugs.length} author routes, and ${TARGET_SITEMAP_URLS} target sitemap URLs.`);
console.log(`Search regression check: migrane → migraine (${migraineCount} results).`);
