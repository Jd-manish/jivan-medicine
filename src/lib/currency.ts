/**
 * Multi-currency display. Shows prices in the user's likely currency
 * based on locale, with USD always available.
 */

export const CURRENCY_MAP: Record<string, { code: string; symbol: string; rate: number }> = {
  en: { code: "USD", symbol: "$", rate: 1 },
  de: { code: "EUR", symbol: "€", rate: 0.92 },
  fr: { code: "EUR", symbol: "€", rate: 0.92 },
  it: { code: "EUR", symbol: "€", rate: 0.92 },
  es: { code: "EUR", symbol: "€", rate: 0.92 },
  pt: { code: "EUR", symbol: "€", rate: 0.92 },
  nl: { code: "EUR", symbol: "€", rate: 0.92 },
  pl: { code: "PLN", symbol: "zł", rate: 4.05 },
  sv: { code: "SEK", symbol: "kr", rate: 10.5 },
  da: { code: "DKK", symbol: "kr", rate: 6.85 },
  fi: { code: "EUR", symbol: "€", rate: 0.92 },
  cs: { code: "CZK", symbol: "Kč", rate: 23.0 },
  ro: { code: "RON", symbol: "lei", rate: 4.58 },
  hu: { code: "HUF", symbol: "Ft", rate: 360 },
  el: { code: "EUR", symbol: "€", rate: 0.92 },
  sk: { code: "EUR", symbol: "€", rate: 0.92 },
  sl: { code: "EUR", symbol: "€", rate: 0.92 },
  hr: { code: "EUR", symbol: "€", rate: 0.92 },
  bg: { code: "BGN", symbol: "лв", rate: 1.80 },
  et: { code: "EUR", symbol: "€", rate: 0.92 },
  lv: { code: "EUR", symbol: "€", rate: 0.92 },
  lt: { code: "EUR", symbol: "€", rate: 0.92 },
  mt: { code: "EUR", symbol: "€", rate: 0.92 },
  ga: { code: "EUR", symbol: "€", rate: 0.92 },
};

/**
 * Convert USD cents to local currency.
 * Returns formatted string like "€180" or "£150".
 */
export function formatLocalPrice(usdCents: number, locale: string): string {
  const currency = CURRENCY_MAP[locale] ?? CURRENCY_MAP.en;
  const usd = usdCents / 100;
  const local = usd * currency.rate;

  if (local >= 1000) {
    return `${currency.symbol}${Math.round(local).toLocaleString("en-US")}`;
  }
  if (local >= 100) {
    return `${currency.symbol}${Math.round(local)}`;
  }
  return `${currency.symbol}${local.toFixed(2)}`;
}

/**
 * Format USD price from cents.
 */
export function formatUsd(cents: number, locale?: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : locale ?? "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents < 10000 ? 2 : 0,
  }).format(cents / 100);
}

/**
 * Savings percentage — floored to 1 decimal, capped at 99.9%.
 */
export function savingsPercent(usEuPrice: number, indiaPrice: number): number {
  if (!usEuPrice || usEuPrice <= 0) return 0;
  const raw = (1 - indiaPrice / usEuPrice) * 100;
  return Math.max(0, Math.min(99.9, Math.floor(raw * 10) / 10));
}

/**
 * How many times cheaper.
 */
export function savingsMultiple(usEuPrice: number, indiaPrice: number): number {
  return usEuPrice / Math.max(indiaPrice, 1);
}

/**
 * Short badge label.
 */
export function savingsLabel(usEuPrice: number, indiaPrice: number): string {
  const multiple = savingsMultiple(usEuPrice, indiaPrice);
  if (multiple >= 10) return `${Math.round(multiple)}× cheaper`;
  const pct = savingsPercent(usEuPrice, indiaPrice);
  return `Save ${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}