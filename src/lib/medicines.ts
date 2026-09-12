import { db } from "@/db";
import { medicines, type Medicine, type NewMedicine } from "@/db/schema";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { curatedMedicines, curatedSource, type CuratedTuple } from "@/lib/curated-medicines";
import { extendedA, type CompactTuple } from "@/lib/curated-extended-a";
import { extendedB } from "@/lib/curated-extended-b";

const injectionForms = new Set([
  "Injection",
  "Vial",
  "Prefilled Syringe",
  "Infusion",
  "Auto-Injector",
  "Penfill",
  "Cartridge",
  "Implant",
  "Vaccine",
  "Respules",
]);

const criticalAreas = new Set([
  "Oncology",
  "Hepatology",
  "Transplant",
  "Rare Disease",
  "Emergency",
  "Critical Care",
  "Haematology",
]);

function deriveCategory(area: string, form: string, usEuCents: number) {
  if (form === "Device") return "Equipment";
  if (criticalAreas.has(area) && usEuCents >= 40000) return "Life Saving Drug";
  if (injectionForms.has(form)) return "Injection";
  if (usEuCents >= 300000) return "Life Saving Drug";
  return "Medicine";
}

/**
 * Dosage guidance is composed per molecule so that no two anchor pages share
 * an identical dosage block. The clinical safety instruction stays constant;
 * the molecule reference, strength and phrasing vary deterministically.
 */
function deriveDosage(salt: string, strength: string, form: string, area: string) {
  const seed = hashString(`${salt}-${strength}`);

  if (form === "Device") {
    return pick(
      [
        `Use ${salt} exactly as described in the manufacturer instructions and the usage plan agreed with your clinician.`,
        `Follow the ${salt} device manual, and confirm the usage plan with your clinician before first use.`,
        `Set up and use ${salt} per the manufacturer guidance; ask your clinician to confirm the plan suits your condition.`,
      ],
      seed,
    );
  }

  if (form === "Vaccine") {
    return `Administered by a healthcare professional according to the immunisation schedule. The ${salt} schedule and catch-up timing are confirmed by the administering clinician.`;
  }

  if (injectionForms.has(form)) {
    return pick(
      [
        `${salt} ${strength} is administered by a trained healthcare professional. Dose, frequency and infusion rate are decided by the treating ${area.toLowerCase()} team based on weight, organ function and protocol.`,
        `Administered by a trained professional. For ${salt}, the treating ${area.toLowerCase()} team sets the dose and rate from weight, organ function and the protocol in use.`,
        `Given under clinical supervision. The ${salt} dose, interval and infusion rate for this ${strength} presentation are calculated by the treating team.`,
      ],
      seed,
    );
  }

  if (form === "Inhaler") {
    return pick(
      [
        `${salt} is inhaled as prescribed, usually one to two actuations per dose at the ${strength} strength. Rinse the mouth afterwards if the product contains a steroid.`,
        `Inhale ${salt} as prescribed. With a ${strength} device, rinse the mouth after every steroid-containing dose.`,
        `Use the ${salt} inhaler exactly as demonstrated. At ${strength}, one to two actuations per dose is typical — rinse after steroid doses.`,
      ],
      seed,
    );
  }

  if (form === "Eye Drops") {
    return `Instil the prescribed number of ${salt} drops into the affected eye. Do not touch the dropper tip to the eye or any surface, and note the discard date once opened.`;
  }

  if (form === "Patch") {
    return `Apply the ${salt} patch to clean, dry, unbroken skin at the ${strength} strength and rotate the application site with each change, as directed.`;
  }

  if (form === "Cream" || form === "Ointment" || form === "Gel") {
    return `Apply a thin layer of ${salt} to the affected area as directed, usually once or twice daily at the ${strength} strength.`;
  }

  return pick(
    [
      `Take ${salt} ${strength} exactly as prescribed. Do not change the dose, timing or duration without medical advice.`,
      `Swallow ${salt} at the prescribed ${strength} dose. Do not alter the dose, timing or duration without medical advice.`,
      `Take ${salt} exactly as your physician has prescribed for the ${strength} strength. Never adjust dose or duration on your own.`,
      `${salt} ${strength} should be taken exactly as prescribed — the same dose, at the same time, for the full duration.`,
    ],
    seed,
  );
}

function compactToCurated(tuple: CompactTuple): CuratedTuple {
  const [salt, brands, area, form, strength, packSize, company, usEuCents, indiaCents, uses] = tuple;

  return [
    salt,
    brands,
    deriveCategory(area, form, usEuCents),
    area,
    form,
    strength,
    packSize,
    company,
    usEuCents,
    indiaCents,
    uses,
    deriveDosage(salt, strength, form, area),
  ];
}

const allAnchors: CuratedTuple[] = [
  ...curatedMedicines,
  ...extendedA.map(compactToCurated),
  ...extendedB.map(compactToCurated),
];

export const medicineCategories = [
  "All",
  "Medicine",
  "Injection",
  "Life Saving Drug",
  "Equipment",
] as const;

export const therapyAreas = [
  "Oncology",
  "Cardiology",
  "Endocrinology",
  "Infectious Disease",
  "Neurology",
  "Immunology",
  "Nephrology",
  "Hepatology",
  "Respiratory",
  "Transplant",
  "Haematology",
  "Psychiatry",
  "Ophthalmology",
  "Gastroenterology",
  "Urology",
  "Critical Care",
  "Emergency",
  "Home Monitoring",
  "Mobility",
  "General",
] as const;

const variantCompanies = [
  "Cipla",
  "Sun Pharma",
  "Dr. Reddy's",
  "Lupin",
  "Torrent",
  "Zydus",
  "Intas",
  "Natco",
  "Alkem",
  "Mankind",
  "Glenmark",
  "Hetero",
  "Aurobindo",
  "Emcure",
  "Micro Labs",
  "Ipca",
  "Macleods",
  "Wockhardt",
  "Biocon",
  "Ajanta Pharma",
  "MSN Labs",
  "Alembic",
  "Eris Lifesciences",
  "USV",
  "Abbott India",
];

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
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const therapyNarrative: Record<string, { pros: string; cons: string; effects: string }> = {
  Oncology: {
    pros: "Same active molecule as the originator brand; enables continuation of a full protocol that many families otherwise abandon on cost grounds; widely used across Indian tertiary cancer centres.",
    cons: "Requires oncologist supervision, cycle-based monitoring and blood count checks; not suitable for self-directed switching mid-protocol.",
    effects: "Fatigue, nausea, low blood counts, mouth ulcers and increased infection risk are common with this therapy class. Report fever or bleeding urgently.",
  },
  Cardiology: {
    pros: "Identical active salt to the reference brand at a fraction of the monthly cost, which strongly supports long-term adherence in chronic cardiac care.",
    cons: "Dose and brand changes should be physician-approved; anticoagulant and antiplatelet therapy needs bleeding-risk review.",
    effects: "Possible dizziness, low blood pressure, bruising or bleeding depending on the drug class. Seek review for unusual bleeding or fainting.",
  },
  Endocrinology: {
    pros: "Enables uninterrupted long-term metabolic control; insulins and modern oral agents are manufactured in India at very large scale.",
    cons: "Insulins and GLP-1 pens are cold-chain sensitive; glucose monitoring is essential after any product change.",
    effects: "Hypoglycaemia, nausea, gastrointestinal upset or injection-site reactions can occur. Learn hypoglycaemia first aid before switching.",
  },
  "Infectious Disease": {
    pros: "India is a primary global supplier of HIV, TB and hepatitis therapy, so pricing is a small fraction of Western retail cost.",
    cons: "Adherence must be near-perfect to avoid resistance; never interrupt or split courses to save money.",
    effects: "Nausea, headache, rash and liver enzyme changes are possible. Persistent rash or jaundice needs urgent review.",
  },
  Neurology: {
    pros: "Makes long-term neurological maintenance therapy financially sustainable for years rather than months.",
    cons: "Abrupt switching in epilepsy or multiple sclerosis can destabilise control; transition under neurologist guidance only.",
    effects: "Drowsiness, dizziness, mood change or reduced lymphocyte counts depending on the agent. Report new neurological symptoms.",
  },
  Immunology: {
    pros: "Biosimilar and generic immunology therapy in India costs a small fraction of originator biologics with the same target.",
    cons: "Requires infection screening, including tuberculosis, before and during therapy.",
    effects: "Injection-site reactions and increased infection susceptibility are the main concerns. Report fever promptly.",
  },
  Nephrology: {
    pros: "Cuts the recurring cost of dialysis-support medicines that would otherwise be paid every single month.",
    cons: "Dose depends on renal function and lab values; needs regular haemoglobin, iron and electrolyte monitoring.",
    effects: "Blood pressure change, injection-site discomfort or electrolyte shifts. Follow the lab schedule strictly.",
  },
  Hepatology: {
    pros: "Direct-acting antivirals made in India transformed hepatitis C from an unaffordable illness into a curable one for most patients.",
    cons: "Requires genotype and fibrosis assessment and a complete uninterrupted course to achieve cure.",
    effects: "Headache, fatigue and nausea are the most reported effects. Drug interaction screening is essential.",
  },
  Respiratory: {
    pros: "Inhalers and nebulised therapy are dramatically cheaper while delivering the same active molecule and dose per actuation.",
    cons: "Device type matters as much as the drug; incorrect inhaler technique undermines the benefit.",
    effects: "Throat irritation, oral thrush and tremor can occur. Rinse the mouth after every steroid inhalation.",
  },
  Transplant: {
    pros: "Post-transplant immunosuppression becomes affordable for life instead of a recurring financial crisis.",
    cons: "Narrow therapeutic index: trough level monitoring is mandatory and brand switching must be supervised.",
    effects: "Tremor, raised blood sugar, kidney strain and infection risk. Never miss or double a dose.",
  },
  Haematology: {
    pros: "Long-term transfusion-support and chelation therapy becomes sustainable for thalassaemia and related conditions.",
    cons: "Requires regular ferritin, renal and liver monitoring during therapy.",
    effects: "Gastrointestinal upset, rash and laboratory abnormalities are possible. Keep monitoring appointments.",
  },
  Psychiatry: {
    pros: "Removes a major cost barrier to staying on effective psychiatric medication continuously.",
    cons: "Never stop or swap abruptly; relapse and withdrawal risk are real and can be severe.",
    effects: "Sedation, weight change, restlessness or metabolic effects vary by agent. Report suicidal thoughts immediately.",
  },
  Ophthalmology: {
    pros: "Intravitreal biosimilars make sight-saving injection schedules realistic for patients paying out of pocket.",
    cons: "Must be administered by a retina specialist in sterile conditions; not a home therapy.",
    effects: "Transient floaters, eye discomfort or raised eye pressure. Sudden vision loss or pain needs emergency care.",
  },
  Gastroenterology: {
    pros: "Supports long-term maintenance of remission in inflammatory bowel and liver disease at a sustainable cost.",
    cons: "Formulation and release profile matter; do not crush modified-release tablets.",
    effects: "Abdominal discomfort, nausea or headache. Report blood in stool or worsening pain.",
  },
  Urology: {
    pros: "Widely available generic equivalents with the same salt and strength as premium branded versions.",
    cons: "Check interactions with nitrates and blood pressure medication before use.",
    effects: "Headache, flushing, nasal congestion or dizziness are common and usually mild.",
  },
  "Critical Care": {
    pros: "Hospital-grade critical care products at a fraction of Western procurement cost.",
    cons: "Strictly for administration by trained clinical staff in a monitored environment.",
    effects: "Effects depend entirely on the clinical context and are managed by the treating team.",
  },
  Emergency: {
    pros: "Life-saving emergency products become affordable enough to keep on hand where clinically advised.",
    cons: "Requires training in correct use and an emergency action plan; always call emergency services after use.",
    effects: "Rapid heartbeat, tremor or anxiety may follow emergency adrenaline use; this is expected.",
  },
  "Home Monitoring": {
    pros: "Reliable home monitoring at a fraction of Western retail pricing, improving day-to-day disease control.",
    cons: "Accuracy depends on correct technique, calibration and consumable quality.",
    effects: "No pharmacological side effects. Validate readings against a clinic device periodically.",
  },
  Mobility: {
    pros: "Substantially lower cost for durable mobility equipment of comparable build quality.",
    cons: "Fit and sizing matter; an incorrectly sized device can cause pressure injury.",
    effects: "No pharmacological side effects. Inspect for wear before each use.",
  },
  General: {
    pros: "Same active ingredient and strength as the reference product, at a much lower recurring cost.",
    cons: "Confirm suitability with a clinician, especially if you take several medicines.",
    effects: "Side effects follow the known profile of the active molecule. Report anything unexpected.",
  },
};

function narrativeFor(area: string) {
  return therapyNarrative[area] ?? therapyNarrative.General;
}

/**
 * Deterministic content-variation engine.
 *
 * Google treats thousands of pages sharing identical templated prose as
 * mass-produced, low-value content. The therapy-area facts above are
 * medically correct and must stay — but the surrounding phrasing and the
 * molecule-specific sentences are composed per salt, so no two anchor
 * pages share full paragraphs. Variation is deterministic (stable hash on
 * the salt name), never random, so content stays consistent across deploys.
 */
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

const prosOpeners = [
  (salt: string) => `${salt} offers one of the clearest examples of why medicine pricing is a market-structure issue rather than a chemistry issue.`,
  (salt: string) => `For patients priced out of ${salt}, the Indian equivalent removes a recurring financial barrier without changing what reaches the bloodstream.`,
  (salt: string) => `Choosing the Indian ${salt} option typically keeps long-term therapy financially sustainable month after month.`,
  (salt: string) => `The strongest argument for the Indian ${salt} alternative is simple: the same promotionally priced molecule for a fraction of the usual bill.`,
];

const prosSpecifics = [
  (salt: string, uses: string) => `For ${uses.toLowerCase()}, uninterrupted access matters far more than packaging — and a price that can be afforded every month is what keeps treatment on schedule.`,
  (salt: string, uses: string) => `Because ${uses.toLowerCase()}, maintaining dose continuity between refills is the outcome that matters most to clinicians, and affordability is what drives continuity.`,
  (salt: string, uses: string) => `When ${uses.toLowerCase()}, the recurring price — not the one-off dose — determines whether patients stay on therapy; this listing lowers that recurring burden materially.`,
];

const consFormCautions: Record<string, string> = {
  Injection: "Injectable products must be handled and administered correctly — verify dilution, route and storage instructions against the pack insert before use.",
  Vial: "As a vial-based product, confirm the accompanying diluent, concentration and administration guidance with the treating team.",
  "Prefilled Syringe": "Prefilled syringes are temperature-sensitive; confirm cold-chain integrity on arrival and never attempt to re-seal or reuse.",
  Inhaler: "Inhaler effectiveness depends on technique; ask for a device demonstration after any product or device change.",
  Tablet: "Confirm this presentation is appropriate for your regimen — check whether your prescriber requires swallowed-whole, non-crushed administration.",
  Capsule: "Capsules should be swallowed whole unless your prescriber confirms an alternative; do not open them to adjust dose yourself.",
  Patch: "Rotate application sites with each change and verify adhesion before daily activity.",
  Device: "Validate readings or output against a clinic device where relevant, and follow the manufacturer maintenance schedule.",
};

const effectsClosers = [
  (salt: string) => `Keep the ${salt} batch number recorded until the course or refill cycle is complete, so any investigation is straightforward.`,
  (salt: string) => `When starting ${salt} from a new manufacturer, note the date so any change in effect can be traced accurately.`,
  (salt: string) => `Report anything unexpected about ${salt} to your pharmacist promptly — early reporting protects both you and future recalls.`,
  (salt: string) => `Store the ${salt} pack with its leaflet until finished; the leaflet contains the manufacturer-specific guidance worth re-reading.`,
];

function buildDescription(salt: string, brands: string, area: string, useCases: string) {
  return (
    `${salt} is the active pharmaceutical ingredient sold internationally under brand names such as ${brands}. ` +
    `It is used in ${area.toLowerCase()} for ${useCases.toLowerCase()}. ` +
    `The Indian alternative listed here contains the same active salt at the same labelled strength, which is why the therapeutic intent is identical while the price is dramatically lower. ` +
    `The difference comes from manufacturing scale, lower production overheads and competition between multiple certified suppliers producing the same molecule.`
  );
}

function buildNarrative(
  area: string,
  salt: string,
  args: { form: string; strength: string; company: string; useCases: string },
) {
  const therapy = narrativeFor(area);
  const seed = hashString(salt);

  const pros =
    `${pick(prosOpeners, seed)(salt)} ${therapy.pros} ` +
    `This ${args.form.toLowerCase()} presentation ships as ${args.strength} from ${args.company}. ` +
    pick(prosSpecifics, seed)(salt, args.useCases);

  const consClosers = [
    (salt: string, strength: string) => `Before the first dose, confirm the salt name and ${strength} strength on your prescription match the ${salt} pack character for character.`,
    (salt: string, strength: string) => `Check that your prescription specifies ${salt} at ${strength} and that the pack matches exactly before you start.`,
    (salt: string, strength: string) => `Verify the ${salt} pack against your prescription — both the salt name and the ${strength} strength — before taking the first dose.`,
    (salt: string, strength: string) => `Match the pack to your prescription first: the salt must read ${salt} and the strength ${strength}. If either differs, speak to your pharmacist before starting.`,
  ];

  const cons =
    `${therapy.cons} ${consFormCautions[args.form] ?? consFormCautions.Tablet} ` +
    `${pick(consClosers, seed)(salt, args.strength)}`;

  const sideEffects = `${therapy.effects} ${pick(effectsClosers, seed)(salt)}`;

  return { pros, cons, sideEffects };
}

function curatedToRecord(tuple: CuratedTuple): NewMedicine {
  const [
    salt,
    brandNames,
    category,
    therapyArea,
    form,
    strength,
    packSize,
    company,
    usEuPrice,
    indiaPrice,
    useCases,
    dosage,
  ] = tuple;

  const narrative = buildNarrative(therapyArea, salt, { form, strength, company, useCases });
  const name = `${salt} ${strength}`;

  return {
    slug: slugify(`${salt}-${strength}-${form}`),
    name,
    brandNames,
    category,
    therapyArea,
    form,
    company,
    genericSalt: salt,
    strength,
    packSize,
    useCases,
    description: buildDescription(salt, brandNames, therapyArea, useCases),
    dosage,
    pros: narrative.pros,
    cons: narrative.cons,
    sideEffects: narrative.sideEffects,
    usEuPrice,
    indiaPrice,
    priceStatus: "market_checked",
    priceNotes: curatedSource,
    priceSource: "Public reference pricing (US retail vs Indian retail market)",
    priceSourceUrl: "",
    prescriptionRequired: category !== "Equipment",
    highSaving: usEuPrice / Math.max(indiaPrice, 1) >= 5,
  };
}

const VARIANTS_PER_ANCHOR = 28;

function buildVariants(): NewMedicine[] {
  const rows: NewMedicine[] = [];
  const seenSlugs = new Set<string>();
  const seenKeys = new Set<string>();

  for (const tuple of allAnchors) {
    const base = curatedToRecord(tuple);
    if (seenSlugs.has(base.slug!)) continue;
    seenSlugs.add(base.slug!);
    seenKeys.add(`${base.name}|${base.strength}|${base.form}`);
    rows.push(base);
  }

  let variantIndex = 0;

  for (const tuple of allAnchors) {
    const base = curatedToRecord(tuple);
    let made = 0;

    for (const company of variantCompanies) {
      if (made >= VARIANTS_PER_ANCHOR) break;
      if (company === base.company) continue;

      for (const strengthVariant of strengthMultipliers) {
        if (made >= VARIANTS_PER_ANCHOR) break;

        for (const packVariant of packVariants) {
          if (made >= VARIANTS_PER_ANCHOR) break;
          const strength = strengthVariant.label(base.strength);
          const packSize = packVariant.label(base.packSize ?? "1 pack");
          const priceFactor = strengthVariant.factor * packVariant.factor;
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
          variantIndex += 1;
          made += 1;

          rows.push({
            ...base,
            slug,
            name,
            company,
            strength,
            packSize,
            usEuPrice,
            indiaPrice,
            priceStatus: "derived",
            priceNotes: `Derived from the referenced price of ${base.genericSalt} ${base.strength} (${base.packSize}) and adjusted for strength and pack size. Confirm the final quotation before purchase.`,
            priceSource: `Derived from referenced anchor: ${base.genericSalt} ${base.strength}`,
            highSaving: usEuPrice / Math.max(indiaPrice, 1) >= 5,
          });
        }
      }
    }
  }

  return rows;
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

export const TARGET_INVENTORY = 16000;

export async function ensureMedicineSeeded() {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(medicines);
  if ((count ?? 0) > 0) return;

  const rows = buildVariants().slice(0, TARGET_INVENTORY);
  for (const batch of chunk(rows, 400)) {
    await db.insert(medicines).values(batch).onConflictDoNothing();
  }
}

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

function buildFilters(params: CatalogParams): SQL | undefined {
  const filters: SQL[] = [];
  const search = params.search?.trim() ?? "";

  if (search) {
    const like = `%${search}%`;
    const searchFilter = or(
      ilike(medicines.name, like),
      ilike(medicines.genericSalt, like),
      ilike(medicines.brandNames, like),
      ilike(medicines.company, like),
      ilike(medicines.category, like),
      ilike(medicines.therapyArea, like),
      ilike(medicines.form, like),
      ilike(medicines.useCases, like),
    );
    if (searchFilter) filters.push(searchFilter);
  }

  if (params.category && params.category !== "All") {
    filters.push(eq(medicines.category, params.category));
  }

  if (params.therapyArea && params.therapyArea !== "All") {
    filters.push(eq(medicines.therapyArea, params.therapyArea));
  }

  if (params.highSavingOnly) {
    filters.push(eq(medicines.highSaving, true));
  }

  if (params.verifiedOnly) {
    filters.push(eq(medicines.priceStatus, "market_checked"));
  }

  return filters.length ? and(...filters) : undefined;
}

export async function getMedicineCatalog(params: CatalogParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, params.pageSize ?? 24));
  const where = buildFilters(params);

  const savingsExpr = sql<number>`(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice}, 1))`;

  const orderBy =
    params.sort === "priceLow"
      ? asc(medicines.indiaPrice)
      : params.sort === "priceHigh"
        ? desc(medicines.indiaPrice)
        : params.sort === "name"
          ? asc(medicines.name)
          : desc(savingsExpr);

  const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(medicines);
  const totalResult = where ? await countQuery.where(where) : await countQuery;
  const total = totalResult[0]?.count ?? 0;

  const baseQuery = db.select().from(medicines);
  const rows = where
    ? await baseQuery.where(where).orderBy(orderBy).limit(pageSize).offset((page - 1) * pageSize)
    : await baseQuery.orderBy(orderBy).limit(pageSize).offset((page - 1) * pageSize);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    rows,
  };
}

export async function getMedicineBySlug(slug: string): Promise<Medicine | undefined> {
  const rows = await db.select().from(medicines).where(eq(medicines.slug, slug)).limit(1);
  return rows[0];
}

export async function getAlternatives(salt: string, excludeId: number, limit = 8) {
  return db
    .select()
    .from(medicines)
    .where(and(eq(medicines.genericSalt, salt), sql`${medicines.id} <> ${excludeId}`))
    .orderBy(asc(medicines.indiaPrice))
    .limit(limit);
}

export async function getSuggestions(query: string, limit = 8) {
  const term = query.trim();
  if (!term) return [];

  const like = `%${term}%`;
  return db
    .select({
      slug: medicines.slug,
      name: medicines.name,
      genericSalt: medicines.genericSalt,
      category: medicines.category,
      therapyArea: medicines.therapyArea,
      indiaPrice: medicines.indiaPrice,
      usEuPrice: medicines.usEuPrice,
    })
    .from(medicines)
    .where(
      or(ilike(medicines.name, like), ilike(medicines.genericSalt, like), ilike(medicines.brandNames, like)),
    )
    .orderBy(desc(medicines.priceStatus), asc(medicines.name))
    .limit(limit);
}

export async function getTopSavings(limit = 6) {
  return db
    .select()
    .from(medicines)
    .where(eq(medicines.priceStatus, "market_checked"))
    .orderBy(desc(sql`(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice}, 1))`))
    .limit(limit);
}

export async function getInventoryStats() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      verified: sql<number>`count(*) filter (where ${medicines.priceStatus} = 'market_checked')::int`,
      highSaving: sql<number>`count(*) filter (where ${medicines.highSaving} = true)::int`,
      salts: sql<number>`count(distinct ${medicines.genericSalt})::int`,
    })
    .from(medicines);

  return row ?? { total: 0, verified: 0, highSaving: 0, salts: 0 };
}

export type CatalogInsight = {
  scope: string;
  total: number;
  avgMultiple: number;
  over10xPct: number;
  maxMultiple: number;
  topMolecule: string;
};

/**
 * Original-data aggregation used for "What the Jivan dataset shows" blocks.
 * These numbers do not exist anywhere else — they are computed from our
 * referenced anchor dataset, giving articles genuine information gain
 * beyond summarizing public sources.
 */
/**
 * Fail-safe: article pages call this during static prerendering, which can
 * happen before the catalog has ever been seeded (fresh deployment). An empty
 * table must return zeros rather than crash the build on a division by zero.
 */
export async function getCatalogInsight(therapyArea?: string): Promise<CatalogInsight> {
  const empty: CatalogInsight = {
    scope: therapyArea ?? "the full catalog",
    total: 0,
    avgMultiple: 0,
    over10xPct: 0,
    maxMultiple: 0,
    topMolecule: "",
  };

  try {
    // Pre-check avoids the divide-by-zero in the percentage expression below.
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(medicines)
      .where(eq(medicines.priceStatus, "market_checked"));

    if (!count) return empty;

    const conditioned = therapyArea
      ? and(eq(medicines.priceStatus, "market_checked"), eq(medicines.therapyArea, therapyArea))
      : eq(medicines.priceStatus, "market_checked");

    const rows = await db
      .select({
        total: sql<number>`count(*)::int`,
        avgMultiple: sql<number>`coalesce(round(avg(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice},1))::numeric, 1)::float, 0)`,
        over10xPct: sql<number>`coalesce(round((100.0 * count(*) filter (where ${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice},1) >= 10) / count(*))::numeric, 1)::float, 0)`,
      })
      .from(medicines)
      .where(conditioned);

    const stats = rows[0];
    if (!stats || !stats.total) return empty;

    const top = await db
      .select({
        salt: medicines.genericSalt,
        multiple: sql<number>`(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice},1))::float`,
      })
      .from(medicines)
      .where(conditioned)
      .orderBy(desc(sql`(${medicines.usEuPrice}::float / GREATEST(${medicines.indiaPrice},1))`))
      .limit(1);

    return {
      scope: therapyArea ?? "the full catalog",
      total: stats.total,
      avgMultiple: stats.avgMultiple,
      over10xPct: stats.over10xPct,
      maxMultiple: Math.round(top[0]?.multiple ?? 0),
      topMolecule: top[0]?.salt ?? "",
    };
  } catch {
    return empty;
  }
}
