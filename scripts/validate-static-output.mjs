import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Post-build guard for the static export. Fails the build when a page that
 * is submitted to search engines would not be indexable as deployed:
 *
 *  - every sitemap URL (via the sitemap index) has a generated HTML file
 *  - exactly one <link rel="canonical"> that equals the sitemap URL
 *  - no `noindex` on any submitted URL
 *  - hreflang set matches the indexable-locale configuration
 *  - exactly one <h1>
 *  - non-indexable locales really render `noindex`
 *  - robots.txt advertises the sitemap on the configured host
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jivanrx.online").replace(/\/$/, "");
const publicDir = resolve("public");
const outputDir = resolve("out");
const manifest = JSON.parse(readFileSync(resolve("src/lib/medicine-slug-manifest.json"), "utf8"));
const indexableLocales = manifest.sitemapLocales;
const expectedCount = manifest.targetSitemapUrls;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function locsOf(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function htmlPathFor(url) {
  const relative = url.pathname.replace(/^\/+|\/+$/g, "");
  return relative ? join(outputDir, relative, "index.html") : join(outputDir, "index.html");
}

function robotsDirectives(html) {
  const tags = [...html.matchAll(/<meta\b[^>]*\bname="robots"[^>]*>/gi)].map((match) => match[0]);
  return tags.map((tag) => (tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? "").toLowerCase());
}

assert(existsSync(outputDir), "Static build output folder `out` is missing.");

// ── robots.txt ───────────────────────────────────────────────────────────────
const robotsPath = join(publicDir, "robots.txt");
assert(existsSync(robotsPath), "public/robots.txt is missing; run the static-site preparation first.");
const robots = readFileSync(robotsPath, "utf8");
assert(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), `robots.txt must advertise ${siteUrl}/sitemap.xml.`);
assert(!/^Disallow:\s*\/\s*$/m.test(robots), "robots.txt blocks the whole site.");

// ── IndexNow key file ───────────────────────────────────────────────────────
// IndexNow (Bing/Yandex/Naver) rejects every submission for a host whose key
// file is missing or whose contents do not match the key. Both the source and
// the exported copy are checked so a silent deploy regression cannot break it.
const keyFiles = readdirSync(publicDir).filter((name) => /^[a-f0-9]{8,128}\.txt$/.test(name));
assert(keyFiles.length === 1, `Expected exactly one IndexNow key file (<key>.txt) in public/, found ${keyFiles.length}.`);
const keyName = keyFiles[0];
const keyValue = readFileSync(join(publicDir, keyName), "utf8").trim();
assert(keyValue === keyName.replace(/\.txt$/, ""), `public/${keyName} must contain exactly its own filename without .txt.`);
assert(existsSync(join(outputDir, keyName)), `${keyName} was not copied into out/; IndexNow will reject submissions.`);

// ── sitemap index → child sitemaps ──────────────────────────────────────────
const indexPath = join(publicDir, "sitemap.xml");
assert(existsSync(indexPath), "public/sitemap.xml is missing; run the sitemap build first.");
const indexXml = readFileSync(indexPath, "utf8");
assert(indexXml.includes("<sitemapindex"), "public/sitemap.xml should be a sitemap index.");
const childUrls = locsOf(indexXml);
assert(childUrls.length > 0, "Sitemap index lists no child sitemaps.");

const locs = [];
for (const childUrl of childUrls) {
  const url = new URL(childUrl);
  assert(url.origin === siteUrl, `Unexpected sitemap host ${url.origin} in index.`);
  const childPath = join(publicDir, url.pathname);
  assert(existsSync(childPath), `Child sitemap ${url.pathname} is missing from public/.`);
  assert(existsSync(join(outputDir, url.pathname)), `Child sitemap ${url.pathname} was not copied into out/.`);
  const childXml = readFileSync(childPath, "utf8");
  assert(childXml.includes("<urlset"), `${url.pathname} is not a urlset.`);
  for (const match of childXml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(match[1]), `${url.pathname}: malformed lastmod ${match[1]}.`);
  }
  locs.push(...locsOf(childXml));
}

assert(locs.length === expectedCount, `Expected ${expectedCount} sitemap URLs, found ${locs.length}.`);
assert(new Set(locs).size === locs.length, "Sitemap contains duplicate URLs.");

// ── every submitted URL ──────────────────────────────────────────────────────
let errors = 0;
const fail = (message) => {
  console.error(message);
  errors += 1;
};

for (const loc of locs) {
  const url = new URL(loc);
  assert(url.origin === siteUrl, `Unexpected sitemap host ${url.origin} in ${loc}.`);
  assert(!url.search && !url.hash, `Sitemap URL contains a query or fragment: ${loc}.`);
  assert(url.pathname.endsWith("/"), `Sitemap URL is not slash-canonical: ${loc}.`);

  const htmlPath = htmlPathFor(url);
  if (!existsSync(htmlPath)) {
    fail(`Missing static HTML for ${loc}: ${htmlPath}`);
    continue;
  }
  const html = readFileSync(htmlPath, "utf8");

  const pathParts = url.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const locale = pathParts[0];
  const route = locale ? pathParts.slice(1).join("/") : "";
  if (locale && !indexableLocales.includes(locale)) {
    fail(`${loc}: locale ${locale} is in the sitemap but not in the indexable locale list.`);
  }

  const canonicalTags = [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/g)];
  if (canonicalTags.length !== 1) {
    fail(`${loc}: expected one canonical link, found ${canonicalTags.length}.`);
  } else {
    const canonicalHref = canonicalTags[0][0].match(/\bhref="([^"]+)"/i)?.[1];
    if (canonicalHref !== loc) fail(`${loc}: canonical mismatch (${canonicalHref || "missing href"}).`);
  }

  const directives = robotsDirectives(html);
  if (directives.some((value) => value.includes("noindex") || value.includes("none"))) {
    fail(`${loc}: submitted URL carries a noindex robots directive (${directives.join(" | ")}).`);
  }

  const alternateTags = [...html.matchAll(/<link\b[^>]*\brel="alternate"[^>]*\bhreflang="[^"]*"[^>]*>/gi)].map((match) => match[0]);
  const alternates = new Map(alternateTags.map((tag) => [
    tag.match(/\bhreflang="([^"]+)"/i)?.[1] ?? "",
    tag.match(/\bhref="([^"]+)"/i)?.[1] ?? "",
  ]));
  if (indexableLocales.length < 2) {
    if (alternateTags.length > 0) fail(`${loc}: hreflang emitted although only one locale is indexable.`);
  } else {
    const suffix = route ? `/${route}/` : "/";
    for (const language of indexableLocales) {
      const expectedAlternate = `${siteUrl}/${language}${suffix}`;
      if (alternates.get(language) !== expectedAlternate) {
        fail(`${loc}: missing or incorrect ${language} hreflang alternate (expected ${expectedAlternate}).`);
      }
    }
    const expectedDefault = locale ? `${siteUrl}/en/${route ? `${route}/` : ""}` : `${siteUrl}/`;
    if (alternates.get("x-default") !== expectedDefault) {
      fail(`${loc}: missing or incorrect x-default alternate (expected ${expectedDefault}).`);
    }
  }

  const h1Count = [...html.matchAll(/<h1(?:\s|>)/gi)].length;
  if (h1Count !== 1) fail(`${loc}: expected one H1, found ${h1Count}.`);

  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${loc}: missing <title>.`);
  if (!/<meta\b[^>]*\bname="description"[^>]*\bcontent="[^"]+"/i.test(html)) fail(`${loc}: missing meta description.`);
}

// ── non-indexable locales must say so ───────────────────────────────────────
const nonIndexableLocales = manifest.locales.filter((locale) => !indexableLocales.includes(locale));
const sampleRoutes = ["", "articles", "surgeries", `medicine/${manifest.generatedMedicineSlugs[0]}`];
for (const locale of nonIndexableLocales) {
  for (const route of sampleRoutes) {
    const htmlPath = join(outputDir, locale, route, "index.html");
    if (!existsSync(htmlPath)) continue;
    const directives = robotsDirectives(readFileSync(htmlPath, "utf8"));
    if (!directives.some((value) => value.includes("noindex"))) {
      fail(`/${locale}/${route ? `${route}/` : ""}: non-indexable locale page is missing noindex.`);
    }
  }
}

assert(errors === 0, `${errors} sitemap route validation error(s).`);
console.log(
  `Validated ${locs.length} sitemap URLs across ${childUrls.length} child sitemaps: static files, canonical URLs, ` +
    `indexable robots directives, hreflang policy, titles, descriptions and one H1 each. ` +
    `Non-indexable locales (${nonIndexableLocales.join(", ") || "none"}) render noindex.`,
);
