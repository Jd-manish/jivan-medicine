# GitHub-to-Cloudflare Pages deployment

This repository is designed for a fully static Cloudflare Pages deployment. GitHub stores the source and runs the build; Cloudflare Pages serves the generated files from `out/`.

## Connect the repository

1. In Cloudflare, open **Workers & Pages → Create application → Pages → Connect to Git**.
2. Select the GitHub repository `Jd-manish/jivan-medicine` and authorize Cloudflare to read it.
3. Configure the build:
   - **Production branch:** `main`
   - **Framework preset:** `Next.js (Static HTML Export)` or **None** if that preset is unavailable
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** `/`
   - **Environment:** Node.js 22 (the repository's `.nvmrc` selects 22; if the dashboard overrides it, set `NODE_VERSION=22`)
4. Add `NEXT_PUBLIC_SITE_URL=https://jivanrx.online` as a build-time variable. Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` only if Google Search Console verification is being used.
5. Save and run the first deployment. In **Custom domains**, attach `jivanrx.online` and any desired `www` hostname, then configure the DNS records Cloudflare provides.

Cloudflare Pages creates preview deployments for non-production branches and deploys production when changes reach `main`. Review and merge a pull request before publishing production changes.

## What the build does

`npm run build` runs these checks and generation steps in order:

1. `npm run prepare:static` — validates the procedure/article inventory, generates the medicine slug manifest and Cloudflare redirects, and checks the `migrane` → `migraine` search regression.
2. `npm run build:sitemap` — writes the unique 2,036-URL sitemap.
3. `next build` — exports the site as static HTML into `out/`.
4. `npm run validate:static` — verifies every sitemap URL has a generated HTML file, one matching canonical, all expected hreflang alternates, and exactly one H1.

No database or server process is needed at request time. Do not set the output directory to `.next`; Cloudflare must publish `out`.

## Optional CLI deployment

```sh
npm ci
npm run build
npx wrangler pages deploy out --project-name jivan-medicine --branch <branch-name>
```

For example, a preview deploy can use the active Arena branch. Use `main` only for a production deploy after the reviewed changes have been merged. Keep Cloudflare account credentials in the local Wrangler login or CI secret store—never in Git or a public build variable.
