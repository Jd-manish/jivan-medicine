import type { Metadata } from "next";
import { primaryLocales, type PrimaryLocale } from "@/lib/i18n";

/** Languages with editorial content maintained for search indexing. */
export const SEO_LOCALES = primaryLocales;
export type SeoLocale = PrimaryLocale;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivanrx.online").replace(/\/$/, "");

export function isSeoLocale(locale: string): locale is SeoLocale {
  return (SEO_LOCALES as readonly string[]).includes(locale);
}

function normalizedPath(path: string): string {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/** Build one canonical and consistent hreflang set for a localized route. */
export function localizedAlternates(locale: string, path = ""): NonNullable<Metadata["alternates"]> {
  const route = normalizedPath(path);
  const languages: Record<string, string> = {};

  for (const language of SEO_LOCALES) {
    languages[language] = `${SITE_URL}/${language}${route}`.replace(/([^:]\/)\/+/g, "$1");
  }
  languages["x-default"] = `${SITE_URL}/en${route}`.replace(/([^:]\/)\/+/g, "$1");

  return {
    canonical: `${SITE_URL}/${locale}${route}`.replace(/([^:]\/)\/+/g, "$1"),
    languages,
  };
}

/** Pages with English-only fallback copy stay accessible but out of the index. */
export function localizedRobots(locale: string): Metadata["robots"] {
  return isSeoLocale(locale)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

/** Sitemap URLs use the exact trailing-slash form emitted by the static export. */
export function localizedUrl(locale: string, path = ""): string {
  const route = normalizedPath(path);
  return `${SITE_URL}/${locale}${route}`.replace(/([^:]\/)\/+/g, "$1");
}
