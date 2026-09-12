import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLookupPanel } from "@/components/external-lookup-panel";
import { CapsuleArt } from "@/components/medical-art";
import { formatUsd, PriceStatusBadge, savingsLabel } from "@/components/price-block";
import { TopSearch } from "@/components/top-search";
import { isValidLocale } from "@/lib/i18n";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { ensureMedicineSeeded, getMedicineCatalog, medicineCategories, therapyAreas } from "@/lib/medicines";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; therapyArea?: string; page?: string }>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  if (!isValidLocale(locale)) return {};

  const title = q ? `${q} — Indian alternative price and details` : "Search medicines";

  return {
    title,
    description: q
      ? `Find the Indian alternative for ${q}: price comparison, active salt, uses, dosage, side effects and manufacturer details.`
      : "Search thousands of medicines, injections, life-saving drugs and equipment for lower-cost Indian alternatives.",
    alternates: { canonical: `/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ""}` },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const category = sp.category ?? "All";
  const therapyArea = sp.therapyArea ?? "All";
  const page = Number(sp.page ?? "1") || 1;

  await ensureMedicineSeeded();

  const catalog = await getMedicineCatalog({
    search: query,
    category,
    therapyArea,
    page,
    pageSize: 24,
    sort: "savings",
  });

  const buildHref = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category !== "All") next.set("category", category);
    if (therapyArea !== "All") next.set("therapyArea", therapyArea);
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === "All" || !value) next.delete(key);
      else next.set(key, value);
    });
    return `/${locale}/search?${next.toString()}`;
  };

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <CapsuleArt className="anim-drift absolute -right-4 top-8 w-32 opacity-25" />

        <div className="shell relative py-10 sm:py-14">
          <h1 className="text-2xl font-black text-white sm:text-4xl">
            {query ? <>{ui(locale, P.searchResultsFor)} “{query}”</> : ui(locale, P.searchDefaultTitle)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-200 sm:text-base">
            {catalog.total.toLocaleString()} {ui(locale, P.searchSubLine)}
          </p>

          <div className="mt-6 max-w-2xl">
            <TopSearch locale={locale} placeholder="Search any medicine, salt or brand…" size="hero" />
          </div>
        </div>
      </section>

      <div className="shell py-10">
        {/* Filters */}
        <div className="panel rounded-3xl p-4 sm:p-5">
          <div className="space-y-3">
            <div className="-mx-1 overflow-x-auto">
              <div className="flex min-w-max gap-2 px-1">
                {medicineCategories.map((item) => (
                  <Link
                    key={item}
                    href={buildHref({ category: item, page: "1" })}
                    className={`pill-tab ${category === item ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"}`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="-mx-1 overflow-x-auto">
              <div className="flex min-w-max gap-2 px-1">
                <Link
                  href={buildHref({ therapyArea: "All", page: "1" })}
                  className={`pill-tab ${therapyArea === "All" ? "bg-mint-500 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"}`}
                >
                  {ui(locale, P.searchAllAreas)}
                </Link>
                {therapyAreas.map((area) => (
                  <Link
                    key={area}
                    href={buildHref({ therapyArea: area, page: "1" })}
                    className={`pill-tab ${therapyArea === area ? "bg-mint-500 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"}`}
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Catalog results */}
        {catalog.rows.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.rows.map((item) => {
              const badge = savingsLabel(item.usEuPrice, item.indiaPrice);
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/medicine/${item.slug}`}
                  className="panel panel-hover group relative flex flex-col rounded-3xl p-5"
                >
                  <div className="absolute right-4 top-4 rounded-xl bg-gradient-to-br from-mint-400 to-mint-600 px-2.5 py-1 text-xs font-bold text-white">
                    {badge}
                  </div>

                  <span className="inline-flex w-fit rounded-lg bg-ink-50 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
                    {item.therapyArea}
                  </span>

                  <h2 className="mt-3 pr-16 text-base font-bold leading-snug text-ink-900 group-hover:text-mint-600">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-xs text-ink-400">
                    {item.form} · {item.company} · {item.packSize}
                  </p>
                  <p className="mt-3 line-clamp-2 flex-1 text-xs leading-5 text-ink-600">{item.useCases}</p>

                  <div className="mt-4 flex items-end justify-between rounded-2xl bg-ink-50 p-3">
                    <p className="text-sm font-semibold text-ink-400 line-through">{formatUsd(item.usEuPrice, locale)}</p>
                    <p className="text-lg font-bold text-mint-600">{formatUsd(item.indiaPrice, locale)}</p>
                  </div>

                  <div className="mt-3">
                    <PriceStatusBadge status={item.priceStatus} />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Pagination */}
        {catalog.totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-between">
            {catalog.page > 1 ? (
              <Link href={buildHref({ page: String(catalog.page - 1) })} className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600">
                ← {ui(locale, P.searchPrev)}
              </Link>
            ) : <span />}
            <p className="text-xs text-ink-400">{ui(locale, P.searchPage)} {catalog.page} {ui(locale, P.searchOf)} {catalog.totalPages}</p>
            {catalog.page < catalog.totalPages ? (
              <Link href={buildHref({ page: String(catalog.page + 1) })} className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600">
                {ui(locale, P.searchNext)} →
              </Link>
            ) : <span />}
          </div>
        ) : null}

        {/* Live external lookup */}
        {query ? (
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.searchLiveLookup)}</h2>
              <span className="h-px flex-1 bg-ink-100" />
            </div>
            <ExternalLookupPanel query={query} locale={locale} />
          </div>
        ) : null}
      </div>
    </>
  );
}
