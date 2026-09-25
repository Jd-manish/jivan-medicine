"use client";

import Link from "next/link";

/**
 * Popular medicine search suggestions.
 * Shows curated high-interest medicines as quick-search chips.
 */
const POPULAR_SEARCHES = [
  { name: "Sofosbuvir", savings: "99%", area: "Hepatitis C" },
  { name: "Imatinib", savings: "99%", area: "Cancer" },
  { name: "Insulin Glargine", savings: "96%", area: "Diabetes" },
  { name: "Trastuzumab", savings: "98%", area: "Breast Cancer" },
  { name: "Apixaban", savings: "96%", area: "Blood Clots" },
  { name: "Lenalidomide", savings: "99%", area: "Myeloma" },
  { name: "Empagliflozin", savings: "97%", area: "Diabetes" },
  { name: "Meropenem", savings: "95%", area: "Infections" },
  { name: "Rituximab", savings: "97%", area: "Lymphoma" },
  { name: "Budesonide", savings: "95%", area: "Asthma" },
  { name: "Entecavir", savings: "98%", area: "Hepatitis B" },
  { name: "Dolutegravir", savings: "94%", area: "HIV" },
];

export function PopularSearches({ locale }: { locale: string }) {
  return (
    <div className="panel rounded-3xl p-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">
          Most searched — biggest savings
        </h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((item) => (
          <Link
            key={item.name}
            href={`/${locale}/search?q=${encodeURIComponent(item.name)}`}
            className="group flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-2 text-xs font-medium text-ink-700 transition hover:border-mint-500/40 hover:bg-mint-50 hover:text-mint-700"
          >
            <span>{item.name}</span>
            <span className="rounded-full bg-mint-500/10 px-1.5 py-0.5 text-[10px] font-bold text-mint-600 group-hover:bg-mint-500/20">
              {item.savings} off
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}