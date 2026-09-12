import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { medicines } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { formatUsd } from "@/components/price-block";
import { isValidLocale } from "@/lib/i18n";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "The Jivan Medicine Price Dataset — Original Reference Data",
    description:
      "The open figures behind Jivan: therapy-area distributions, price-gap statistics and compound-level comparisons computed from our referenced anchor dataset.",
    alternates: { canonical: `/${locale}/data` },
  };
}

export default async function DataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [global, areas, topGaps] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        anchors: sql<number>`count(*) filter (where ${medicines.priceStatus} = 'market_checked')::int`,
        avgMultiple: sql<number>`coalesce(round(avg(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice},1)) filter (where ${medicines.priceStatus}='market_checked')::numeric,1)::float,0)`,
        salts: sql<number>`count(distinct ${medicines.genericSalt})::int`,
      })
      .from(medicines),
    db
      .select({
        area: medicines.therapyArea,
        anchors: sql<number>`count(*)::int`,
        avgMultiple: sql<number>`coalesce(round(avg(${medicines.usEuPrice}::float/GREATEST(${medicines.indiaPrice},1))::numeric,1)::float,0)`,
      })
      .from(medicines)
      .where(eq(medicines.priceStatus, "market_checked"))
      .groupBy(medicines.therapyArea)
      .orderBy(desc(sql`avg(${medicines.usEuPrice}::float/GREATEST(${medicines.indiaPrice},1))`))
      .limit(10),
    db
      .select({
        salt: medicines.genericSalt,
        multiple: sql<number>`round((${medicines.usEuPrice}::float/GREATEST(${medicines.indiaPrice},1)))::int`,
        usEu: medicines.usEuPrice,
        india: medicines.indiaPrice,
        pack: medicines.packSize,
      })
      .from(medicines)
      .where(eq(medicines.priceStatus, "market_checked"))
      .orderBy(desc(sql`(${medicines.usEuPrice}::float/GREATEST(${medicines.indiaPrice},1))`))
      .limit(10),
  ]);

  const stats = global[0] ?? { total: 0, anchors: 0, avgMultiple: 0, salts: 0 };
  const maxArea = areas.length > 0 ? Math.max(...areas.map((a) => a.anchors)) : 1;

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Original data</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">
            The Jivan medicine price dataset
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            First-party reference data computed from our hand-reviewed anchor set — the figures that power every
            comparison on this site. No other public dataset presents these aggregates in this form.
          </p>
        </div>
      </section>

      <div className="shell py-12">
        <dl className="grid gap-4 sm:grid-cols-4">
          {[
            { k: stats.total.toLocaleString(), v: "catalog entries" },
            { k: stats.anchors.toLocaleString(), v: "hand-reviewed anchors" },
            { k: `${stats.avgMultiple}×`, v: "average price gap" },
            { k: stats.salts.toLocaleString(), v: "referenced molecules" },
          ].map((stat) => (
            <div key={stat.v} className="panel rounded-2xl p-5">
              <dt className="text-2xl font-black text-ink-900 sm:text-3xl">{stat.k}</dt>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{stat.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Deepest gaps by therapy area</h2>
            <p className="mt-2 text-sm text-ink-600">Average price gap across market-checked anchors, per area.</p>
            <div className="mt-5 space-y-3">
              {areas.map((area) => (
                <div key={area.area}>
                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href={`/${locale}/search?therapyArea=${encodeURIComponent(area.area)}`}
                      className="font-semibold text-ink-700 hover:text-mint-600"
                    >
                      {area.area}
                    </Link>
                    <span className="font-bold text-mint-600">{area.avgMultiple}×</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-mint-400 to-mint-600"
                      style={{ width: `${(area.anchors / maxArea) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-400">{area.anchors} anchors</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Ten widest documented comparisons</h2>
            <p className="mt-2 text-sm text-ink-600">Reference ranges for the exact pack shown.</p>
            <div className="mt-5 space-y-2.5">
              {topGaps.map((row) => (
                <Link
                  key={row.salt}
                  href={`/${locale}/search?q=${encodeURIComponent(row.salt)}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 px-4 py-3 transition hover:border-mint-500/40 hover:bg-mint-500/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">{row.salt}</span>
                    <span className="text-xs text-ink-400">{row.pack}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-xs text-ink-400 line-through">{formatUsd(row.usEu, locale)}</span>
                    <span className="text-sm font-bold text-mint-600">{formatUsd(row.india, locale)} · {row.multiple}×</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="panel mt-8 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink-900">How to use this data responsibly</h2>
          <div className="mt-3 space-y-2.5 text-sm leading-7 text-ink-600">
            <p>
              These figures are reference ranges for specific pack configurations, recomputed hourly. They are not live
              quotations and do not include insurance, copay, tax or customs effects.
            </p>
            <p>
              You may cite these figures with attribution ("Source: Jivan medicine price dataset") for research,
              journalism and patient-advocacy use, provided the underlying methodology link is preserved. Do not
              re-scrape the catalog to build a competing dataset — see the{" "}
              <Link href={`/${locale}/terms`} className="font-semibold text-mint-600">terms of use</Link>.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/${locale}/methodology`} className="btn-primary">Read the methodology</Link>
            <Link href={`/${locale}/search`} className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 hover:border-ink-400">
              Search the catalog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
