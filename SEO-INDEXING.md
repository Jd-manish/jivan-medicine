# Getting jivanrx.online indexed by Google

Google only indexes a site after it (a) knows the site exists, (b) is allowed to crawl it, (c) finds pages worth indexing, and (d) decides the site is trustworthy enough to spend crawl budget on. The code in this repository takes care of (b) and (c). Steps (a) and (d) can only be done by the site owner from the Google Search Console and Cloudflare dashboards — no code change can replace them.

Canonical domain: **`https://jivanrx.online`** (set the `www` → root redirect rule described in section 4). `jivan.online` is a separate domain that currently points at an IONOS parking IP and returns HTTP 500 — it is not serving this site and must not be submitted anywhere until it is attached to the Cloudflare Pages project and redirected.

---

## Status — checked against the live site on 22 October 2026

| Check | Result |
|---|---|
| `https://jivanrx.online/en/` | Serves the full home page (title, H1, catalog, JSON-LD) |
| `https://jivanrx.online/robots.txt` | `User-agent: *` → `Allow: /`, advertises `https://jivanrx.online/sitemap.xml` |
| `https://jivanrx.online/sitemap.xml` | Sitemap index → 4 child sitemaps, **561 URLs**, all reachable |
| Structured data | `Organization`, `WebSite`, `FAQPage` on the home page; `Article` + `FAQPage` + `BreadcrumbList` on guides; `Drug` + `BreadcrumbList` on medicine pages; `MedicalProcedure` on operation pages |
| Non-English locales | Live but `noindex, follow` (untranslated duplicate content) |
| `https://www.jivanrx.online/` | **Serves a full duplicate copy with a 200, not a 301** — needs the Redirect Rule in section 4 |
| Google verification | DNS TXT record **already present**: `google-site-verification=6-XhbIQowQitJh0oL5-4p87OU43v0Nv7q1OS5UU3oyo` — a Domain property was already set up for this domain, so section 1 is a check, not a setup |
| `http://jivanrx.online/…` | **Already 301s to `https://`** — Always Use HTTPS is on, one URL per page |
| IndexNow key file | **404 — not deployed yet.** Goes live when PR #7 merges and `main` deploys |
| **Pages in Google's index** | **0** — a `site:jivanrx.online` query returns nothing |
| **Inbound links found** | **0** |

Read that table as: *the site is finished and crawlable, but nothing outside the sitemap points at it, so Google has no reason to spend crawl budget on it yet.* Once Search Console is verified and the sitemap is submitted, Googlebot typically reaches the home page and the hub pages within days, and the long tail over the following weeks. Sections 1–3 below are the whole of what is left to do by hand.

---

## This is a migration, not a launch

`jivanrx.online` previously served an earlier, incomplete build on Netlify — the repository still carries `netlify/database/migrations/2026-09*` from that period. That Netlify project has since been **deleted**, so the only thing it left behind is old URLs and possibly an old Search Console verification. Moving a domain between hosts is invisible to Google: a site is identified by its domain, not by the machine serving it, so nothing is reset, no reputation is lost and there is no penalty to clear. The domain is actually slightly better off than a brand-new one, because it has DNS and crawl history.

What the old attempt leaves behind is four things worth checking. Two are closed, one is fixed in code, and one is a question only you can answer in the Search Console UI:

| Residue from the old host | Why it matters | Status |
|---|---|---|
| The old `*.netlify.app` address, if the site still existed there | A second live copy of the site competes with the real one and can be the copy Google indexes | **Resolved** — the Netlify project was deleted on 22 Oct 2026. Nothing to redirect, nothing competing |
| Search Console verification done on Netlify (HTML file or meta tag) | The file no longer exists, so the property can drop to "verification expired" | **Check the property type.** A DNS TXT record for this domain is already live, so the *Domain* property verifies without any file. A URL-prefix property verified by HTML tag has no file on the new host — delete it rather than rescue it (section 1) |
| A sitemap submitted from the old build | If it lists old URLs it reports "Couldn't fetch" and clutters the report | **Remove it** if it exists, then submit `sitemap.xml` in the Domain property (section 2) |
| Old URLs that are now 404 | Every link, bookmark and social post from that period is dead | **Fixed in code** — `_redirects` now 301s the locale-less shapes: `/medicines/` → `/en/medicines/`, `/articles/*` → `/en/articles/*` |

One further point: if any URL from the old build is *identical* to a URL today (the home page `/`, for example), the verdict Google reached about the old, thinner version stays attached to it until the next crawl. That is another reason to request indexing for `/en/` rather than waiting — a fresh crawl replaces the old judgement.

Old pages that are genuinely gone should 404, not redirect: Google drops them in a few weeks and there is nothing to clean up in Search Console.

---

## Start here — the five actions, in this order

| # | Action | Where | Time | Repeats? |
|---|---|---|---|---|
| 1 | **Confirm** the Domain property is verified (the DNS record is already live) | Search Console | 1 min | once |
| 2 | Submit `sitemap.xml` | Search Console → Sitemaps | 30 sec | once |
| 3 | Request indexing for the 8 hub pages | Search Console → URL Inspection | 5 min | once, then for new pages |
| 4 | Merge the indexing PR, let `main` deploy, then push the URL list to Bing/Yandex/Naver | `npm run indexnow` | 1 min | after each deploy |
| 5 | Earn 5 real inbound links | off-site | ongoing | this week |

Everything else on this page is detail, verification and troubleshooting for those five rows.

---

## 1. Verify the site in Google Search Console

**The DNS record already exists.** `jivanrx.online` currently publishes
`google-site-verification=6-XhbIQowQitJh0oL5-4p87OU43v0Nv7q1OS5UU3oyo`, so a Domain
property has already been created for this domain at some point. The DNS TXT method
is only available for **Domain** properties, which means the property type is already
the right one — it covers http, https, www and every subdomain, and it cannot be
broken by a change of host again.

So this section is a three-point check, not a setup:

1. Open <https://search.google.com/search-console> and look at the property selector.
   - `jivanrx.online` (type **Domain**) listed → open it. If it says *Verified*, skip to section 2.
   - Only a **URL-prefix** property (`https://jivanrx.online/`) exists → that one was verified from the old Netlify build and will expire now that the tag is gone. Add the Domain property alongside it, then delete the URL-prefix one; it covers nothing extra.
   - Nothing listed → **Add property → Domain** → `jivanrx.online`. The TXT record already exists, so **Verify** succeeds immediately without touching DNS.
2. Confirm both hosts behave: `https://jivanrx.online/` and `https://www.jivanrx.online/` both load (they do).
3. If verification ever fails, check the record is still in **Cloudflare → DNS → Records** as a `TXT` on `@`.

Fallback (HTML-tag method, needs a redeploy) — only for a URL-prefix property, since a
Domain property already verifies by DNS: copy the `content="…"` value Google shows you
and either set the Cloudflare Pages build variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
or paste it into `GOOGLE_SITE_VERIFICATION_FALLBACK` in `src/lib/seo.ts`, then redeploy.
The token is public by design, so committing it is fine.

## 2. Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.

> **"Invalid sitemap address. Please enter a valid path to a sitemap in your site."**
> This is a format error in the input box, not a problem with the site. Search Console never fetched anything. What to type depends on which property you are in:
>
> | Box looks like | Type exactly | Wrong input that causes the error |
> |---|---|---|
> | `https://jivanrx.online/` greyed out, then a short field (URL-prefix property) | `sitemap.xml` | pasting the full `https://jivanrx.online/sitemap.xml`, which doubles the domain |
> | One empty field with a grey placeholder (Domain property) | `https://jivanrx.online/sitemap.xml` | typing only `sitemap.xml` |
>
> No leading slash, no trailing space, no `www`. If it still refuses, confirm in the property selector at the top that you are in `jivanrx.online` and not the old `jivan.online` property.

`https://jivanrx.online/sitemap.xml` is a sitemap index that points at four child sitemaps. Within a day the Sitemaps report should show status **Success** for each:

| Child sitemap | URLs | Contents |
|---|---|---|
| `/sitemaps/pages.xml` | 15 | root, home, search, A–Z directory, policy pages |
| `/sitemaps/articles.xml` | 44 | the 40 guides/case studies (with `lastmod`) and author-role pages |
| `/sitemaps/procedures.xml` | 26 | the 25 operation/procedure cost pages + the index |
| `/sitemaps/medicines.xml` | 476 | the researched medicine pages |
| | **561** | |

The split is deliberate: the **Pages** report (Indexing → Pages → filter by sitemap) then shows exactly which section Google is holding back.

Do not also submit the individual child sitemaps — the index already declares them, and duplicates only make the report harder to read.

## 3. Ask for the first crawls explicitly

Search Console → **URL Inspection** → paste a URL → **Request indexing**. Do this (quota is roughly 10–12 per day) for, in this order:

1. `https://jivanrx.online/en/`
2. `https://jivanrx.online/en/medicines/`
3. `https://jivanrx.online/en/articles/`
4. `https://jivanrx.online/en/surgeries/`
5. `https://jivanrx.online/en/mission/`
6. the five articles you care about most
7. the next day: the top procedure pages and a few flagship medicine pages

Every page in that list links onward to the rest of the site, so Googlebot discovers the remaining ~550 URLs from there. Requesting indexing for all 561 URLs is neither possible nor useful — the quota is small and hub pages do the same job.

Use the same box to diagnose: URL Inspection → **Test live URL** shows exactly what Googlebot receives, including which robots directive and canonical tag it sees. If a page will not index, the answer is almost always on that screen.

## 4. Make sure Cloudflare is not holding Googlebot back

Cloudflare sits in front of the site; its defaults are fine, but check these once in the dashboard for the `jivanrx.online` zone:

- **Security → Settings → Security level**: not "I'm Under Attack" (that mode challenges every visitor, including crawlers, with JavaScript).
- **Security → Bots**: "Block AI bots" / "AI Labyrinth" are fine — they do not apply to Googlebot's search crawler. Do **not** enable rules that challenge *verified* bots.
- **Security → Events**: filter by user agent `Googlebot` after a week. Every row should be "Allow"; any "Managed Challenge"/"Block" means a WAF or rate-limit rule needs an exception for verified bots.
- **Speed → Optimization → Crawler Hints**: turn **on**. It is free and tells Bing/IndexNow-based engines when pages change.
- **SSL/TLS → Edge Certificates → Always Use HTTPS**: **On**, plus *Automatic HTTPS Rewrites*. One URL per page, not two.
- **Workers & Pages → jivan-medicine → Custom domains**: `jivanrx.online` and `www.jivanrx.online` both attached.
- **Rules → Redirect Rules → Create rule → template "Redirect from WWW to Root"** (one click, free): today `https://www.jivanrx.online/…` serves a full second copy of the site with a 200. Every page declares the apex URL as canonical, so Google will consolidate anyway, but a 301 stops the crawler from spending time on the duplicate host. (`_redirects` files on Pages cannot express host-level rules, which is why this lives in the dashboard.)

The managed `robots.txt` Cloudflare prepends only restricts AI-training crawlers; `User-agent: *` remains `Allow: /`, so Google Search is unaffected.

> Two entries on that list look alarming and are not:
> - `Google-Extended` is Google's **AI training** crawler, not Googlebot. Blocking it does not affect Search ranking, Search Console data or Googlebot's crawling of your pages.
> - The Cloudflare-managed block list also covers `Google-Agent` / `Google-GeminiNotebook`. Blocking those only limits your content in *some* AI-assistant surfaces; ordinary Search is untouched. If you later want AI-answer visibility, remove those two lines from the Cloudflare bot settings.

## 5. Bing, DuckDuckGo, Yahoo — and IndexNow

Bing powers DuckDuckGo, Yahoo and a good share of AI-assistant answers, so this is worth the two minutes.

**Automated part (already in the repo):**

```sh
npm run indexnow -- --dry-run    # shows the 561 URLs that would be sent
npm run indexnow                 # submits them
```

`scripts/submit-indexnow.mjs` reads the sitemap index, collects every URL and POSTs them to the shared IndexNow endpoint, which distributes to Bing, Yandex, Naver and Seznam. It requires the key file `public/67f5864edcb2551c40c059108ee0a463.txt`, which is deployed to `https://jivanrx.online/67f5864edcb2551c40c059108ee0a463.txt`; the build's `validate:static` step fails if that file ever goes missing. For a single new page:

```sh
npm run indexnow -- --url https://jivanrx.online/en/articles/my-new-guide/
```

Google does **not** participate in IndexNow, which is why sections 1–3 still exist. There is no legitimate way to submit URLs to Google other than Search Console.

**Manual part:**

1. <https://www.bing.com/webmasters> → sign in → **Import from Google Search Console** → authorize → pick `jivanrx.online`. This imports the site, its sitemap and its verification in one step and covers Bing, DuckDuckGo and Yahoo.
2. In Bing Webmaster Tools, confirm **Sitemaps** lists `https://jivanrx.online/sitemap.xml`, then run **URL Submission** for the same hub pages as in section 3 (Bing's quota is far more generous).

## 6. What to expect, and how to read the reports

- A brand-new domain with no inbound links is typically crawled within days of the Search Console submission; the home page and hub pages usually appear in the index within **1–3 weeks**, long-tail medicine pages over the following **weeks to months**.
- Google deprecated the sitemap "ping" endpoint in 2023 and the Indexing API only accepts job-posting and livestream pages. Any service promising "instant indexing" for a site like this is just clicking Request Indexing on your behalf.
- Check **Indexing → Pages** weekly, not daily. The five statuses and what to do about each:

| Status in Search Console | What it means | Action |
|---|---|---|
| **Discovered – currently not indexed** | Google knows the URL, has not scheduled a crawl yet | Normal in the first weeks. Build a few links; do not resubmit. |
| **Crawled – currently not indexed** | Google read the page and chose not to index it | Content problem — see below. |
| **Duplicate, Google chose different canonical** | Something canonicalises better than your page | Check the `www` 301 and the canonical tag via URL Inspection. |
| **Excluded by 'noindex'** | A locale other than `en`, or a `/data/` file | Expected for `de`/`fr`/`es`/`it`; investigate anything else. |
| **Page with redirect** | A legacy article URL hit `/public/_redirects` | Expected; the 301 passes signal to the new URL. |

"Crawled – currently not indexed" that persists for a *section* (usually the medicine pages) means Google wants more unique content there. The templated narrative is the weakest part of this site; adding sourced, per-molecule detail (why *this* drug's price gap exists, specific regulator links, FAQs) is what changes that verdict. Adding more URLs to the same template does not.

## 7. The strongest accelerator: five real links

For a new domain, "does anything on the web point at it?" matters more than any on-page change. Aim for five links in the first week:

- the GitHub repository itself — description, topics and the `README.md` all link to `https://jivanrx.online` (already done in this repo);
- your LinkedIn / X / Instagram / YouTube profile "website" fields;
- one launch post where the audience cares about medicine costs (a Show HN, a Product Hunt listing, a relevant subreddit — read each community's self-promotion rules first, and write about the problem, not the product);
- a short outreach note to patient-support groups, medical-cost bloggers or clinician-educators who already cover drug pricing, asking them to reference a specific page rather than the home page;
- an answer on a health-economics forum or Quora question where a specific guide genuinely answers it.

Three or four links move a new domain from "discovered" to "crawled" much faster than any code change can.

## 8. How the repository supports this (for whoever edits the code next)

- `src/lib/seo.ts` is the single switch. `INDEXABLE_LOCALES` is currently `["en"]`: the German, French, Spanish and Italian builds still ship a translated UI shell but their articles, procedure guides and most body copy are the English text, so indexing them would create four near-duplicates of every page. They render `noindex, follow`; add a locale to the list only once its content is actually translated. Sitemap, robots directives, canonical/hreflang and the validator all follow the list.
- `npm run prepare:static` generates `public/robots.txt` and `public/_redirects` (legacy article URLs) from the configured `NEXT_PUBLIC_SITE_URL`, so the advertised sitemap can never point at the wrong host.
- `npm run build:sitemap` writes the sitemap index and child sitemaps and includes **every** indexable medicine page (an earlier build capped the sitemap at 2,036 URLs and silently left ~150 indexable medicine pages per locale out of it).
- `npm run indexnow` submits the same URL set to Bing/Yandex/Naver. The key file lives in `public/`; rotating the key means renaming that file and updating `KEY` in `scripts/submit-indexnow.mjs`.
- `/[locale]/medicines/` is a server-rendered A–Z directory of all 476 researched medicines, linked from the footer, the home page, the search page and every medicine page. Before it existed, the medicine pages had no inbound internal links at all (they were sitemap-only orphans), which is one of the main reasons Google leaves pages unindexed. Each medicine page now also links to eight related researched medicines.
- `npm run validate:static` fails the build if any submitted URL is `noindex`, has a wrong canonical, lacks a title/description or H1, if a non-indexable locale forgets its `noindex`, or if the IndexNow key file is missing from the output.
- The home and search pages embed a 48-row catalog slice (projected to the fields the table renders) instead of 180 full records, which cut the home page HTML from ~820 KB to ~370 KB; the full 7 MB catalog is still fetched lazily by the browser.
