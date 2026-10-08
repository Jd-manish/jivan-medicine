"use client";

import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { useMemo, useState } from "react";

export function SavingsCalculator({ locale }: { locale: string }) {
  const [monthlySpend, setMonthlySpend] = useState(320);
  const [savingRate, setSavingRate] = useState(78);

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const newMonthly = Math.round(monthlySpend * (1 - savingRate / 100));
  const monthlySaved = monthlySpend - newMonthly;
  const yearlySaved = monthlySaved * 12;

  return (
    <div className="panel rounded-3xl p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">{ui(locale, P.calcKicker)}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink-900 sm:text-2xl">{ui(locale, P.calcTitle)}</h3>
        </div>
        <div className="hidden h-12 w-12 place-items-center rounded-2xl bg-mint-500/10 text-lg font-bold text-mint-600 sm:grid">
          %
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="spend" className="font-medium text-ink-600">
              {ui(locale, P.calcSpendLabel)}
            </label>
            <span className="font-semibold text-ink-900">{fmt.format(monthlySpend)}</span>
          </div>
          <input
            id="spend"
            type="range"
            min={40}
            max={3000}
            step={10}
            value={monthlySpend}
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="mt-3 w-full accent-mint-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="rate" className="font-medium text-ink-600">
              {ui(locale, P.calcRateLabel)}
            </label>
            <span className="font-semibold text-ink-900">{savingRate}%</span>
          </div>
          <input
            id="rate"
            type="range"
            min={30}
            max={92}
            step={1}
            value={savingRate}
            onChange={(e) => setSavingRate(Number(e.target.value))}
            className="mt-3 w-full accent-mint-500"
          />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-ink-50 p-4">
          <p className="text-xs font-medium text-ink-400">{ui(locale, P.calcNewMonthly)}</p>
          <p className="mt-1 text-xl font-semibold text-ink-900">{fmt.format(newMonthly)}</p>
        </div>
        <div className="rounded-2xl bg-ink-50 p-4">
          <p className="text-xs font-medium text-ink-400">{ui(locale, P.calcSavedMonthly)}</p>
          <p className="mt-1 text-xl font-semibold text-mint-600">{fmt.format(monthlySaved)}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-mint-300 to-mint-500 p-4 text-[#04150f]">
          <p className="text-xs font-medium text-[#04150f]/80">{ui(locale, P.calcSavedYearly)}</p>
          <p className="mt-1 text-xl font-semibold">{fmt.format(yearlySaved)}</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">{ui(locale, P.calcNote)}</p>
    </div>
  );
}
