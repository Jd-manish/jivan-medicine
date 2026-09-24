"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatUsd } from "@/components/price-block";

type LookupResult = {
  found: boolean;
  title: string;
  genericSalt: string;
  brandNames: string[];
  doseForms: string[];
  summary: string;
  uses: string[];
  dosage: string[];
  pros: string[];
  cons: string[];
  sideEffects: string[];
  warnings: string[];
  price: {
    usEuPrice: number | null;
    indiaPrice: number | null;
    basis: string;
    confidence: string;
    anchorName?: string;
  };
  indianAlternatives: {
    slug: string;
    name: string;
    company: string;
    strength: string;
    indiaPrice: number;
    usEuPrice: number;
  }[];
  sources: { label: string; url: string }[];
};

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-ink-400">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-ink-600">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mint-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExternalLookupPanel({ query, locale }: { query: string; locale: string }) {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [state, setState] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState("loading");
      try {
        const res = await fetch(`/api/medicines/lookup?q=${encodeURIComponent(query)}`, { cache: "no-store" });
        const json = (await res.json()) as { ok: boolean; result?: LookupResult };
        if (cancelled) return;
        if (json.ok && json.result) {
          setResult(json.result);
          setState("done");
        } else {
          setState("error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (state === "loading") {
    return (
      <div className="panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-mint-500 border-t-transparent" />
          <p className="text-sm font-semibold text-ink-600">
            Searching global medical databases for “{query}”…
          </p>
        </div>
        <div className="mt-5 space-y-3">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
        <p className="mt-4 text-xs text-ink-400">Querying RxNorm, openFDA and Wikipedia.</p>
      </div>
    );
  }

  if (state === "error" || !result?.found) {
    return (
      <div className="panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink-900">Not found in our catalog or public databases</h3>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          We could not retrieve verified information for “{query}”. Rather than show invented data, we would rather tell you
          honestly. Send us the name and our team will research it and add it to the catalog.
        </p>
        <Link href={`/${locale}#quote`} className="btn-primary mt-4">
          Request a manual price check
        </Link>
      </div>
    );
  }

  const hasPrice = result.price.indiaPrice !== null && result.price.usEuPrice !== null;

  return (
    <div className="space-y-5">
      <div className="panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-royal-500/10 px-2.5 py-1 text-[11px] font-bold text-royal-600">
            Live database result
          </span>
          <span className="text-xs text-ink-400">Fetched in real time from public medical sources</span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-ink-900">{result.title}</h3>

        {result.brandNames.length > 0 ? (
          <p className="mt-2 text-sm text-ink-600">
            <span className="font-semibold text-ink-900">Also sold as:</span> {result.brandNames.join(", ")}
          </p>
        ) : null}

        {result.summary ? <p className="mt-4 text-[15px] leading-7 text-ink-600">{result.summary}</p> : null}

        {result.doseForms.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.doseForms.map((form) => (
              <span key={form} className="rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600">
                {form}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink-900">Indian alternative price</h3>

        {hasPrice ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">US / EU price</p>
                <p className="mt-1 text-xl font-bold text-ink-400 line-through">
                  {formatUsd(result.price.usEuPrice!, locale)}
                </p>
              </div>
              <div className="rounded-2xl border border-mint-500/30 bg-mint-500/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-600">Indian market price</p>
                <p className="mt-1 text-xl font-bold text-mint-600">{formatUsd(result.price.indiaPrice!, locale)}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">You save</p>
                <p className="mt-1 text-xl font-bold">
                  {Math.max(0, Math.min(99.9, Math.floor((1 - result.price.indiaPrice! / result.price.usEuPrice!) * 1000) / 10))}%
                </p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-ink-50 p-3 text-xs leading-6 text-ink-600">{result.price.basis}</p>
          </>
        ) : (
          <div className="mt-3 rounded-xl bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-800">{result.price.basis}</p>
            <Link href={`/${locale}#quote`} className="btn-primary mt-3">
              Request a live quotation
            </Link>
          </div>
        )}

        {result.indianAlternatives.length > 0 ? (
          <div className="mt-5">
            <h4 className="text-sm font-bold uppercase tracking-wide text-ink-400">Matching catalog entries</h4>
            <div className="mt-3 space-y-2">
              {result.indianAlternatives.map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/${locale}/medicine/${alt.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3 transition hover:border-mint-500/40 hover:bg-mint-500/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">{alt.name}</span>
                    <span className="block text-xs text-ink-400">{alt.company} · {alt.strength}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-mint-600">{formatUsd(alt.indiaPrice, locale)}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink-900">Clinical information</h3>
        <div className="mt-4 space-y-5">
          <Section title="Uses" items={result.uses} />
          <Section title="Dosage guidance" items={result.dosage} />
          <Section title="Reported side effects" items={result.sideEffects} />
          <Section title="Warnings" items={result.warnings} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="panel rounded-3xl border-l-4 border-l-mint-500 p-6">
          <h3 className="text-base font-bold text-ink-900">Pros</h3>
          <ul className="mt-3 space-y-2">
            {result.pros.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-ink-600">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mint-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel rounded-3xl border-l-4 border-l-amber-500 p-6">
          <h3 className="text-base font-bold text-ink-900">Cons</h3>
          <ul className="mt-3 space-y-2">
            {result.cons.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-ink-600">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result.sources.length > 0 ? (
        <div className="panel rounded-3xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Data sources</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.sources.map((source) => (
              <li key={source.label}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-100"
                >
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
