import { db } from "@/db";
import { medicineLookups, medicines } from "@/db/schema";
import { asc, eq, ilike, or, sql } from "drizzle-orm";

export type LookupPrice = {
  usEuPrice: number | null;
  indiaPrice: number | null;
  basis: string;
  confidence: "referenced" | "derived" | "estimated" | "unavailable";
  anchorName?: string;
};

export type LookupResult = {
  query: string;
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
  price: LookupPrice;
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
  fetchedAt: string;
};

const TIMEOUT_MS = 9000;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 14;

function normalize(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 120);
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "Jivan-Medicine-Access/1.0 (patient education platform)" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function clean(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/^\s*[\d.]+\s+/, "")
    .trim();
}

function splitSentences(text: string, limit: number) {
  return clean(text)
    .split(/(?<=\.)\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 25)
    .slice(0, limit);
}

/* ------------------------- RxNorm (US National Library of Medicine) ------------------------- */

type RxNavResponse = {
  drugGroup?: {
    conceptGroup?: { tty?: string; conceptProperties?: { name?: string; synonym?: string }[] }[];
  };
};

async function fetchRxNorm(name: string) {
  const data = await safeJson<RxNavResponse>(
    `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(name)}`,
  );

  const brandNames = new Set<string>();
  const doseForms = new Set<string>();

  for (const group of data?.drugGroup?.conceptGroup ?? []) {
    for (const concept of group.conceptProperties ?? []) {
      const label = concept.name ?? "";
      const brand = label.match(/\[([^\]]+)\]/)?.[1];
      if (brand) brandNames.add(brand);

      const form = label.match(/(Oral Tablet|Oral Capsule|Injectable Solution|Injection|Oral Solution|Inhalant|Prefilled Syringe|Topical Cream|Eye Drops|Oral Suspension|Extended Release Oral Tablet)/i)?.[1];
      if (form) doseForms.add(form);
    }
  }

  return {
    found: brandNames.size > 0 || doseForms.size > 0,
    brandNames: [...brandNames].slice(0, 8),
    doseForms: [...doseForms].slice(0, 6),
  };
}

/* ------------------------- openFDA drug labels ------------------------- */

type OpenFdaResponse = {
  results?: {
    indications_and_usage?: string[];
    dosage_and_administration?: string[];
    adverse_reactions?: string[];
    warnings_and_cautions?: string[];
    warnings?: string[];
    contraindications?: string[];
    openfda?: { generic_name?: string[]; brand_name?: string[]; route?: string[] };
  }[];
};

async function fetchOpenFda(name: string) {
  const encoded = encodeURIComponent(`"${name}"`);
  const data =
    (await safeJson<OpenFdaResponse>(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encoded}&limit=1`,
    )) ??
    (await safeJson<OpenFdaResponse>(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encoded}&limit=1`,
    ));

  const record = data?.results?.[0];
  if (!record) return null;

  return {
    genericName: record.openfda?.generic_name?.[0] ?? "",
    brandNames: record.openfda?.brand_name?.slice(0, 6) ?? [],
    uses: splitSentences((record.indications_and_usage ?? []).join(" "), 4),
    dosage: splitSentences((record.dosage_and_administration ?? []).join(" "), 4),
    sideEffects: splitSentences((record.adverse_reactions ?? []).join(" "), 4),
    warnings: splitSentences(
      [...(record.warnings_and_cautions ?? []), ...(record.warnings ?? []), ...(record.contraindications ?? [])].join(" "),
      4,
    ),
  };
}

/* ------------------------- Wikipedia summary ------------------------- */

type WikiResponse = {
  title?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

async function fetchWikipedia(name: string) {
  const direct = await safeJson<WikiResponse>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
  );

  if (direct?.extract) {
    return {
      title: direct.title ?? name,
      summary: clean(direct.extract),
      url: direct.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
    };
  }

  const search = await safeJson<{ query?: { search?: { title: string }[] } }>(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=1&srsearch=${encodeURIComponent(
      `${name} medication`,
    )}`,
  );

  const title = search?.query?.search?.[0]?.title;
  if (!title) return null;

  const page = await safeJson<WikiResponse>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  if (!page?.extract) return null;

  return {
    title: page.title ?? title,
    summary: clean(page.extract),
    url: page.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

/* ------------------------- Price resolution ------------------------- */

async function resolvePrice(name: string, brandNames: string[]): Promise<{ price: LookupPrice; alternatives: LookupResult["indianAlternatives"] }> {
  const terms = [name, ...brandNames].filter(Boolean).slice(0, 6);

  const conditions = terms.flatMap((term) => [
    ilike(medicines.genericSalt, `%${term}%`),
    ilike(medicines.brandNames, `%${term}%`),
    ilike(medicines.name, `%${term}%`),
  ]);

  const matches = conditions.length
    ? await db
        .select()
        .from(medicines)
        .where(or(...conditions))
        .orderBy(
          sql`case when ${medicines.priceStatus} = 'market_checked' then 0 else 1 end`,
          asc(medicines.indiaPrice),
        )
        .limit(8)
    : [];

  const referenced = matches.find((row) => row.priceStatus === "market_checked") ?? matches[0];

  const alternatives = matches.slice(0, 6).map((row) => ({
    slug: row.slug,
    name: row.name,
    company: row.company,
    strength: row.strength,
    indiaPrice: row.indiaPrice,
    usEuPrice: row.usEuPrice,
    priceStatus: row.priceStatus,
  }));

  if (referenced) {
    return {
      price: {
        usEuPrice: referenced.usEuPrice,
        indiaPrice: referenced.indiaPrice,
        confidence: referenced.priceStatus === "market_checked" ? "referenced" : "derived",
        anchorName: `${referenced.name} · ${referenced.packSize}`,
        basis:
          referenced.priceStatus === "market_checked"
            ? `Matched to a referenced entry in the Jivan dataset (${referenced.name}, ${referenced.packSize}). Indian figure reflects typical retail market price, not printed MRP.`
            : `Derived from a referenced anchor for the same molecule (${referenced.name}, ${referenced.packSize}).`,
      },
      alternatives,
    };
  }

  return {
    price: {
      usEuPrice: null,
      indiaPrice: null,
      confidence: "unavailable",
      basis:
        "No verified Indian market price is available for this molecule yet. We do not publish invented figures — request a manual price check and our team will source a live quotation.",
    },
    alternatives,
  };
}

/* ------------------------- Orchestrator with DB cache ------------------------- */

async function readCache(key: string): Promise<LookupResult | null> {
  const rows = await db.select().from(medicineLookups).where(eq(medicineLookups.query, key)).limit(1);
  const row = rows[0];
  if (!row) return null;

  if (Date.now() - new Date(row.createdAt).getTime() > CACHE_TTL_MS) return null;

  try {
    return JSON.parse(row.payload) as LookupResult;
  } catch {
    return null;
  }
}

async function writeCache(key: string, payload: LookupResult) {
  await db
    .insert(medicineLookups)
    .values({ query: key, payload: JSON.stringify(payload) })
    .onConflictDoUpdate({
      target: medicineLookups.query,
      set: { payload: JSON.stringify(payload), createdAt: sql`now()` },
    });
}

export async function lookupMedicine(rawQuery: string): Promise<LookupResult> {
  const key = normalize(rawQuery);

  const cached = await readCache(key);
  if (cached) return cached;

  const [rx, fda, wiki] = await Promise.all([fetchRxNorm(key), fetchOpenFda(key), fetchWikipedia(key)]);

  const brandNames = [...new Set([...(rx?.brandNames ?? []), ...(fda?.brandNames ?? [])])].slice(0, 8);
  const { price, alternatives } = await resolvePrice(key, brandNames);

  const found = Boolean(rx?.found || fda || wiki);
  const title = wiki?.title || fda?.genericName || rawQuery;

  const sources: { label: string; url: string }[] = [];
  if (rx?.found) sources.push({ label: "RxNorm · US National Library of Medicine", url: `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(key)}` });
  if (fda) sources.push({ label: "openFDA drug label", url: "https://open.fda.gov/apis/drug/label/" });
  if (wiki) sources.push({ label: "Wikipedia", url: wiki.url });

  const uses = fda?.uses?.length
    ? fda.uses
    : wiki?.summary
      ? splitSentences(wiki.summary, 3)
      : [];

  const result: LookupResult = {
    query: rawQuery,
    found,
    title,
    genericSalt: fda?.genericName || title,
    brandNames,
    doseForms: rx?.doseForms ?? [],
    summary: wiki?.summary ?? "",
    uses,
    dosage: fda?.dosage ?? [],
    pros: [
      "Contains the same active pharmaceutical ingredient as the internationally branded product.",
      "Indian manufacturing scale and supplier competition can reduce the patient price dramatically.",
      "Widely produced in multiple strengths and pack sizes, improving availability and continuity.",
    ],
    cons: [
      "Requires a valid prescription and physician supervision before any change of product or dose.",
      "Import rules, customs limits and prescription requirements differ by country and must be checked.",
      "Batch, manufacturer and expiry details should always be verified on the physical pack.",
    ],
    sideEffects: fda?.sideEffects ?? [],
    warnings: fda?.warnings ?? [],
    price,
    indianAlternatives: alternatives,
    sources,
    fetchedAt: new Date().toISOString(),
  };

  if (found) {
    await writeCache(key, result).catch(() => undefined);
  }

  return result;
}
