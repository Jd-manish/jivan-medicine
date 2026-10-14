import type { Metadata } from "next";
import { primaryLocales, type PrimaryLocale } from "@/lib/i18n";

/**
 * Locales whose pages are allowed into search engines.
 *
 * Only English currently carries unique editorial content. The other
 * "primary" locales (de/fr/es/it) have a translated UI shell but their
 * articles, procedure guides and most body copy are still the English text,
 * so indexing them would create 4 near-identical copies of every page. Google
 * then has to pick one canonical per cluster, reports the rest as
 * "Duplicate", and spends crawl budget on them instead of on new pages.
 *
 * Those locales stay live and crawlable (`noindex, follow`). When one of
 * them is fully translated, add it here: the sitemap, robots directives,
 * canonical/hreflang set and the build-time validator all key off this list.
 */
export const INDEXABLE_LOCALES = ["en"] as const satisfies readonly PrimaryLocale[];
export type SeoLocale = (typeof INDEXABLE_LOCALES)[number];

/** @deprecated kept for older imports; identical to {@link INDEXABLE_LOCALES}. */
export const SEO_LOCALES = INDEXABLE_LOCALES;

/** Locales with a translated UI shell (shown in the footer language picker). */
export const TRANSLATED_UI_LOCALES = primaryLocales;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivanrx.online").replace(/\/$/, "");

/**
 * Google Search Console "HTML tag" verification token.
 *
 * Preferred: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in the Cloudflare Pages
 * build environment. Fallback: paste the `content` value of the
 * <meta name="google-site-verification"> tag Google shows you into
 * GOOGLE_SITE_VERIFICATION_FALLBACK below. The token is not a secret — it is
 * published in the page <head> by design — so committing it is fine.
 */
const GOOGLE_SITE_VERIFICATION_FALLBACK = "";
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || GOOGLE_SITE_VERIFICATION_FALLBACK || undefined;

export function isSeoLocale(locale: string): locale is SeoLocale {
  return (INDEXABLE_LOCALES as readonly string[]).includes(locale);
}

function normalizedPath(path: string): string {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

function absolute(locale: string, route: string): string {
  return `${SITE_URL}/${locale}${route}`.replace(/([^:]\/)\/+/g, "$1");
}

/**
 * hreflang annotations only make sense between pages that can all be
 * indexed; Google ignores alternates that point at `noindex` URLs. Emit the
 * cluster only when at least two locales are indexable.
 */
function hreflangLanguages(route: string): Record<string, string> | undefined {
  if (INDEXABLE_LOCALES.length < 2) return undefined;
  const languages: Record<string, string> = {};
  for (const language of INDEXABLE_LOCALES) languages[language] = absolute(language, route);
  languages["x-default"] = absolute("en", route);
  return languages;
}

/** Build one canonical and consistent hreflang set for a localized route. */
export function localizedAlternates(locale: string, path = ""): NonNullable<Metadata["alternates"]> {
  const route = normalizedPath(path);
  const languages = hreflangLanguages(route);
  return {
    canonical: absolute(locale, route),
    ...(languages ? { languages } : {}),
  };
}

/** Alternates for the language-chooser page at the site root. */
export function rootAlternates(): NonNullable<Metadata["alternates"]> {
  if (INDEXABLE_LOCALES.length < 2) return { canonical: `${SITE_URL}/` };
  const languages: Record<string, string> = {};
  for (const language of INDEXABLE_LOCALES) languages[language] = absolute(language, "/");
  languages["x-default"] = `${SITE_URL}/`;
  return { canonical: `${SITE_URL}/`, languages };
}

/** Pages outside the indexable locales stay reachable but out of the index. */
export function localizedRobots(locale: string): Metadata["robots"] {
  return isSeoLocale(locale)
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } }
    : { index: false, follow: true };
}

/** Sitemap URLs use the exact trailing-slash form emitted by the static export. */
export function localizedUrl(locale: string, path = ""): string {
  return absolute(locale, normalizedPath(path));
}
