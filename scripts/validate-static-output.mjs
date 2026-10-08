import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jivanrx.online").replace(/\/$/, "");
const sitemapPath = resolve("public/sitemap.xml");
const outputDir = resolve("out");
const expectedCount = 2036;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(existsSync(sitemapPath), "public/sitemap.xml is missing; run the static-site preparation/build first.");
assert(existsSync(outputDir), "Static build output folder `out` is missing.");
const xml = readFileSync(sitemapPath, "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(locs.length === expectedCount, `Expected ${expectedCount} sitemap URLs, found ${locs.length}.`);
assert(new Set(locs).size === locs.length, "Sitemap contains duplicate URLs.");

let errors = 0;
for (const loc of locs) {
  const url = new URL(loc);
  assert(url.origin === siteUrl, `Unexpected sitemap host ${url.origin} in ${loc}.`);
  assert(!url.search && !url.hash, `Sitemap URL contains a query or fragment: ${loc}.`);
  assert(url.pathname.endsWith("/"), `Sitemap URL is not slash-canonical: ${loc}.`);
  const relative = url.pathname.replace(/^\/+|\/+$/g, "");
  const htmlPath = relative ? join(outputDir, relative, "index.html") : join(outputDir, "index.html");
  if (!existsSync(htmlPath)) {
    console.error(`Missing static HTML for ${loc}: ${htmlPath}`);
    errors += 1;
    continue;
  }

  const html = readFileSync(htmlPath, "utf8");
  const canonicalTags = [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/g)];
  if (canonicalTags.length !== 1) {
    console.error(`${loc}: expected one canonical link, found ${canonicalTags.length}.`);
    errors += 1;
  } else {
    const canonicalHref = canonicalTags[0][0].match(/\bhref="([^"]+)"/i)?.[1];
    if (canonicalHref !== loc) {
      console.error(`${loc}: canonical mismatch (${canonicalHref || "missing href"}).`);
      errors += 1;
    }
  }

  const pathParts = url.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const locale = pathParts[0];
  const route = locale ? pathParts.slice(1).join("/") : "";
  const alternateTags = [...html.matchAll(/<link\b[^>]*\brel="alternate"[^>]*>/gi)].map((match) => match[0]);
  const alternates = new Map(alternateTags.map((tag) => [
    tag.match(/\bhreflang="([^"]+)"/i)?.[1] ?? "",
    tag.match(/\bhref="([^"]+)"/i)?.[1] ?? "",
  ]));
  for (const language of ["en", "de", "fr", "es", "it"]) {
    const suffix = route ? `/${route}/` : "/";
    const expectedAlternate = `${siteUrl}/${language}${suffix}`;
    if (alternates.get(language) !== expectedAlternate) {
      console.error(`${loc}: missing or incorrect ${language} hreflang alternate (expected ${expectedAlternate}).`);
      errors += 1;
    }
  }
  const expectedDefault = locale ? `${siteUrl}/en/${route ? `${route}/` : ""}` : `${siteUrl}/`;
  if (alternates.get("x-default") !== expectedDefault) {
    console.error(`${loc}: missing or incorrect x-default alternate (expected ${expectedDefault}).`);
    errors += 1;
  }
  const h1Count = [...html.matchAll(/<h1(?:\s|>)/gi)].length;
  if (h1Count !== 1) {
    console.error(`${loc}: expected one H1, found ${h1Count}.`);
    errors += 1;
  }
}

assert(errors === 0, `${errors} sitemap route validation error(s).`);
console.log(`Validated ${locs.length} unique sitemap URLs: static files, canonical URLs, hreflang, and one H1 each.`);
