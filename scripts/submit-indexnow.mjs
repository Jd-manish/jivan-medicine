#!/usr/bin/env node
/**
 * Submit the site to IndexNow — the shared instant-indexing protocol used by
 * Bing (and therefore DuckDuckGo and Yahoo), Yandex, Naver and Seznam.
 *
 * Google does NOT participate in IndexNow. Google is submitted through Search
 * Console (see SEO-INDEXING.md); this script is the Bing-family half of the
 * same job, and it is the only half that can be automated.
 *
 * Why it matters for this site: a brand-new domain has no crawl history, so
 * waiting for Bingbot to rediscover 561 URLs on its own schedule can take
 * weeks. IndexNow tells the engine which URLs exist, right now.
 *
 * Protocol requirements, both enforced below:
 *   1. a key file at https://<host>/<key>.txt whose contents are exactly <key>
 *   2. a POST to the IndexNow endpoint listing URLs on that same host
 *
 * Usage
 *   npm run indexnow                      submit every URL in the sitemap index
 *   npm run indexnow -- --dry-run         print what would be sent, no network
 *   npm run indexnow -- --url <url>       submit specific URLs (repeatable)
 *   npm run indexnow -- --limit 50        only the first 50 sitemap URLs
 *
 * Flags
 *   --dry-run            validate and print, do not call the endpoint
 *   --url <url>          submit this URL instead of reading the sitemaps
 *                        (absolute https URL, or a path such as /en/articles/)
 *   --limit <n>          cap the number of URLs submitted
 *   --endpoint <url>     override the endpoint (default https://api.indexnow.org/indexnow)
 *
 * Exit code is non-zero when the key file, the URL set or the submission is
 * invalid, so it can be wired into a deploy step and fail loudly.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

// Public by design: served at https://jivanrx.online/67f5864edcb2551c40c059108ee0a463.txt
// Rotating it means renaming public/<key>.txt and the keyLocation URL below.
const KEY = "67f5864edcb2551c40c059108ee0a463";
const KEY_LOCATION_PATH = `/${KEY}.txt`;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://jivanrx.online").replace(/\/$/, "");
const HOST = new URL(SITE_URL).host;
const PUBLIC_DIR = resolve("public");
const OUTPUT_DIR = resolve("out");
const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow";
/** The protocol accepts at most 10,000 URLs per request. */
const MAX_URLS_PER_REQUEST = 10_000;

function fail(message) {
  console.error(`indexnow: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = { dryRun: false, urls: [], limit: Infinity, endpoint: DEFAULT_ENDPOINT };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--url":
        options.urls.push(argv[(index += 1)]);
        break;
      case "--limit": {
        const limit = Number(argv[(index += 1)]);
        if (!Number.isInteger(limit) || limit <= 0) fail("--limit needs a positive integer.");
        options.limit = limit;
        break;
      }
      case "--endpoint":
        options.endpoint = argv[(index += 1)];
        break;
      case "--help":
      case "-h":
        console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
        process.exit(0);
        break;
      default:
        fail(`unknown argument "${arg}" (try --help).`);
    }
  }
  return options;
}

function normalizeUrl(value) {
  if (!value) fail("--url needs a value.");
  const absolute = /^https?:\/\//i.test(value) ? value : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
  const parsed = new URL(absolute);
  if (parsed.host !== HOST) fail(`${absolute} is not on ${HOST}; IndexNow rejects cross-host URLs.`);
  return parsed.toString();
}

function sitemapUrls() {
  const indexPath = join(PUBLIC_DIR, "sitemap.xml");
  if (!existsSync(indexPath)) fail("public/sitemap.xml is missing; run `npm run build:sitemap` first.");

  const indexXml = readFileSync(indexPath, "utf8");
  const children = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (children.length === 0) fail("public/sitemap.xml has no <loc> entries.");

  const urls = [];
  for (const child of children) {
    // Child sitemaps are referenced by absolute URL; resolve them back to files.
    const { pathname } = new URL(child);
    const file = join(PUBLIC_DIR, pathname.replace(/^\//, ""));
    if (!existsSync(file)) fail(`sitemap ${child} is referenced by the index but ${file} does not exist.`);
    for (const match of readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(match[1]);
  }
  return urls;
}

/**
 * The key file must be published and must contain exactly the key. Checking
 * the built output too catches a public/ file that never made it into `out/`.
 */
function verifyKeyFile() {
  const keyPath = join(PUBLIC_DIR, `${KEY}.txt`);
  if (!existsSync(keyPath)) fail(`public/${KEY}.txt is missing — IndexNow will reject every request without it.`);
  const contents = readFileSync(keyPath, "utf8").trim();
  if (contents !== KEY) fail(`public/${KEY}.txt must contain exactly the key (${KEY}), found "${contents}".`);
  if (existsSync(OUTPUT_DIR) && !existsSync(join(OUTPUT_DIR, `${KEY}.txt`))) {
    fail(`out/${KEY}.txt is missing; rebuild so the key file is deployed.`);
  }
}

async function submit(endpoint, urlList) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE_URL}${KEY_LOCATION_PATH}`,
    urlList,
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // Documented responses: 200 ok, 202 accepted (key check still pending),
  // 400 bad request, 403 key not valid, 422 URL/key mismatch, 429 throttled.
  const note = {
    200: "accepted",
    202: "accepted (key validation pending on the engine side)",
    400: "bad request — malformed payload",
    403: "key not valid — is the key file deployed at keyLocation?",
    422: "URLs do not belong to this host, or the key does not match",
    429: "too many requests — retry later",
  }[response.status];

  if (response.status === 200 || response.status === 202) {
    console.log(`indexnow: ${response.status} ${note} — ${urlList.length} URL(s) submitted to ${endpoint}`);
    return true;
  }
  const detail = (await response.text().catch(() => "")).trim();
  console.error(`indexnow: ${response.status} ${note ?? response.statusText}${detail ? ` — ${detail.slice(0, 300)}` : ""}`);
  return false;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  verifyKeyFile();

  const urls = options.urls.length > 0 ? options.urls.map(normalizeUrl) : sitemapUrls();
  const unique = [...new Set(urls)].slice(0, options.limit);
  if (unique.length === 0) fail("no URLs to submit.");

  console.log(
    `indexnow: ${unique.length} URL(s) for ${HOST} ` +
      `(${unique.length === 1 ? unique[0] : `${unique[0]} … ${unique[unique.length - 1]}`})`,
  );

  if (options.dryRun) {
    console.log("indexnow: --dry-run, nothing was sent.");
    return;
  }

  let submitted = 0;
  for (let start = 0; start < unique.length; start += MAX_URLS_PER_REQUEST) {
    const batch = unique.slice(start, start + MAX_URLS_PER_REQUEST);
    // Sequential on purpose: the endpoint throttles per host, and a failed
    // batch should stop the run rather than burn the remaining quota.
    if (!(await submit(options.endpoint, batch))) process.exit(1);
    submitted += batch.length;
  }
  console.log(`indexnow: done, ${submitted} URL(s) submitted. Engines usually re-crawl within hours to a few days.`);
}

main().catch((error) => {
  console.error(`indexnow: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
