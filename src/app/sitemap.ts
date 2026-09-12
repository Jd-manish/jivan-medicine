import type { MetadataRoute } from "next";
import { db } from "@/db";
import { medicines } from "@/db/schema";
import { articles } from "@/lib/articles";
import { authorRoles } from "@/lib/authors";
import { supportedLocales } from "@/lib/i18n";
import { desc, eq, sql } from "drizzle-orm";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health";

const staticPaths = [
  "search",
  "mission",
  "support",
  "articles",
  "about",
  "contact",
  "editorial-policy",
  "methodology",
  "data",
  "privacy",
  "terms",
  "medical-disclaimer",
];

/** Locales that get full deep-link coverage. Others still get their landing pages. */
const primaryLocales = ["en", "de", "fr", "es", "it"] as const;

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const landing: MetadataRoute.Sitemap = supportedLocales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `${baseUrl}/${alt}`])),
    },
  }));

  const staticRoutes: MetadataRoute.Sitemap = supportedLocales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}/${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "search" ? 0.9 : 0.6,
    })),
  );

  const articleRoutes: MetadataRoute.Sitemap = primaryLocales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${baseUrl}/${locale}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  const authorRoutes: MetadataRoute.Sitemap = primaryLocales.flatMap((locale) =>
    authorRoles.map((role) => ({
      url: `${baseUrl}/${locale}/authors/${role.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  let medicineRoutes: MetadataRoute.Sitemap = [];

  /**
   * Only research-anchored (market-checked, hand-reviewed) medicine pages are
   * crawlable targets. Derived variants are excluded to keep the indexed
   * corpus small and high-value — matching the noindex directive on those pages.
   */
  try {
    const rows = await db
      .select({ slug: medicines.slug })
      .from(medicines)
      .where(eq(medicines.priceStatus, "market_checked"))
      .orderBy(desc(sql`(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice}, 1))`))
      .limit(2000);

    medicineRoutes = rows
      .filter((row) => row.slug)
      .flatMap((row) =>
        primaryLocales.map((locale) => ({
          url: `${baseUrl}/${locale}/medicine/${row.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
      );
  } catch {
    medicineRoutes = [];
  }

  return [...landing, ...staticRoutes, ...articleRoutes, ...authorRoutes, ...medicineRoutes];
}
