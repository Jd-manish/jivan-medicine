"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatUsd } from "@/components/price-block";
import { normalizeSearchText } from "@/lib/search-utils";
import medicineSlugManifest from "@/lib/medicine-slug-manifest.json";

const medicineDetailSlugs = new Set(medicineSlugManifest.generatedMedicineSlugs);
const REQUEST_TIMEOUT_MS = 10_000;

type LookupResult = {
  found: boolean;
  isMedicineResult: boolean;
  title: string;
  genericSalt: string;
  brandNames: string[];
  doseForms: string[];
  summary: string;
  indications: string[];
  sideEffects: string[];
  warnings: string[];
  price: {
    usEuPrice: number | null;
    indiaPrice: number | null;
    basis: string;
    confidence: "referenced" | "derived" | "unavailable";
    anchorName?: string;
  };
  indianAlternatives: {
    slug: string;
    name: string;
    company: string;
    strength: string;
    indiaPrice: number;
    usEuPrice: number;
    priceStatus: string;
  }[];
  sources: { label: string; url: string }[];
};

type LookupState = {
  query: string;
  status: "loading" | "done" | "error";
  result: LookupResult | null;
};

type LocalMedicineMatch = {
  slug: string;
  name: string;
  company: string;
  strength: string;
  indiaPrice: number;
  usEuPrice: number;
  priceStatus: string;
  genericSalt: string;
  brandNames?: string;
};

type RxNavResponse = {
  drugGroup?: {
    conceptGroup?: {
      conceptProperties?: { name?: string }[];
    }[];
  };
};

type OpenFdaResponse = {
  results?: {
    indications_and_usage?: string[];
    adverse_reactions?: string[];
    warnings_and_cautions?: string[];
    warnings?: string[];
    contraindications?: string[];
    openfda?: { generic_name?: string[]; brand_name?: string[] };
  }[];
};

type WikiResponse = {
  title?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

async function safeJson<T>(url: string, signal: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchWikiSummary(query: string, signal: AbortSignal): Promise<WikiResponse | null> {
  const direct = await safeJson<WikiResponse>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, "_"))}`,
    signal,
  );
  if (direct?.extract) return direct;

  const search = await safeJson<{ query?: { search?: { title?: string }[] } }>(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(query)}`,
    signal,
  );
  const title = search?.query?.search?.[0]?.title;
  if (!title) return null;

  return safeJson<WikiResponse>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, "_"))}`,
    signal,
  );
}

function splitSentences(value: string[], limit = 4): string[] {
  return value
    .join(" ")
    .replace(/\s+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 25)
    .slice(0, limit);
}

function matchesMedicineIdentity(term: string, medicine: LocalMedicineMatch): boolean {
  const normalizedTerm = normalizeSearchText(term);
  if (normalizedTerm.length < 4) return false;

  const identityFields = [medicine.name, medicine.genericSalt, medicine.brandNames ?? ""]
    .map(normalizeSearchText)
    .filter((field) => field.length >= 4);

  return identityFields.some((field) =>
    field === normalizedTerm || field.includes(normalizedTerm) || normalizedTerm.includes(field),
  );
}

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

export function ExternalLookupPanel({
  query,
  locale,
  medicineRows,
}: {
  query: string;
  locale: string;
  medicineRows: LocalMedicineMatch[];
}) {
  const [lookup, setLookup] = useState<LookupState>({ query: "", status: "loading", result: null });
  const term = query.trim().slice(0, 120);
  const currentLookup = lookup.query === term;
  const state = currentLookup ? lookup.status : "loading";
  const result = currentLookup ? lookup.result : null;

  useEffect(() => {
    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const debounce = window.setTimeout(() => {
      void (async () => {
        try {
          const encodedTerm = encodeURIComponent(term);
          const quotedTerm = encodeURIComponent(`"${term}"`);

          // Public, no-key lookups. These provide background only; they do not
          // supply Indian prices or determine whether a treatment is suitable.
          const [rx, fdaGeneric, fdaBrand, wiki] = await Promise.all([
            safeJson<RxNavResponse>(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodedTerm}`, controller.signal),
            safeJson<OpenFdaResponse>(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${quotedTerm}&limit=1`, controller.signal),
            safeJson<OpenFdaResponse>(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${quotedTerm}&limit=1`, controller.signal),
            fetchWikiSummary(term, controller.signal),
          ]);

          const matchedGenericLabel = Boolean(fdaGeneric?.results?.[0]);
          const fda = matchedGenericLabel ? fdaGeneric : fdaBrand;
          const fdaRecord = fda?.results?.[0];
          const rxConcepts = (rx?.drugGroup?.conceptGroup ?? [])
            .flatMap((group) => group.conceptProperties ?? [])
            .map((concept) => concept.name ?? "")
            .filter(Boolean);
          const rxBrandNames = rxConcepts
            .map((name) => name.match(/\[([^\]]+)\]/)?.[1])
            .filter((name): name is string => Boolean(name));
          const rxDoseForms = [...new Set(rxConcepts
            .map((name) => name.match(/(Oral Tablet|Oral Capsule|Injectable Solution|Injection|Oral Solution|Inhalant|Prefilled Syringe|Topical Cream|Eye Drops|Oral Suspension|Extended Release)/i)?.[1])
            .filter((form): form is string => Boolean(form)))].slice(0, 6);
          const rxGenericName = rxConcepts
            .map((name) => name.replace(/\s*\[[^\]]+\]/g, "").trim())
            .find((name) => name.length >= 4) ?? "";
          const genericName = fdaRecord?.openfda?.generic_name?.[0] ?? rxGenericName;
          const brandNames = [...new Set([
            ...rxBrandNames,
            ...(fdaRecord?.openfda?.brand_name ?? []),
          ])].slice(0, 8);
          const isMedicineResult = Boolean(rxConcepts.length || fdaRecord);

          // Only match Indian catalog prices after a drug-identity match. A
          // shared disease/use-case is not enough to call a medicine a substitute.
          const identityTerms = isMedicineResult
            ? [term, genericName, ...brandNames].filter(Boolean)
            : [];
          const alternatives = medicineRows
            .filter((medicine) => medicineDetailSlugs.has(medicine.slug))
            .filter((medicine) => identityTerms.some((identity) => matchesMedicineIdentity(identity, medicine)))
            .slice(0, 6)
            .map((medicine) => ({
              slug: medicine.slug,
              name: medicine.name,
              company: medicine.company,
              strength: medicine.strength,
              indiaPrice: medicine.indiaPrice,
              usEuPrice: medicine.usEuPrice,
              priceStatus: medicine.priceStatus,
            }));

          const reference = alternatives.find((medicine) => medicine.priceStatus === "market_checked") ?? alternatives[0];
          const price: LookupResult["price"] = reference
            ? {
                usEuPrice: reference.usEuPrice,
                indiaPrice: reference.indiaPrice,
                confidence: reference.priceStatus === "market_checked" ? "referenced" : "derived",
                anchorName: `${reference.name} · ${reference.strength}`,
                basis: reference.priceStatus === "market_checked"
                  ? `Matched by active ingredient or brand to the Jivan catalog (${reference.name}, ${reference.strength}). These are listed price references, not a current supplier quote.`
                  : `Matched to a catalog-derived estimate for ${reference.name}. This is not a current supplier quote or confirmation of clinical equivalence.`,
              }
            : {
                usEuPrice: null,
                indiaPrice: null,
                confidence: "unavailable",
                basis: "No exact ingredient-level match with a source-backed Indian price was found. We do not infer a substitute or invent a price; ask a clinician or pharmacist and request a manual price check.",
              };

          const fdaIndications = splitSentences(fdaRecord?.indications_and_usage ?? []);
          const sideEffects = splitSentences(fdaRecord?.adverse_reactions ?? []);
          const warnings = splitSentences([
            ...(fdaRecord?.warnings_and_cautions ?? []),
            ...(fdaRecord?.warnings ?? []),
            ...(fdaRecord?.contraindications ?? []),
          ]);
          const wikiSummary = wiki?.extract?.replace(/\s+/g, " ").trim() ?? "";
          const wikiUrl = wiki?.content_urls?.desktop?.page
            ?? (wiki?.title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.title.replace(/\s+/g, "_"))}` : "");

          const sources = [
            ...(rxConcepts.length ? [{
              label: "RxNorm · US National Library of Medicine",
              url: `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodedTerm}`,
            }] : []),
            ...(fdaRecord ? [{
              label: "openFDA · drug-label API",
              url: `https://api.fda.gov/drug/label.json?search=openfda.${matchedGenericLabel ? "generic_name" : "brand_name"}:${quotedTerm}&limit=1`,
            }] : []),
            ...(wikiSummary && wikiUrl ? [{ label: "Wikipedia · background only", url: wikiUrl }] : []),
          ];

          const lookupResult: LookupResult = {
            found: Boolean(rxConcepts.length || fdaRecord || wikiSummary),
            isMedicineResult,
            title: wiki?.title || genericName || term,
            genericSalt: genericName,
            brandNames,
            doseForms: rxDoseForms,
            summary: wikiSummary,
            indications: fdaIndications,
            sideEffects,
            warnings,
            price,
            indianAlternatives: alternatives,
            sources,
          };

          if (!controller.signal.aborted) {
            setLookup({ query: term, status: "done", result: lookupResult });
          }
        } catch {
          if (!controller.signal.aborted) setLookup({ query: term, status: "error", result: null });
        }
      })();
    }, 250);

    return () => {
      window.clearTimeout(debounce);
      window.clearTimeout(requestTimeout);
      controller.abort();
    };
  }, [medicineRows, term]);

  if (state === "loading") {
    return (
      <div className="panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-mint-500 border-t-transparent" />
          <p className="text-sm font-semibold text-ink-600">Checking public references for “{term}”…</p>
        </div>
        <div className="mt-5 space-y-3">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
        <p className="mt-4 text-xs leading-5 text-ink-400">
          This sends only the search term to RxNorm, openFDA and Wikipedia. Do not enter names, contact details, or other identifying health information. Public-source text is background, not medical advice.
        </p>
      </div>
    );
  }

  if (state === "error" || !result?.found) {
    return (
      <div className="panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink-900">No reliable public-source match found</h3>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          We could not retrieve a useful match for “{term}”. We will not invent medical information, a procedure quote, or an Indian alternative. Send the topic to our team for a manual source check.
        </p>
        <Link href={`/${locale}/contact/`} className="btn-primary mt-4">Request a manual price check</Link>
      </div>
    );
  }

  const hasPrice = result.price.indiaPrice !== null && result.price.usEuPrice !== null && result.price.usEuPrice > 0;
  const priceDifference = hasPrice
    ? ((result.price.usEuPrice! - result.price.indiaPrice!) / result.price.usEuPrice!) * 100
    : null;
  const displayedDifference = priceDifference === null
    ? null
    : priceDifference >= 0
      ? Math.min(99.9, Math.floor(priceDifference * 10) / 10)
      : Math.abs(Math.round(priceDifference * 10) / 10);

  return (
    <div className="space-y-5">
      <div className="panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-royal-500/10 px-2.5 py-1 text-[11px] font-bold text-royal-600">Live public-source lookup</span>
          <span className="text-xs text-ink-400">Background only · not a clinical recommendation</span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-ink-900">{result.title}</h3>
        {result.genericSalt ? <p className="mt-2 text-sm text-ink-600"><span className="font-semibold text-ink-900">Possible generic name:</span> {result.genericSalt}</p> : null}
        {result.brandNames.length > 0 ? <p className="mt-2 text-sm text-ink-600"><span className="font-semibold text-ink-900">Names returned by RxNorm/openFDA:</span> {result.brandNames.join(", ")}</p> : null}
        {result.summary ? (
          <div className="mt-4 rounded-2xl bg-ink-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Public-source background</p>
            <p className="mt-2 text-[15px] leading-7 text-ink-600">{result.summary}</p>
            <p className="mt-2 text-[11px] leading-5 text-ink-400">This third-party summary has not been clinically reviewed by Jivan. Check the cited source and consult a qualified clinician.</p>
          </div>
        ) : null}
        {result.doseForms.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.doseForms.map((form) => <span key={form} className="rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600">{form}</span>)}
          </div>
        ) : null}
      </div>

      <div className="panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink-900">India alternative and price match</h3>
        {hasPrice ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Catalog comparison price</p>
                <p className="mt-1 text-xl font-bold text-ink-400 line-through">{formatUsd(result.price.usEuPrice!, locale)}</p>
              </div>
              <div className="rounded-2xl border border-mint-500/30 bg-mint-500/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-600">India catalog price</p>
                <p className="mt-1 text-xl font-bold text-mint-600">{formatUsd(result.price.indiaPrice!, locale)}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Reference difference</p>
                <p className="mt-1 text-xl font-bold">{displayedDifference}% {priceDifference! >= 0 ? "lower" : "higher"}</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-ink-50 p-3 text-xs leading-6 text-ink-600">{result.price.basis}</p>
          </>
        ) : (
          <div className="mt-3 rounded-xl bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-800">{result.price.basis}</p>
            <Link href={`/${locale}/contact/`} className="btn-primary mt-3">Request a manual price check</Link>
          </div>
        )}

        {result.indianAlternatives.length > 0 ? (
          <div className="mt-5">
            <h4 className="text-sm font-bold uppercase tracking-wide text-ink-400">Catalog matches by ingredient or brand</h4>
            <p className="mt-1 text-xs leading-5 text-ink-500">A catalog match is not a treatment recommendation or proof that products are interchangeable. Check active ingredient, strength, form, and suitability with a clinician or pharmacist.</p>
            <div className="mt-3 space-y-2">
              {result.indianAlternatives.map((alternative) => (
                <Link
                  key={alternative.slug}
                  href={`/${locale}/medicine/${alternative.slug}/`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3 transition hover:border-mint-500/40 hover:bg-mint-500/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">{alternative.name}</span>
                    <span className="block text-xs text-ink-400">{alternative.company} · {alternative.strength} · {alternative.priceStatus === "market_checked" ? "market checked" : "estimated"}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-mint-600">{formatUsd(alternative.indiaPrice, locale)}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {result.isMedicineResult && (result.indications.length || result.sideEffects.length || result.warnings.length) ? (
        <div className="panel rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-ink-900">US FDA label excerpts for a possible medicine match</h3>
          <p className="mt-2 text-xs leading-5 text-ink-500">The FDA label may describe a different product, indication, or jurisdiction. It is not personalized guidance; do not use it to start, stop, or change treatment.</p>
          <div className="mt-4 space-y-5">
            <Section title="Indications on the label" items={result.indications} />
            <Section title="Reported adverse reactions" items={result.sideEffects} />
            <Section title="Warnings and contraindications" items={result.warnings} />
          </div>
        </div>
      ) : null}

      {result.sources.length > 0 ? (
        <div className="panel rounded-3xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Live lookup sources</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.sources.map((source) => (
              <li key={source.label}>
                <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-100">
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
