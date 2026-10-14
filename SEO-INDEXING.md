# Getting jivanrx.online indexed by Google

Google only indexes a site after it (a) knows the site exists, (b) is allowed to crawl it, (c) finds pages worth indexing, and (d) decides the site is trustworthy enough to spend crawl budget on. The code in this repository takes care of (b) and (c). Steps (a) and (d) can only be done by the site owner from the Google Search Console and Cloudflare dashboards — no code change can replace them.

Canonical domain: **`https://jivanrx.online`** (set the `www` → root redirect rule described in section 4). `jivan.online` is a separate domain that currently points at an IONOS parking IP and returns HTTP 500 — it is not serving this site and must not be submitted anywhere until it is attached to the Cloudflare Pages project and redirected.

---

## 1. Verify the site in Google Search Console (one-time, ~5 minutes)

1. Open <https://search.google.com/search-console> with the Google account that should own the property.
2. Look at the property selector (top-left). If `jivanrx.online` is already listed, skip to step 2 below.
3. Click **Add property → Domain** and enter `jivanrx.online` (no `https://`, no `www`). A Domain property covers http, https, www and every subdomain in one go.
4. Google shows a TXT record like `google-site-verification=AbC123…`. Copy it.
5. In the Cloudflare dashboard → the `jivanrx.online` zone → **DNS → Records → Add record**:
   - Type: `TXT`
   - Name: `@`
   - Content: the full `google-site-verification=…` string
   - TTL: Auto → **Save**
6. Back in Search Console click **Verify**. DNS on Cloudflare propagates within a minute or two; if it fails, wait five minutes and retry.

Fallback (HTML-tag method, needs a redeploy): choose **URL prefix** → `https://jivanrx.online/` → **HTML tag**, copy only the `content="…"` value, and either set it as the Cloudflare Pages build variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` or paste it into `GOOGLE_SITE_VERIFICATION_FALLBACK` in `src/lib/seo.ts`. Redeploy, then click Verify. The token is public by design, so committing it is fine.

## 2. Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.

`https://jivanrx.online/sitemap.xml` is a sitemap index that points at four child sitemaps. Within a day the Sitemaps report should show status **Success** for each:

| Child sitemap | Contents |
|---|---|
| `/sitemaps/pages.xml` | root, home, search, A–Z directory, policy pages |
| `/sitemaps/articles.xml` | the 40 guides/case studies (with `lastmod`) and author-role pages |
| `/sitemaps/procedures.xml` | the 25 operation/procedure cost pages |
| `/sitemaps/medicines.xml` | the 476 hand-researched medicine pages |

The split is deliberate: the **Pages** report (Indexing → Pages → filter by sitemap) then shows exactly which section Google is holding back.

## 3. Ask for the first crawls explicitly

Search Console → **URL Inspection** → paste a URL → **Request indexing**. Do this (quota is roughly 10–12 per day) for, in this order:

1. `https://jivanrx.online/en/`
2. `https://jivanrx.online/en/medicines/`
3. `https://jivanrx.online/en/articles/`
4. `https://jivanrx.online/en/surgeries/`
5. `https://jivanrx.online/en/mission/`
6. the five articles you care about most
7. the next day: the top procedure pages and a few flagship medicine pages

Every page in that list links onward to the rest of the site, so Googlebot discovers the remaining ~550 URLs from there.

## 4. Make sure Cloudflare is not holding Googlebot back

Cloudflare sits in front of the site; its defaults are fine, but check these once in the dashboard for the `jivanrx.online` zone:

- **Security → Settings → Security level**: not "I'm Under Attack" (that mode challenges every visitor, including crawlers, with JavaScript).
- **Security → Bots**: "Block AI bots" / "AI Labyrinth" are fine — they do not apply to Googlebot's search crawler. Do **not** enable rules that challenge *verified* bots.
- **Security → Events**: filter by user agent `Googlebot` after a week. Every row should be "Allow"; any "Managed Challenge"/"Block" means a WAF or rate-limit rule needs an exception for verified bots.
- **Speed → Optimization → Crawler Hints**: turn **on**. It is free and tells Bing/IndexNow-based engines when pages change.
- **Workers & Pages → jivan-medicine → Custom domains**: `jivanrx.online` and `www.jivanrx.online` both attached.
- **Rules → Redirect Rules → Create rule → template "Redirect from WWW to Root"** (one click, free): today `https://www.jivanrx.online/…` serves a full second copy of the site with a 200. Every page declares the apex URL as canonical, so Google will consolidate anyway, but a 301 stops the crawler from spending time on the duplicate host. (`_redirects` files on Pages cannot express host-level rules, which is why this lives in the dashboard.)

The managed `robots.txt` Cloudflare prepends only restricts AI-training crawlers; `User-agent: *` remains `Allow: /`, so Google Search is unaffected.

## 5. Bing, DuckDuckGo, Yahoo (optional, 2 minutes)

<https://www.bing.com/webmasters> → **Import from Google Search Console**. Bing powers DuckDuckGo and Yahoo, so this one import covers all three.

## 6. What to expect, and what actually speeds it up

- A brand-new domain with no inbound links is typically crawled within days of the Search Console submission; the home page and hub pages usually appear in the index within 1–3 weeks, long-tail medicine pages over the following weeks to months.
- Google deprecated the sitemap "ping" endpoint in 2023 and the Indexing API only accepts job-posting and livestream pages. Any service promising "instant indexing" for a site like this is just clicking Request Indexing.
- The strongest accelerator is a handful of real links to `https://jivanrx.online/`: the GitHub repository description/README, LinkedIn/X/Instagram profiles, a launch post (Product Hunt, Hacker News "Show HN", relevant subreddits), and any NGO, patient group or clinician who is willing to reference the site. Even three or four links move a new domain from "discovered" to "crawled" much faster.
- "Discovered – currently not indexed" in the Pages report during the first weeks is normal. "Crawled – currently not indexed" that persists for a *section* (usually the medicine pages) means Google wants more unique content on those pages — the templated narrative is the weakest part of the site, and adding sourced, per-molecule detail (why the price gap exists for *this* drug, specific regulator links, FAQs) is what changes that verdict.

## 7. How the repository supports this (for whoever edits the code next)

- `src/lib/seo.ts` is the single switch. `INDEXABLE_LOCALES` is currently `["en"]`: the German, French, Spanish and Italian builds still ship a translated UI shell but their articles, procedure guides and most body copy are the English text, so indexing them would create four near-duplicates of every page. They render `noindex, follow`; add a locale to the list only once its content is actually translated. Sitemap, robots directives, canonical/hreflang and the validator all follow the list.
- `npm run prepare:static` generates `public/robots.txt` and `public/_redirects` (legacy article URLs) from the configured `NEXT_PUBLIC_SITE_URL`, so the advertised sitemap can never point at the wrong host.
- `npm run build:sitemap` writes the sitemap index and child sitemaps and includes **every** indexable medicine page (the previous build capped the sitemap at 2,036 URLs and silently left ~150 indexable medicine pages per locale out of it).
- `/[locale]/medicines/` is a server-rendered A–Z directory of all 476 researched medicines, linked from the footer, the home page, the search page and every medicine page. Before it existed, the medicine pages had no inbound internal links at all (they were sitemap-only orphans), which is one of the main reasons Google leaves pages unindexed. Each medicine page now also links to eight related researched medicines.
- `npm run validate:static` fails the build if any submitted URL is `noindex`, has a wrong canonical, lacks a title/description or H1, or if a non-indexable locale forgets its `noindex`.
- The home and search pages embed a 48-row catalog slice (projected to the fields the table renders) instead of 180 full records, which cut the home page HTML from ~820 KB to ~370 KB; the full 7 MB catalog is still fetched lazily by the browser.
