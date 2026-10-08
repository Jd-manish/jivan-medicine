# Deploy Jivan to Cloudflare Pages

Jivan is exported as a static site. It does not require a database, a Next.js server, or a Workers runtime.

## Cloudflare Pages settings

- **Production branch:** `main` (merge a reviewed pull request into `main` to publish)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Node.js:** 22
- **Root directory:** `/`

Set `NEXT_PUBLIC_SITE_URL` to `https://jivanrx.online` for canonical URLs and metadata. The code uses that value as its default. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional.

The build prepares the medicine slug manifest and redirects, generates the sitemap, exports the pages, and validates the static output. A successful build checks that the 2,036 sitemap URLs resolve to generated HTML with a canonical URL, localized hreflang alternates, and exactly one H1.

## Deploy from a local checkout

```sh
npm ci
npm run build
npx wrangler pages deploy out --project-name jivan-medicine --branch main
```

For a preview, replace `main` with the branch name. Do not deploy the `out` directory until `npm run build` finishes successfully.

## Notes

- Next.js static export is configured in `next.config.ts`; the deployment output is `out/`.
- `public/_headers`, `public/_redirects`, and `public/robots.txt` are deployed as static Cloudflare Pages configuration files.
- The site performs optional client-side public-source lookups for unmatched searches (RxNorm, openFDA, and Wikipedia). Search terms are sent directly to those services; no API key, database, or server-side proxy is used.
- Never put private API keys or credentials in `NEXT_PUBLIC_*` variables or in the static bundle.
