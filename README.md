# Jivan — medicine price transparency

**Live site: <https://jivanrx.online>**

Jivan is a free, non-commercial price-transparency project. It shows what the same
active pharmaceutical ingredient costs in the United States and Europe next to the
Indian market price for the identical salt, strength and dosage form — so a patient
can have an informed conversation with their own doctor instead of abandoning a
treatment they cannot afford.

- Browse the catalog: <https://jivanrx.online/en/medicines/>
- Guides and case studies: <https://jivanrx.online/en/articles/>
- Operation and procedure costs: <https://jivanrx.online/en/surgeries/>
- How prices are verified: <https://jivanrx.online/en/methodology/>

Jivan does not sell medicine, take commission on a sale, or route anyone to a
supplier. Every page pushes the reader toward professional medical supervision.

## What is in this repository

A statically exported Next.js 16 site (no server runtime, no database) deployed to
Cloudflare Pages.

| Path | Purpose |
|---|---|
| `src/app/[locale]/` | Routes: home, search, A–Z directory, 476 medicine pages, 25 procedure pages, 40+ articles, policy pages |
| `src/lib/seo.ts` | Single switch for canonical URLs, `noindex` policy and hreflang |
| `scripts/prepare-static-site.ts` | Generates the slug manifest, `robots.txt` and legacy-URL redirects |
| `scripts/build-sitemap.ts` | Writes the sitemap index and four child sitemaps |
| `scripts/submit-indexnow.mjs` | Pushes every sitemap URL to Bing / Yandex / Naver via IndexNow |
| `scripts/validate-static-output.mjs` | Build-time gate: every submitted URL must be indexable and self-canonical |
| `SEO-INDEXING.md` | Search Console setup and indexing troubleshooting |

## Build and deploy

```sh
npm ci
npm run build      # prepare:static → build:sitemap → next build → validate:static
```

The export lands in `out/`. On Cloudflare Pages the production branch is `main`,
the build command is `npm run build` and the output directory is `out`.
`NEXT_PUBLIC_SITE_URL` defaults to `https://jivanrx.online`.

Full deployment notes, including the `www` → apex redirect and bot settings, are in
[`DEPLOY.md`](DEPLOY.md) and [`SEO-INDEXING.md`](SEO-INDEXING.md).

## Search indexing

```sh
npm run indexnow -- --dry-run   # show what would be submitted
npm run indexnow                # submit every sitemap URL to IndexNow (Bing, Yandex, Naver)
```

Google indexing is set up manually through Search Console; the step-by-step
checklist is in [`SEO-INDEXING.md`](SEO-INDEXING.md).

## Data and sources

Medicine names, ingredients and classifications are cross-checked against RxNorm,
openFDA and Wikipedia. Prices are labelled *referenced*, *derived* or *unavailable*
— an estimate is never presented as a quoted price. Nothing here is medical advice;
see the [medical disclaimer](https://jivanrx.online/en/medical-disclaimer/).
