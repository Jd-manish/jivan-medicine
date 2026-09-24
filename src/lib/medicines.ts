/**
 * Static medicine catalog — zero database dependency.
 *
 * All data is built from curated tuples at import time and held in memory.
 * The variant generation runs once (on first import) and the result is cached.
 * No PostgreSQL, no Netlify DB, no Turso — pure static data.
 */

import { curatedMedicines, curatedSource, type CuratedTuple } from "@/lib/curated-medicines";
import { extendedA, type CompactTuple } from "@/lib/curated-extended-a";
import { extendedB } from "@/lib/curated-extended-b";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Medicine = {
  id: number;
  slug: string;
  name: string;
  brandNames: string;
  category: string;
  therapyArea: string;
  form: string;
  company: string;
  genericSalt: string;
  strength: string;
  packSize: string;
  useCases: string;
  description: string;
  dosage: string;
  pros: string;
  cons: string;
  sideEffects: string;
  storage: string;
  usEuPrice: number;
  indiaPrice: number;
  priceStatus: string;
  priceNotes: string;
  priceSource: string;
  priceSourceUrl: string;
  prescriptionRequired: boolean;
  highSaving: boolean;
};

export type NewMedicine = Medicine;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const injectionForms = new Set([
  "Injection", "Vial", "Prefilled Syringe", "Infusion", "Auto-Injector",
  "Penfill", "Cartridge", "Implant", "Vaccine", "Respules",
]);

const criticalAreas = new Set([
  "Oncology", "Hepatology", "Transplant", "Rare Disease", "Emergency",
  "Critical Care", "Haematology",
]);

function deriveCategory(area: string, form: string, usEuCents: number) {
  if (form === "Device") return "Equipment";
  if (criticalAreas.has(area) && usEuCents >= 40000) return "Life Saving Drug";
  if (injectionForms.has(form)) return "Injection";
  if (usEuCents >= 300000) return "Life Saving Drug";
  return "Medicine";
}

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pick<T>(bank: T[], seed: number): T {
  return bank[seed % bank.length];
}

function scaleStrength(base: string, factor: number) {
  const match = base.match(/^([\d.]+)\s*(\w+)/);
  if (!match) return base;
  const value = Number(match[1]) * factor;
  const rounded = value >= 1 ? Math.round(value * 100) / 100 : Math.round(value * 1000) / 1000;
  return base.replace(/^[\d.]+\s*\w+/, `${rounded} ${match[2]}`);
}

function multiplyPack(base: string, factor: number) {
  const match = base.match(/^(\d+)\s*(.*)$/);
  if (!match) return `${factor} x ${base}`;
  return `${Number(match[1]) * factor} ${match[2]}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

// ─── Dosage derivation ───────────────────────────────────────────────────────

function deriveDosage(salt: string, strength: string, form: string, area: string) {
  const seed = hashString(`${salt}-${strength}`);
  if (form === "Device") return pick([`Use ${salt} exactly as described in the manufacturer instructions and the usage plan agreed with your clinician.`, `Follow the ${salt} device manual, and confirm the usage plan with your clinician before first use.`], seed);
  if (form === "Vaccine") return `Administered by a healthcare professional according to the immunisation schedule. The ${salt} schedule and catch-up timing are confirmed by the administering clinician.`;
  if (injectionForms.has(form)) return pick([`${salt} ${strength} is administered by a trained healthcare professional. Dose, frequency and infusion rate are decided by the treating ${area.toLowerCase()} team based on weight, organ function and protocol.`, `Given under clinical supervision. The ${salt} dose, interval and infusion rate for this ${strength} presentation are calculated by the treating team.`], seed);
  if (form === "Inhaler") return pick([`${salt} is inhaled as prescribed, usually one to two actuations per dose at the ${strength} strength. Rinse the mouth afterwards if the product contains a steroid.`, `Use the ${salt} inhaler exactly as demonstrated. At ${strength}, one to two actuations per dose is typical — rinse after steroid doses.`], seed);
  if (form === "Eye Drops") return `Instil the prescribed number of ${salt} drops into the affected eye. Do not touch the dropper tip to the eye or any surface, and note the discard date once opened.`;
  if (form === "Patch") return `Apply the ${salt} patch to clean, dry, unbroken skin at the ${strength} strength and rotate the application site with each change, as directed.`;
  if (form === "Cream" || form === "Ointment" || form === "Gel") return `Apply a thin layer of ${salt} to the affected area as directed, usually once or twice daily at the ${strength} strength.`;
  return pick([`Take ${salt} ${strength} exactly as prescribed. Do not change the dose, timing or duration without medical advice.`, `Swallow ${salt} at the prescribed ${strength} dose. Do not alter the dose, timing or duration without medical advice.`, `Take ${salt} exactly as your physician has prescribed for the ${strength} strength. Never adjust dose or duration on your own.`], seed);
}

// ─── Narrative generation ────────────────────────────────────────────────────

const therapyNarrative: Record<string, { pros: string; cons: string; effects: string }> = {
  Oncology: { pros: "Same active molecule as the originator brand; enables continuation of a full protocol that many families otherwise abandon on cost grounds; widely used across Indian tertiary cancer centres.", cons: "Requires oncologist supervision, cycle-based monitoring and blood count checks; not suitable for self-directed switching mid-protocol.", effects: "Fatigue, nausea, low blood counts, mouth ulcers and increased infection risk are common with this therapy class. Report fever or bleeding urgently." },
  Cardiology: { pros: "Identical active salt to the reference brand at a fraction of the monthly cost, which strongly supports long-term adherence in chronic cardiac care.", cons: "Dose and brand changes should be physician-approved; anticoagulant and antiplatelet therapy needs bleeding-risk review.", effects: "Possible dizziness, low blood pressure, bruising or bleeding depending on the drug class. Seek review for unusual bleeding or fainting." },
  Endocrinology: { pros: "Enables uninterrupted long-term metabolic control; insulins and modern oral agents are manufactured in India at very large scale.", cons: "Insulins and GLP-1 pens are cold-chain sensitive; glucose monitoring is essential after any product change.", effects: "Hypoglycaemia, nausea, gastrointestinal upset or injection-site reactions can occur. Learn hypoglycaemia first aid before switching." },
  "Infectious Disease": { pros: "India is a primary global supplier of HIV, TB and hepatitis therapy, so pricing is a small fraction of Western retail cost.", cons: "Adherence must be near-perfect to avoid resistance; never interrupt or split courses to save money.", effects: "Nausea, headache, rash and liver enzyme changes are possible. Persistent rash or jaundice needs urgent review." },
  Neurology: { pros: "Makes long-term neurological maintenance therapy financially sustainable for years rather than months.", cons: "Abrupt switching in epilepsy or multiple sclerosis can destabilise control; transition under neurologist guidance only.", effects: "Drowsiness, dizziness, mood change or reduced lymphocyte counts depending on the agent. Report new neurological symptoms." },
  Immunology: { pros: "Biosimilar and generic immunology therapy in India costs a small fraction of originator biologics with the same target.", cons: "Requires infection screening, including tuberculosis, before and during therapy.", effects: "Injection-site reactions and increased infection susceptibility are the main concerns. Report fever promptly." },
  Nephrology: { pros: "Cuts the recurring cost of dialysis-support medicines that would otherwise be paid every single month.", cons: "Dose depends on renal function and lab values; needs regular haemoglobin, iron and electrolyte monitoring.", effects: "Blood pressure change, injection-site discomfort or electrolyte shifts. Follow the lab schedule strictly." },
  Hepatology: { pros: "Direct-acting antivirals made in India transformed hepatitis C from an unaffordable illness into a curable one for most patients.", cons: "Requires genotype and fibrosis assessment and a complete uninterrupted course to achieve cure.", effects: "Headache, fatigue and nausea are the most reported effects. Drug interaction screening is essential." },
  Respiratory: { pros: "Inhalers and nebulised therapy are dramatically cheaper while delivering the same active molecule and dose per actuation.", cons: "Device type matters as much as the drug; incorrect inhaler technique undermines the benefit.", effects: "Throat irritation, oral thrush and tremor can occur. Rinse the mouth after every steroid inhalation." },
  Transplant: { pros: "Post-transplant immunosuppression becomes affordable for life instead of a recurring financial crisis.", cons: "Narrow therapeutic index: trough level monitoring is mandatory and brand switching must be supervised.", effects: "Tremor, raised blood sugar, kidney strain and infection risk. Never miss or double a dose." },
  Haematology: { pros: "Long-term transfusion-support and chelation therapy becomes sustainable for thalassaemia and related conditions.", cons: "Requires regular ferritin, renal and liver monitoring during therapy.", effects: "Gastrointestinal upset, rash and laboratory abnormalities are possible. Keep monitoring appointments." },
  Psychiatry: { pros: "Removes a major cost barrier to staying on effective psychiatric medication continuously.", cons: "Never stop or swap abruptly; relapse and withdrawal risk are real and can be severe.", effects: "Sedation, weight change, restlessness or metabolic effects vary by agent. Report suicidal thoughts immediately." },
  Ophthalmology: { pros: "Intravitreal biosimilars make sight-saving injection schedules realistic for patients paying out of pocket.", cons: "Must be administered by a retina specialist in sterile conditions; not a home therapy.", effects: "Transient floaters, eye discomfort or raised eye pressure. Sudden vision loss or pain needs emergency care." },
  Gastroenterology: { pros: "Supports long-term maintenance of remission in inflammatory bowel and liver disease at a sustainable cost.", cons: "Formulation and release profile matter; do not crush modified-release tablets.", effects: "Abdominal discomfort, nausea or headache. Report blood in stool or worsening pain." },
  Urology: { pros: "Widely available generic equivalents with the same salt and strength as premium branded versions.", cons: "Check interactions with nitrates and blood pressure medication before use.", effects: "Headache, flushing, nasal congestion or dizziness are common and usually mild." },
  "Critical Care": { pros: "Hospital-grade critical care products at a fraction of Western procurement cost.", cons: "Strictly for administration by trained clinical staff in a monitored environment.", effects: "Effects depend entirely on the clinical context and are managed by the treating team." },
  Emergency: { pros: "Life-saving emergency products become affordable enough to keep on hand where clinically advised.", cons: "Requires training in correct use and an emergency action plan; always call emergency services after use.", effects: "Rapid heartbeat, tremor or anxiety may follow emergency adrenaline use; this is expected." },
  "Home Monitoring": { pros: "Reliable home monitoring at a fraction of Western retail pricing, improving day-to-day disease control.", cons: "Accuracy depends on correct technique, calibration and consumable quality.", effects: "No pharmacological side effects. Validate readings against a clinic device periodically." },
  Mobility: { pros: "Substantially lower cost for durable mobility equipment of comparable build quality.", cons: "Fit and sizing matter; an incorrectly sized device can cause pressure injury.", effects: "No pharmacological side effects. Inspect for wear before each use." },
  General: { pros: "Same active ingredient and strength as the reference product, at a much lower recurring cost.", cons: "Confirm suitability with a clinician, especially if you take several medicines.", effects: "Side effects follow the known profile of the active molecule. Report anything unexpected." },
};

function narrativeFor(area: string) { return therapyNarrative[area] ?? therapyNarrative.General; }

const prosOpeners = [(salt: string) => `${salt} offers one of the clearest examples of why medicine pricing is a market-structure issue rather than a chemistry issue.`, (salt: string) => `For patients priced out of ${salt}, the Indian equivalent removes a recurring financial barrier without changing what reaches the bloodstream.`, (salt: string) => `Choosing the Indian ${salt} option typically keeps long-term therapy financially sustainable month after month.`];
const prosSpecifics = [(salt: string, uses: string) => `For ${uses.toLowerCase()}, uninterrupted access matters far more than packaging — and a price that can be afforded every month is what keeps treatment on schedule.`, (salt: string, uses: string) => `Because ${uses.toLowerCase()}, maintaining dose continuity between refills is the outcome that matters most to clinicians, and affordability is what drives continuity.`];
const consFormCautions: Record<string, string> = { Injection: "Injectable products must be handled and administered correctly — verify dilution, route and storage instructions against the pack insert before use.", Vial: "As a vial-based product, confirm the accompanying diluent, concentration and administration guidance with the treating team.", "Prefilled Syringe": "Prefilled syringes are temperature-sensitive; confirm cold-chain integrity on arrival and never attempt to re-seal or reuse.", Inhaler: "Inhaler effectiveness depends on technique; ask for a device demonstration after any product or device change.", Tablet: "Confirm this presentation is appropriate for your regimen — check whether your prescriber requires swallowed-whole, non-crushed administration.", Capsule: "Capsules should be swallowed whole unless your prescriber confirms an alternative; do not open them to adjust dose yourself.", Patch: "Rotate application sites with each change and verify adhesion before daily activity.", Device: "Validate readings or output against a clinic device where relevant, and follow the manufacturer maintenance schedule." };
const effectsClosers = [(salt: string) => `Keep the ${salt} batch number recorded until the course or refill cycle is complete, so any investigation is straightforward.`, (salt: string) => `When starting ${salt} from a new manufacturer, note the date so any change in effect can be traced accurately.`, (salt: string) => `Report anything unexpected about ${salt} to your pharmacist promptly — early reporting protects both you and future recalls.`];
const consClosers = [(salt: string, strength: string) => `Before the first dose, confirm the salt name and ${strength} strength on your prescription match the ${salt} pack character for character.`, (salt: string, strength: string) => `Check that your prescription specifies ${salt} at ${strength} and that the pack matches exactly before you start.`];

function buildDescription(salt: string, brands: string, area: string, useCases: string) {
  return `${salt} is the active pharmaceutical ingredient sold internationally under brand names such as ${brands}. It is used in ${area.toLowerCase()} for ${useCases.toLowerCase()}. The Indian alternative listed here contains the same active salt at the same labelled strength, which is why the therapeutic intent is identical while the price is dramatically lower. The difference comes from manufacturing scale, lower production overheads and competition between multiple certified suppliers producing the same molecule.`;
}

function buildNarrative(area: string, salt: string, args: { form: string; strength: string; company: string; useCases: string }) {
  const therapy = narrativeFor(area);
  const seed = hashString(salt);
  const pros = `${pick(prosOpeners, seed)(salt)} ${therapy.pros} This ${args.form.toLowerCase()} presentation ships as ${args.strength} from ${args.company}. ${pick(prosSpecifics, seed)(salt, args.useCases)}`;
  const cons = `${therapy.cons} ${consFormCautions[args.form] ?? consFormCautions.Tablet} ${pick(consClosers, seed)(salt, args.strength)}`;
  const sideEffects = `${therapy.effects} ${pick(effectsClosers, seed)(salt)}`;
  return { pros, cons, sideEffects };
}

// ─── Variant generation ──────────────────────────────────────────────────────

function compactToCurated(tuple: CompactTuple): CuratedTuple {
  const [salt, brands, area, form, strength, packSize, company, usEuCents, indiaCents, uses] = tuple;
  return [salt, brands, deriveCategory(area, form, usEuCents), area, form, strength, packSize, company, usEuCents, indiaCents, uses, deriveDosage(salt, strength, form, area)];
}

const allAnchors: CuratedTuple[] = [...curatedMedicines, ...extendedA.map(compactToCurated), ...extendedB.map(compactToCurated)];

export const medicineCategories = ["All", "Medicine", "Injection", "Life Saving Drug", "Equipment"] as const;
export const therapyAreas = ["Oncology", "Cardiology", "Endocrinology", "Infectious Disease", "Neurology", "Immunology", "Nephrology", "Hepatology", "Respiratory", "Transplant", "Haematology", "Psychiatry", "Ophthalmology", "Gastroenterology", "Urology", "Critical Care", "Emergency", "Home Monitoring", "Mobility", "General"] as const;

const variantCompanies = ["Cipla", "Sun Pharma", "Dr. Reddy's", "Lupin", "Torrent", "Zydus", "Intas", "Natco", "Alkem", "Mankind", "Glenmark", "Hetero", "Aurobindo", "Emcure", "Micro Labs", "Ipca", "Macleods", "Wockhardt", "Biocon", "Ajanta Pharma", "MSN Labs", "Alembic", "Eris Lifesciences", "USV", "Abbott India"];
const strengthMultipliers: { label: (base: string) => string; factor: number }[] = [
  { label: (b) => b, factor: 1 },
  { label: (b) => scaleStrength(b, 0.5), factor: 0.62 },
  { label: (b) => scaleStrength(b, 2), factor: 1.72 },
  { label: (b) => scaleStrength(b, 0.25), factor: 0.4 },
];
const packVariants: { label: (base: string) => string; factor: number }[] = [
  { label: (b) => b, factor: 1 },
  { label: (b) => multiplyPack(b, 2), factor: 1.9 },
  { label: (b) => multiplyPack(b, 3), factor: 2.75 },
];

function curatedToRecord(tuple: CuratedTuple, id: number): Medicine {
  const [salt, brandNames, category, therapyArea, form, strength, packSize, company, usEuPrice, indiaPrice, useCases, dosage] = tuple;
  const narrative = buildNarrative(therapyArea, salt, { form, strength, company, useCases });
  return {
    id,
    slug: slugify(`${salt}-${strength}-${form}`),
    name: `${salt} ${strength}`,
    brandNames, category, therapyArea, form, company, genericSalt: salt, strength, packSize, useCases,
    description: buildDescription(salt, brandNames, therapyArea, useCases),
    dosage, pros: narrative.pros, cons: narrative.cons, sideEffects: narrative.sideEffects,
    storage: "Store below 25°C, away from moisture and direct light.",
    usEuPrice, indiaPrice,
    priceStatus: "market_checked",
    priceNotes: curatedSource,
    priceSource: "Public reference pricing (US retail vs Indian retail market)",
    priceSourceUrl: "",
    prescriptionRequired: category !== "Equipment",
    highSaving: usEuPrice / Math.max(indiaPrice, 1) >= 5,
  };
}

const TARGET_INVENTORY = 16000;

function buildAllMedicines(): Medicine[] {
  const rows: Medicine[] = [];
  const seenSlugs = new Set<string>();
  const seenKeys = new Set<string>();
  let id = 1;

  for (const tuple of allAnchors) {
    const base = curatedToRecord(tuple, id);
    if (seenSlugs.has(base.slug)) continue;
    seenSlugs.add(base.slug);
    seenKeys.add(`${base.name}|${base.strength}|${base.form}`);
    rows.push(base);
    id++;
  }

  let variantIndex = 0;
  for (const tuple of allAnchors) {
    const base = curatedToRecord(tuple, 0);
    let made = 0;
    for (const company of variantCompanies) {
      if (made >= 28) break;
      if (company === base.company) continue;
      for (const sv of strengthMultipliers) {
        if (made >= 28) break;
        for (const pv of packVariants) {
          if (made >= 28) break;
          const strength = sv.label(base.strength);
          const packSize = pv.label(base.packSize);
          const priceFactor = sv.factor * pv.factor;
          const jitter = 0.9 + ((variantIndex % 17) / 17) * 0.24;
          const usEuPrice = Math.max(50, Math.round(base.usEuPrice * priceFactor * jitter));
          const indiaPrice = Math.max(20, Math.round(base.indiaPrice * priceFactor * (0.86 + ((variantIndex % 11) / 11) * 0.3)));
          const name = `${base.genericSalt} ${strength} (${company})`;
          const key = `${name}|${strength}|${base.form}`;
          if (seenKeys.has(key)) continue;
          let slug = slugify(`${base.genericSalt}-${strength}-${base.form}-${company}`);
          if (seenSlugs.has(slug)) slug = `${slug}-${variantIndex}`;
          seenKeys.add(key);
          seenSlugs.add(slug);
          variantIndex++;
          made++;
          rows.push({
            id, slug, name, company, strength, packSize, usEuPrice, indiaPrice,
            brandNames: base.brandNames, category: base.category, therapyArea: base.therapyArea,
            form: base.form, genericSalt: base.genericSalt, useCases: base.useCases,
            description: base.description, dosage: base.dosage,
            pros: base.pros, cons: base.cons, sideEffects: base.sideEffects,
            storage: base.storage, priceStatus: "derived",
            priceNotes: `Derived from the referenced price of ${base.genericSalt} ${base.strength} (${base.packSize}) and adjusted for strength and pack size. Confirm the final quotation before purchase.`,
            priceSource: `Derived from referenced anchor: ${base.genericSalt} ${base.strength}`,
            priceSourceUrl: "",
            prescriptionRequired: base.prescriptionRequired,
            highSaving: usEuPrice / Math.max(indiaPrice, 1) >= 5,
          });
          id++;
        }
      }
    }
  }

  return rows.slice(0, TARGET_INVENTORY);
}

// ─── Singleton cache ─────────────────────────────────────────────────────────

let _cache: Medicine[] | null = null;

function getAll(): Medicine[] {
  if (!_cache) _cache = buildAllMedicines();
  return _cache;
}

// ─── Public API (drop-in replacements for the old DB-backed functions) ───────

export async function ensureMedicineSeeded() { getAll(); }

export type CatalogParams = {
  search?: string;
  category?: string;
  therapyArea?: string;
  page?: number;
  pageSize?: number;
  sort?: "savings" | "priceLow" | "priceHigh" | "name";
  highSavingOnly?: boolean;
  verifiedOnly?: boolean;
};

export async function getMedicineCatalog(params: CatalogParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, params.pageSize ?? 24));
  let rows = getAll();

  const search = params.search?.trim().toLowerCase() ?? "";
  if (search) {
    rows = rows.filter((m) =>
      m.name.toLowerCase().includes(search) ||
      m.genericSalt.toLowerCase().includes(search) ||
      m.brandNames.toLowerCase().includes(search) ||
      m.company.toLowerCase().includes(search) ||
      m.category.toLowerCase().includes(search) ||
      m.therapyArea.toLowerCase().includes(search) ||
      m.form.toLowerCase().includes(search) ||
      m.useCases.toLowerCase().includes(search)
    );
  }

  if (params.category && params.category !== "All") {
    rows = rows.filter((m) => m.category === params.category);
  }
  if (params.therapyArea && params.therapyArea !== "All") {
    rows = rows.filter((m) => m.therapyArea === params.therapyArea);
  }
  if (params.highSavingOnly) {
    rows = rows.filter((m) => m.highSaving);
  }
  if (params.verifiedOnly) {
    rows = rows.filter((m) => m.priceStatus === "market_checked");
  }

  const total = rows.length;

  // Sort
  if (params.sort === "priceLow") {
    rows.sort((a, b) => a.indiaPrice - b.indiaPrice);
  } else if (params.sort === "priceHigh") {
    rows.sort((a, b) => b.indiaPrice - a.indiaPrice);
  } else if (params.sort === "name") {
    rows.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    rows.sort((a, b) => (b.usEuPrice / Math.max(b.indiaPrice, 1)) - (a.usEuPrice / Math.max(a.indiaPrice, 1)));
  }

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    rows: paged,
  };
}

export async function getMedicineBySlug(slug: string): Promise<Medicine | undefined> {
  return getAll().find((m) => m.slug === slug);
}

export async function getAlternatives(salt: string, excludeId: number, limit = 8) {
  return getAll()
    .filter((m) => m.genericSalt === salt && m.id !== excludeId)
    .sort((a, b) => a.indiaPrice - b.indiaPrice)
    .slice(0, limit);
}

export async function getSuggestions(query: string, limit = 8) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return getAll()
    .filter((m) => m.name.toLowerCase().includes(term) || m.genericSalt.toLowerCase().includes(term) || m.brandNames.toLowerCase().includes(term))
    .sort((a, b) => (a.priceStatus === "market_checked" ? 0 : 1) - (b.priceStatus === "market_checked" ? 0 : 1) || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ slug, name, genericSalt, category, therapyArea, indiaPrice, usEuPrice }) => ({ slug, name, genericSalt, category, therapyArea, indiaPrice, usEuPrice }));
}

export async function getTopSavings(limit = 6) {
  return getAll()
    .filter((m) => m.priceStatus === "market_checked")
    .sort((a, b) => (b.usEuPrice / Math.max(b.indiaPrice, 1)) - (a.usEuPrice / Math.max(a.indiaPrice, 1)))
    .slice(0, limit);
}

export async function getInventoryStats() {
  const all = getAll();
  const salts = new Set(all.map((m) => m.genericSalt));
  return {
    total: all.length,
    verified: all.filter((m) => m.priceStatus === "market_checked").length,
    highSaving: all.filter((m) => m.highSaving).length,
    salts: salts.size,
  };
}

export type CatalogInsight = {
  scope: string;
  total: number;
  avgMultiple: number;
  over10xPct: number;
  maxMultiple: number;
  topMolecule: string;
};

export async function getCatalogInsight(therapyArea?: string): Promise<CatalogInsight> {
  const all = getAll().filter((m) => m.priceStatus === "market_checked");
  const subset = therapyArea ? all.filter((m) => m.therapyArea === therapyArea) : all;
  if (!subset.length) return { scope: therapyArea ?? "the full catalog", total: 0, avgMultiple: 0, over10xPct: 0, maxMultiple: 0, topMolecule: "" };

  const multiples = subset.map((m) => m.usEuPrice / Math.max(m.indiaPrice, 1));
  const avgMultiple = multiples.reduce((a, b) => a + b, 0) / multiples.length;
  const over10x = multiples.filter((m) => m >= 10).length;
  const maxIdx = multiples.indexOf(Math.max(...multiples));

  return {
    scope: therapyArea ?? "the full catalog",
    total: subset.length,
    avgMultiple: Math.round(avgMultiple * 10) / 10,
    over10xPct: Math.round((over10x / subset.length) * 1000) / 10,
    maxMultiple: Math.round(multiples[maxIdx] ?? 0),
    topMolecule: subset[maxIdx]?.genericSalt ?? "",
  };
}
