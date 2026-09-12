/**
 * Savings percentage, floored and capped at 99%.
 * Prevents the "-100%" rendering bug where a 99.6% gap rounded up to 100
 * and was displayed with a leading minus sign.
 */
export function savingsPercent(usEuPrice: number, indiaPrice: number) {
  if (!usEuPrice || usEuPrice <= 0) return 0;
  const raw = (1 - indiaPrice / usEuPrice) * 100;
  return Math.max(0, Math.min(99, Math.floor(raw)));
}

/** How many times cheaper the Indian option is, e.g. 116 for a 116x gap. */
export function savingsMultiple(usEuPrice: number, indiaPrice: number) {
  return usEuPrice / Math.max(indiaPrice, 1);
}

/** Short badge label. Uses the multiple for extreme gaps, percent otherwise. */
export function savingsLabel(usEuPrice: number, indiaPrice: number) {
  const multiple = savingsMultiple(usEuPrice, indiaPrice);
  if (multiple >= 10) return `${Math.round(multiple)}× cheaper`;
  return `Save ${savingsPercent(usEuPrice, indiaPrice)}%`;
}

export function formatUsd(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents < 10000 ? 2 : 0,
  }).format(cents / 100);
}

export function PriceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; dot: string }> = {
    market_checked: {
      label: "Referenced market price",
      className: "bg-mint-500/10 text-mint-600 ring-mint-500/20",
      dot: "bg-mint-500",
    },
    derived: {
      label: "Derived from referenced price",
      className: "bg-royal-500/10 text-royal-600 ring-royal-500/20",
      dot: "bg-royal-500",
    },
    external: {
      label: "Sourced from public database",
      className: "bg-royal-500/10 text-royal-600 ring-royal-500/20",
      dot: "bg-royal-500",
    },
    estimated: {
      label: "Estimated",
      className: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
      dot: "bg-amber-500",
    },
  };

  const item = map[status] ?? map.estimated;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 ${item.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function PriceCompare({
  usEuPrice,
  indiaPrice,
  locale,
  packSize,
}: {
  usEuPrice: number;
  indiaPrice: number;
  locale: string;
  packSize?: string;
}) {
  const savings = savingsPercent(usEuPrice, indiaPrice);
  const multiple = savingsMultiple(usEuPrice, indiaPrice).toFixed(1);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">US / EU price</p>
        <p className="mt-1 text-2xl font-bold text-ink-400 line-through">{formatUsd(usEuPrice, locale)}</p>
        {packSize ? <p className="mt-1 text-xs text-ink-400">per {packSize}</p> : null}
      </div>

      <div className="rounded-2xl border border-mint-500/30 bg-mint-500/8 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-600">Indian market price</p>
        <p className="mt-1 text-2xl font-bold text-mint-600">{formatUsd(indiaPrice, locale)}</p>
        {packSize ? <p className="mt-1 text-xs text-mint-600/70">per {packSize}</p> : null}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">You save</p>
        <p className="mt-1 text-2xl font-bold">{savings}%</p>
        <p className="mt-1 text-xs text-white/60">{multiple}× cheaper</p>
      </div>
    </div>
  );
}
