"use client";

import Link from "next/link";
import { savingsLabel, savingsPercent } from "@/components/price-block";
import { ExternalLookupPanel } from "@/components/external-lookup-panel";
import { useEffect, useMemo, useState } from "react";

type MedicineRow = {
  id: number;
  slug: string;
  name: string;
  brandNames?: string;
  category: string;
  therapyArea: string;
  form: string;
  company: string;
  genericSalt: string;
  strength: string;
  packSize: string;
  useCases: string;
  usEuPrice: number;
  indiaPrice: number;
  priceStatus: string;
  priceNotes?: string;
  prescriptionRequired?: boolean;
  highSaving?: boolean;
};

type CatalogResponse = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rows: MedicineRow[];
};

type SearchCopy = {
  searchTitle: string;
  searchPlaceholder: string;
  allCategories: string;
  tableMedicine: string;
  tableCategory: string;
  tableUses: string;
  tableCompany: string;
  tableSalt: string;
  tableUsEuPrice: string;
  tableIndiaPrice: string;
  tableSavings: string;
  tablePriceStatus: string;
  tablePriceNotes: string;
  noResults: string;
  resultsLabel: string;
  pricingReal: string;
  pricingEstimated: string;
};

const categoryAccent: Record<string, string> = {
  Medicine: "bg-royal-500/10 text-royal-600",
  Injection: "bg-mint-500/10 text-mint-600",
  "Life Saving Drug": "bg-rose-500/10 text-rose-600",
  Equipment: "bg-amber-500/10 text-amber-600",
};

export function MedicineSearch({
  initialData,
  categories,
  locale,
  copy,
}: {
  initialData: CatalogResponse;
  categories: string[];
  locale: string;
  copy: SearchCopy;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(copy.allCategories);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<CatalogResponse>(initialData);
  const [compare, setCompare] = useState<MedicineRow[]>([]);
  const [sort, setSort] = useState<"savings" | "priceLow" | "name">("savings");

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  // Load full catalog from static JSON on mount
  const [allRows, setAllRows] = useState<MedicineRow[]>([]);
  useEffect(() => {
    fetch("/data/medicines.json")
      .then((r) => r.json())
      .then((data: MedicineRow[]) => setAllRows(data))
      .catch(() => {});
  }, []);

  // Client-side filtering and pagination (no API needed)
  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      const cat = activeCategory === copy.allCategories ? "All" : activeCategory;
      const search = query.trim().toLowerCase();

      let filtered = allRows.length > 0 ? allRows : initialData.rows;

      if (search) {
        filtered = filtered.filter((m) =>
          m.name.toLowerCase().includes(search) ||
          m.genericSalt.toLowerCase().includes(search) ||
          m.brandNames?.toLowerCase().includes(search) ||
          m.company.toLowerCase().includes(search) ||
          m.useCases?.toLowerCase().includes(search)
        );
      }

      if (cat !== "All") {
        filtered = filtered.filter((m) => m.category === cat);
      }

      const total = filtered.length;
      const pageSize = 24;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

      setCatalog({ total, page, pageSize, totalPages, rows });
      setLoading(false);
    }, 150);

    return () => clearTimeout(handle);
  }, [activeCategory, copy.allCategories, page, query, allRows, initialData.rows]);

  useEffect(() => {
    setPage(1);
  }, [query, activeCategory]);

  const rows = useMemo(() => {
    const list = [...catalog.rows];
    if (sort === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "priceLow") return list.sort((a, b) => a.indiaPrice - b.indiaPrice);
    return list.sort((a, b) => b.usEuPrice / b.indiaPrice - a.usEuPrice / a.indiaPrice);
  }, [catalog.rows, sort]);

  const toggleCompare = (item: MedicineRow) => {
    setCompare((prev) => {
      const exists = prev.some((row) => row.id === item.id);
      if (exists) return prev.filter((row) => row.id !== item.id);
      return [...prev.slice(-2), item];
    });
  };

  const quickChips = ["Insulin", "Apixaban", "Trastuzumab", "Meropenem", "Glucometer", "Empagliflozin"];

  return (
    <section id="catalog" className="scroll-mt-24">
      <div className="shell">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Live catalog</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-ink-900 sm:text-3xl">{copy.searchTitle}</h2>
          </div>
          <div className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100">
            {catalog.total.toLocaleString()} <span className="font-medium text-ink-400">{copy.resultsLabel}</span>
          </div>
        </div>

        <div className="panel mt-6 rounded-3xl p-4 sm:p-6">
          <div className="relative">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-ink-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className="rounded-full bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:bg-mint-500/10 hover:text-mint-600"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 overflow-x-auto">
              <div className="flex min-w-max gap-2 px-1">
                {[copy.allCategories, ...categories].map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`pill-tab ${
                        isActive
                          ? "bg-ink-900 text-white shadow-lg shadow-ink-900/20"
                          : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 outline-none"
            >
              <option value="savings">Sort: Best savings</option>
              <option value="priceLow">Sort: Lowest price</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-3xl" />
            ))}
          </div>
        ) : rows.length === 0 && query.trim().length >= 2 ? (
          <div className="mt-6">
            <div className="panel rounded-3xl p-6 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-500/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-royal-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4.2-4.2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-900">
                    &ldquo;{query}&rdquo; is not in our curated catalog
                  </p>
                  <p className="text-xs text-ink-500">
                    Searching global medical databases (RxNorm, openFDA, Wikipedia) for real-time data…
                  </p>
                </div>
              </div>
            </div>
            <ExternalLookupPanel query={query.trim()} locale={locale} />
          </div>
        ) : rows.length === 0 ? (
          <div className="panel mt-6 rounded-3xl p-10 text-center">
            <p className="text-sm font-medium text-ink-600">{copy.noResults}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((item, index) => {
              const savings = savingsPercent(item.usEuPrice, item.indiaPrice);
              const badge = savingsLabel(item.usEuPrice, item.indiaPrice);
              const isVerified = item.priceStatus === "market_checked";
              const selected = compare.some((row) => row.id === item.id);

              return (
                <Link
                  key={item.id}
                  href={`/${locale}/medicine/${item.slug}`}
                  className={`panel panel-hover anim-rise relative block overflow-hidden rounded-3xl p-5 delay-${Math.min(index % 4 + 1, 4)}`}
                >
                  <div className="absolute right-4 top-4 rounded-xl bg-gradient-to-br from-mint-400 to-mint-600 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-mint-500/30">
                    {badge}
                  </div>

                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${categoryAccent[item.category] ?? "bg-ink-100 text-ink-600"}`}>
                    {item.category}
                  </span>

                  <h3 className="mt-3 pr-16 text-base font-bold leading-snug text-ink-900">{item.name}</h3>
                  <p className="mt-1 text-xs font-medium text-ink-400">
                    {item.form} · {item.strength} · {item.company}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-ink-600">
                    <p><span className="font-semibold text-ink-800">{copy.tableSalt}:</span> {item.genericSalt}</p>
                    <p className="line-clamp-2"><span className="font-semibold text-ink-800">{copy.tableUses}:</span> {item.useCases}</p>
                  </div>

                  <div className="mt-4 flex items-end justify-between rounded-2xl bg-ink-50 p-3">
                    <div>
                      <p className="text-[11px] font-medium text-ink-400">{copy.tableUsEuPrice}</p>
                      <p className="text-sm font-semibold text-ink-400 line-through">{fmt.format(item.usEuPrice / 100)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-mint-600">{copy.tableIndiaPrice}</p>
                      <p className="text-lg font-bold text-mint-600">{fmt.format(item.indiaPrice / 100)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${
                        isVerified ? "bg-mint-500/10 text-mint-600" : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? "bg-mint-500" : "bg-amber-500"}`} />
                      {isVerified ? copy.pricingReal : copy.pricingEstimated}
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(item);
                      }}
                      className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                        selected ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                      }`}
                    >
                      {selected ? "Added" : "Compare"}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={catalog.page <= 1 || loading}
            className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600 transition hover:border-ink-400 disabled:opacity-40"
          >
            ← Previous
          </button>
          <p className="text-xs font-medium text-ink-400">
            Page <span className="font-bold text-ink-900">{catalog.page}</span> of {catalog.totalPages}
          </p>
          <button
            onClick={() => setPage((p) => Math.min(catalog.totalPages, p + 1))}
            disabled={catalog.page >= catalog.totalPages || loading}
            className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600 transition hover:border-ink-400 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {compare.length > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 px-4 md:bottom-6">
          <div className="glass-card pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 overflow-x-auto rounded-2xl p-3">
            <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-ink-400">Compare</span>
            {compare.map((item) => (
              <div key={item.id} className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-ink-100">
                <p className="font-semibold text-ink-900">{item.name.slice(0, 22)}</p>
                <p className="text-ink-400">
                  <span className="line-through">{fmt.format(item.usEuPrice / 100)}</span>{" "}
                  <span className="font-bold text-mint-600">{fmt.format(item.indiaPrice / 100)}</span>
                </p>
              </div>
            ))}
            <button onClick={() => setCompare([])} className="ml-auto shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-ink-400 hover:text-ink-900">
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
