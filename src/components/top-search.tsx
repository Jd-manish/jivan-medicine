"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { savingsLabel } from "@/components/price-block";
import { matchesMedicineSearch, suggestSearchCorrection } from "@/lib/search-utils";
import { searchProcedureIndex, type SurgerySearchEntry } from "@/lib/surgery-search-index";
import medicineSlugManifest from "@/lib/medicine-slug-manifest.json";

const medicineDetailSlugs = new Set(medicineSlugManifest.generatedMedicineSlugs);

type Suggestion = {
  slug: string;
  name: string;
  genericSalt: string;
  category: string;
  therapyArea: string;
  useCases?: string;
  brandNames?: string;
  company?: string;
  strength?: string;
  form?: string;
  packSize?: string;
  priceStatus?: string;
  indiaPrice: number;
  usEuPrice: number;
};

export function TopSearch({
  locale,
  placeholder,
  size = "compact",
}: {
  locale: string;
  placeholder: string;
  size?: "compact" | "hero";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [operationItems, setOperationItems] = useState<SurgerySearchEntry[]>([]);
  const [correction, setCorrection] = useState<string | null>(null);
  const [resultsQuery, setResultsQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // The full catalog is downloaded only after a visitor starts a search.
  const indexRef = useRef<Suggestion[] | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) return;

    let cancelled = false;
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        if (!indexRef.current) {
          const response = await fetch("/data/medicines.json");
          if (!response.ok) throw new Error("Catalog fetch failed");
          indexRef.current = (await response.json()) as Suggestion[];
        }

        const term = query.trim();
        const catalog = indexRef.current ?? [];
        const exactMatches = catalog.filter((medicine) => matchesMedicineSearch(term, medicine));
        const suggestedTerm = exactMatches.length === 0 ? suggestSearchCorrection(term, catalog) : null;
        const activeTerm = suggestedTerm ?? term;
        const allMatches = suggestedTerm
          ? catalog.filter((medicine) => matchesMedicineSearch(activeTerm, medicine))
          : exactMatches;
        const matchedSalts = new Set(allMatches.map((medicine) => medicine.genericSalt));
        const matches = catalog
          .filter((medicine) => medicineDetailSlugs.has(medicine.slug) && matchedSalts.has(medicine.genericSalt))
          .slice(0, 8);
        const procedures = searchProcedureIndex(activeTerm).slice(0, 5);

        if (!cancelled) {
          setItems(matches);
          setOperationItems(procedures);
          setCorrection(suggestedTerm);
          setResultsQuery(term);
          setOpen(true);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setOperationItems(searchProcedureIndex(query.trim()).slice(0, 5));
          setCorrection(null);
          setResultsQuery(query.trim());
          setOpen(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query]);

  const isSearchable = query.trim().length >= 2;
  const hasCurrentResults = isSearchable && resultsQuery === query.trim();
  const visibleItems = hasCurrentResults ? items : [];
  const visibleOperationItems = hasCurrentResults ? operationItems : [];
  const visibleCorrection = hasCurrentResults ? correction : null;

  const goToSearch = (value: string) => {
    if (!value.trim()) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(value.trim())}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(visibleItems.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && visibleItems[active]) {
        setOpen(false);
        router.push(`/${locale}/medicine/${visibleItems[active].slug}/`);
      } else {
        goToSearch(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = size === "hero";

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 ${isHero ? "h-5 w-5" : "h-4 w-4"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.2-4.2" />
        </svg>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onFocus={() => isSearchable && (visibleItems.length || visibleOperationItems.length) && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search medicines, diseases, symptoms, drug classes and procedures"
          role="combobox"
          aria-expanded={isSearchable && open}
          aria-autocomplete="list"
          aria-controls="top-search-menu"
          className={`w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-24 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 ${
            isHero ? "py-4 text-base" : "py-2.5 text-sm"
          }`}
        />

        <button
          onClick={() => goToSearch(query)}
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-ink-900 font-semibold text-white transition hover:bg-ink-800 ${
            isHero ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          Search
        </button>
      </div>

      {isSearchable && open && (visibleItems.length > 0 || visibleOperationItems.length > 0 || loading || Boolean(visibleCorrection)) ? (
        <div id="top-search-menu" className="top-search-menu absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl">
          {visibleCorrection ? (
            <p className="border-b border-ink-100 bg-sky-50 px-4 py-2.5 text-xs text-sky-900">
              Did you mean <strong>“{correction}”</strong>? Matching medicines are shown below.
            </p>
          ) : null}
          {loading && visibleItems.length === 0 && visibleOperationItems.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-400">Searching medicines and procedures…</p>
          ) : (
            <>
              {visibleItems.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto">
                  {visibleItems.map((item, index) => {
                    const badge = savingsLabel(item.usEuPrice, item.indiaPrice);
                    return (
                      <li key={item.slug}>
                        <button
                          onMouseEnter={() => setActive(index)}
                          onClick={() => {
                            setOpen(false);
                            router.push(`/${locale}/medicine/${item.slug}/`);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                            active === index ? "bg-mint-500/8" : "hover:bg-ink-50"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink-900">{item.name}</span>
                            <span className="block truncate text-xs text-ink-400">
                              {item.genericSalt} · {item.therapyArea}
                            </span>
                          </span>
                          <span className="shrink-0 rounded-lg bg-mint-500/10 px-2 py-1 text-[11px] font-bold text-mint-600">
                            {badge}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {visibleOperationItems.length > 0 ? (
                <div className="border-t border-ink-100 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">Operations &amp; procedures</p>
                  <ul className="mt-1 max-h-48 overflow-y-auto">
                    {visibleOperationItems.map((operation) => (
                      <li key={operation.slug}>
                        <Link
                          href={`/${locale}/surgeries/${operation.slug}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-2 py-2 text-sm font-semibold text-ink-800 hover:bg-mint-50 hover:text-mint-700"
                        >
                          {operation.name}<span className="ml-2 text-xs font-normal text-ink-400">{operation.category}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <button
                onClick={() => goToSearch(query)}
                className="w-full border-t border-ink-100 bg-ink-50 px-4 py-3 text-left text-xs font-semibold text-ink-600 hover:bg-ink-100"
              >
                See all medicine, disease, class and operation results for “{query}” →
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
