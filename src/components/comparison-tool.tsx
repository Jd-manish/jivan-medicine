"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUsd, savingsPercent, savingsMultiple } from "@/components/price-block";

type Medicine = {
  id: number;
  slug: string;
  name: string;
  genericSalt: string;
  company: string;
  strength: string;
  packSize: string;
  form: string;
  usEuPrice: number;
  indiaPrice: number;
  priceStatus: string;
};

/**
 * Compare 2-3 medicines side by side.
 * Stores selections in localStorage for persistence.
 */
export function ComparisonTool({ locale }: { locale: string }) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState<Medicine[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetch("/data/medicines.json")
      .then((r) => r.json())
      .then((data: Medicine[]) => {
        setAllData(data);
        // Load saved comparisons
        try {
          const saved = localStorage.getItem("jivan-compare");
          if (saved) {
            const ids = JSON.parse(saved) as number[];
            const selected = data.filter((m: Medicine) => ids.includes(m.id)).slice(0, 3);
            setMedicines(selected);
          }
        } catch {}
      })
      .catch(() => {});
  }, []);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const term = searchQuery.toLowerCase();
    return allData
      .filter((medicine) =>
        medicine.name.toLowerCase().includes(term) || medicine.genericSalt.toLowerCase().includes(term),
      )
      .slice(0, 5);
  }, [searchQuery, allData]);

  function addMedicine(med: Medicine) {
    if (medicines.length >= 3) return;
    if (medicines.some((m) => m.id === med.id)) return;
    const next = [...medicines, med];
    setMedicines(next);
    localStorage.setItem("jivan-compare", JSON.stringify(next.map((m) => m.id)));
    setSearchQuery("");
    setShowSearch(false);
  }

  function removeMedicine(id: number) {
    const next = medicines.filter((m) => m.id !== id);
    setMedicines(next);
    localStorage.setItem("jivan-compare", JSON.stringify(next.map((m) => m.id)));
  }

  if (medicines.length === 0 && !showSearch) {
    return (
      <div className="panel rounded-3xl p-6 text-center">
        <p className="text-sm text-ink-600">Compare up to 3 medicines side by side</p>
        <button onClick={() => setShowSearch(true)} className="btn-primary mt-4">
          + Add medicine to compare
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comparison cards */}
      {medicines.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {medicines.map((med) => {
            const savings = savingsPercent(med.usEuPrice, med.indiaPrice);
            const multiple = savingsMultiple(med.usEuPrice, med.indiaPrice);
            return (
              <div key={med.id} className="panel relative rounded-3xl p-5">
                <button
                  onClick={() => removeMedicine(med.id)}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs text-ink-500 hover:bg-red-100 hover:text-red-600"
                  aria-label="Remove"
                >
                  ×
                </button>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {med.genericSalt}
                </p>
                <h3 className="mt-1 text-sm font-bold text-ink-900">{med.name}</h3>
                <p className="text-xs text-ink-400">{med.company} · {med.form}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-400">US/EU price</span>
                    <span className="font-semibold text-ink-400 line-through">{formatUsd(med.usEuPrice, locale)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mint-600 font-medium">India price</span>
                    <span className="font-bold text-mint-600">{formatUsd(med.indiaPrice, locale)}</span>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 p-3 text-center text-white">
                    <p className="text-lg font-black">{savings}% less</p>
                    <p className="text-xs text-white/60">{multiple.toFixed(1)}× cheaper</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add medicine search */}
      {medicines.length < 3 && (
        <div className="panel rounded-3xl p-5">
          {!showSearch ? (
            <button onClick={() => setShowSearch(true)} className="text-sm font-semibold text-mint-600 hover:underline">
              + Add another medicine ({3 - medicines.length} remaining)
            </button>
          ) : (
            <div>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by medicine name or salt..."
                  className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-mint-500"
                  autoFocus
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => addMedicine(med)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-mint-50"
                    >
                      <div>
                        <span className="font-semibold text-ink-900">{med.name}</span>
                        <span className="ml-2 text-xs text-ink-400">{med.company}</span>
                      </div>
                      <span className="text-xs font-bold text-mint-600">{formatUsd(med.indiaPrice, locale)}</span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setShowSearch(false)} className="mt-2 text-xs text-ink-400 hover:text-ink-600">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}