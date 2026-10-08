"use client";

import Link from "next/link";
import { savingsLabel } from "@/components/price-block";
import { ExternalLookupPanel } from "@/components/external-lookup-panel";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { classSearchTerms, matchesMedicineSearch, suggestSearchCorrection } from "@/lib/search-utils";
import { searchProcedureIndex } from "@/lib/surgery-search-index";
import medicineSlugManifest from "@/lib/medicine-slug-manifest.json";

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

const PAGE_SIZE = 24;

function useUrlQueryParam(name: string): string {
  const subscribe = useCallback((notify: () => void) => {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener("popstate", notify);
    window.addEventListener("hashchange", notify);
    return () => {
      window.removeEventListener("popstate", notify);
      window.removeEventListener("hashchange", notify);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get(name) ?? "";
  }, [name]);
  const getServerSnapshot = useCallback(() => "", []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const categoryAccent: Record<string, string> = {
  Medicine: "bg-royal-500/10 text-royal-600",
  Injection: "bg-mint-500/10 text-mint-600",
  "Life Saving Drug": "bg-rose-500/10 text-rose-600",
  Equipment: "bg-amber-500/10 text-amber-600",
};
const medicineDetailSlugs = new Set(medicineSlugManifest.generatedMedicineSlugs);

function MedicineSearchCard({
  item,
  index,
  locale,
  copy,
  moneyFormatter,
  selected,
  referenceSlug,
  onToggle,
}: {
  item: MedicineRow;
  index: number;
  locale: string;
  copy: SearchCopy;
  moneyFormatter: Intl.NumberFormat;
  selected: boolean;
  referenceSlug?: string;
  onToggle: (item: MedicineRow) => void;
}) {
  const badge = savingsLabel(item.usEuPrice, item.indiaPrice);
  const hasDetailPage = medicineDetailSlugs.has(item.slug);
  const isVerified = item.priceStatus === "market_checked";

  return (
    <article className={`panel panel-hover anim-rise relative overflow-hidden rounded-3xl p-5 delay-${Math.min(index % 4 + 1, 4)}`}>
      <div className="absolute right-4 top-4 rounded-xl bg-gradient-to-br from-mint-300 to-mint-500 px-2.5 py-1 text-xs font-bold text-[#04150f] shadow-md shadow-mint-500/30">
        {badge}
      </div>
      <span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${categoryAccent[item.category] ?? "bg-ink-100 text-ink-600"}`}>
        {item.category}
      </span>
      <h3 className="mt-3 pr-16 text-base font-bold leading-snug text-ink-900">
        {hasDetailPage ? <Link href={`/${locale}/medicine/${item.slug}/`} className="hover:text-mint-700">{item.name}</Link> : item.name}
      </h3>
      <p className="mt-1 text-xs font-medium text-ink-400">{item.form} · {item.strength} · {item.company}</p>
      <div className="mt-4 space-y-1.5 text-xs text-ink-600">
        <p><span className="font-semibold text-ink-800">{copy.tableSalt}:</span> {item.genericSalt}</p>
        <p className="line-clamp-2"><span className="font-semibold text-ink-800">{copy.tableUses}:</span> {item.useCases}</p>
      </div>
      <div className="mt-4 flex items-end justify-between rounded-2xl bg-ink-50 p-3">
        <div>
          <p className="text-[11px] font-medium text-ink-400">{copy.tableUsEuPrice}</p>
          <p className="text-sm font-semibold text-ink-400 line-through">{moneyFormatter.format(item.usEuPrice / 100)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-mint-600">{copy.tableIndiaPrice}</p>
          <p className="text-lg font-bold text-mint-600">{moneyFormatter.format(item.indiaPrice / 100)}</p>
        </div>
      </div>
      {!hasDetailPage ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
          Calculated catalogue estimate, not a separately checked product or supplier quote. {referenceSlug ? (
            <Link href={`/${locale}/medicine/${referenceSlug}/`} className="mt-1 block font-semibold underline underline-offset-2">
              View the curated {item.genericSalt} reference (base presentation)
            </Link>
          ) : (
            <Link href={`/${locale}/contact/`} className="mt-1 block font-semibold underline underline-offset-2">Ask us about this entry</Link>
          )}
        </div>
      ) : null}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${isVerified ? "bg-mint-500/10 text-mint-600" : "bg-amber-500/10 text-amber-600"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? "bg-mint-500" : "bg-amber-500"}`} />
          {isVerified ? copy.pricingReal : copy.pricingEstimated}
        </span>
        <button
          type="button"
          onClick={() => onToggle(item)}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${selected ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"}`}
        >
          {selected ? "Added" : "Compare"}
        </button>
      </div>
    </article>
  );
}

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
  const queryFromUrl = useUrlQueryParam("q");
  const [editedQuery, setEditedQuery] = useState<string | null>(null);
  const query = editedQuery ?? queryFromUrl;
  const [activeCategory, setActiveCategory] = useState(copy.allCategories);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogFailed, setCatalogFailed] = useState(false);
  const catalogPromise = useRef<Promise<MedicineRow[]> | null>(null);
  const [allRows, setAllRows] = useState<MedicineRow[]>(initialData.rows);
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

  const loadFullCatalog = useCallback((): Promise<MedicineRow[]> => {
    if (!catalogPromise.current) {
      catalogPromise.current = fetch("/data/medicines.json")
        .then((response) => {
          if (!response.ok) throw new Error("Medicine catalog could not be loaded");
          return response.json() as Promise<MedicineRow[]>;
        })
        .then((data) => {
          const rows = Array.isArray(data) ? data : [];
          setAllRows(rows);
          setCatalogReady(true);
          return rows;
        })
        .catch(() => {
          setCatalogFailed(true);
          setCatalogReady(true);
          return initialData.rows;
        });
    }
    return catalogPromise.current;
  }, [initialData.rows]);

  // Keep the 7.2 MB catalog off the critical path. Load after first paint/idle,
  // immediately for a URL query, or directly from a user's search interaction.
  useEffect(() => {
    if (catalogReady) return;
    if (query.trim().length >= 2) {
      void loadFullCatalog();
      return;
    }
    const timer = window.setTimeout(() => void loadFullCatalog(), 1400);
    return () => window.clearTimeout(timer);
  }, [catalogReady, loadFullCatalog, query]);

  const correction = useMemo(() => {
    const term = query.trim();
    if (!term || allRows.some((medicine) => matchesMedicineSearch(term, medicine))) return null;
    return suggestSearchCorrection(term, allRows);
  }, [allRows, query]);
  const effectiveQuery = correction ?? query;
  const classTerms = classSearchTerms(query);

  const matchingMedicines = useMemo(() => {
    const term = effectiveQuery.trim();
    let matches = term ? allRows.filter((medicine) => matchesMedicineSearch(term, medicine)) : allRows;
    if (activeCategory !== copy.allCategories) {
      matches = matches.filter((medicine) => medicine.category === activeCategory);
    }
    return matches;
  }, [activeCategory, allRows, copy.allCategories, effectiveQuery]);

  const operationResults = useMemo(() => {
    if (effectiveQuery.trim().length < 2) return [];
    return searchProcedureIndex(effectiveQuery).slice(0, 8);
  }, [effectiveQuery]);

  const pageCountBase = !query.trim() && activeCategory === copy.allCategories && !catalogReady
    ? initialData.total
    : matchingMedicines.length;
  const totalPages = Math.max(1, Math.ceil(pageCountBase / PAGE_SIZE));
  const pageRows = matchingMedicines.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rows = useMemo(() => {
    const list = [...pageRows];
    if (sort === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "priceLow") return list.sort((a, b) => a.indiaPrice - b.indiaPrice);
    return list.sort((a, b) => b.usEuPrice / Math.max(b.indiaPrice, 1) - a.usEuPrice / Math.max(a.indiaPrice, 1));
  }, [pageRows, sort]);

  const displayedTotal = query.trim()
    ? matchingMedicines.length + operationResults.length
    : activeCategory === copy.allCategories && !catalogReady
      ? initialData.total
      : matchingMedicines.length;

  const handleQueryChange = (value: string) => {
    setEditedQuery(value);
    setPage(1);
    if (value.trim().length >= 2 && !catalogReady) {
      setLoading(true);
      void loadFullCatalog().finally(() => setLoading(false));
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
    if (!catalogReady) {
      setLoading(true);
      void loadFullCatalog().finally(() => setLoading(false));
    }
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (!catalogReady && nextPage * PAGE_SIZE > initialData.rows.length) {
      setLoading(true);
      void loadFullCatalog().finally(() => setLoading(false));
    }
  };

  const toggleCompare = (item: MedicineRow) => {
    setCompare((prev) => {
      const exists = prev.some((row) => row.id === item.id);
      if (exists) return prev.filter((row) => row.id !== item.id);
      return [...prev.slice(-2), item];
    });
  };

  const quickChips = ["Insulin", "Migraine", "Statins", "Diabetes", "Appendix surgery", "Apixaban", "Trastuzumab", "Empagliflozin"];

  return (
    <section id="catalog" className="scroll-mt-24">
      <div className="shell">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Live catalog</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-ink-900 sm:text-3xl">{copy.searchTitle}</h2>
          </div>
          <div className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100">
            {displayedTotal.toLocaleString()} <span className="font-medium text-ink-400">{copy.resultsLabel}</span>
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
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-ink-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleQueryChange(chip)}
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
                      onClick={() => handleCategoryChange(category)}
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

        {correction ? (
          <div role="status" className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            <strong>Did you mean “{correction}”?</strong> Showing matching medicines for “{correction}”.
            <button onClick={() => handleQueryChange(correction)} className="ml-2 font-semibold underline underline-offset-2">Use this spelling</button>
          </div>
        ) : null}

        {classTerms.length > 0 ? (
          <div role="status" className="mt-4 rounded-2xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm text-mint-900">
            Showing Indian medicine alternatives from the {query} therapeutic class. Confirm any treatment or substitution with your clinician.
          </div>
        ) : null}

        {operationResults.length > 0 ? (
          <section aria-labelledby="operation-search-results" className="panel mt-5 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-mint-600">Operations &amp; procedures</p>
                <h3 id="operation-search-results" className="mt-1 text-lg font-bold text-ink-900">Matching procedure guides</h3>
              </div>
              <Link href={`/${locale}/surgeries`} className="text-xs font-semibold text-mint-700 underline underline-offset-2">Browse all 25 →</Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {operationResults.map((operation) => (
                <Link key={operation.slug} href={`/${locale}/surgeries/${operation.slug}`} className="rounded-2xl border border-ink-100 bg-white p-4 transition hover:border-mint-300 hover:bg-mint-50/40">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{operation.category}</p>
                  <p className="mt-1 font-bold text-ink-900">{operation.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-500">{operation.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {(loading || (query.trim().length >= 2 && !catalogReady && !catalogFailed && matchingMedicines.length === 0 && operationResults.length === 0)) ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-3xl" />
            ))}
          </div>
        ) : rows.length === 0 && query.trim().length >= 2 && operationResults.length === 0 && catalogReady ? (
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
                    Checking public reference services. Indian prices and alternatives are shown only when our catalog has an exact match.
                  </p>
                </div>
              </div>
            </div>
            <ExternalLookupPanel query={query.trim()} locale={locale} medicineRows={allRows} />
          </div>
        ) : rows.length === 0 && operationResults.length > 0 ? (
          <div className="panel mt-5 rounded-2xl p-5 text-sm text-ink-600">
            No medicine matches for “{query}”. Matching operation and procedure guides are listed above.
          </div>
        ) : rows.length === 0 ? (
          <div className="panel mt-6 rounded-3xl p-10 text-center">
            <p className="text-sm font-medium text-ink-600">{copy.noResults}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((item, index) => {
              const sourceAnchor = allRows.find(
                (row) => row.genericSalt === item.genericSalt && medicineDetailSlugs.has(row.slug),
              );
              return (
                <MedicineSearchCard
                  key={item.id}
                  item={item}
                  index={index}
                  locale={locale}
                  copy={copy}
                  moneyFormatter={fmt}
                  selected={compare.some((row) => row.id === item.id)}
                  referenceSlug={sourceAnchor?.slug}
                  onToggle={toggleCompare}
                />
              );
            })}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
            className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600 transition hover:border-ink-400 disabled:opacity-40"
          >
            ← Previous
          </button>
          <p className="text-xs font-medium text-ink-400">
            Page <span className="font-bold text-ink-900">{page}</span> of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || loading}
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
