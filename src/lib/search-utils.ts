export type MedicineSearchRecord = {
  name: string;
  genericSalt: string;
  brandNames?: string;
  company?: string;
  useCases?: string;
  therapyArea?: string;
  category?: string;
  strength?: string;
  form?: string;
  packSize?: string;
};

const COMMON_SEARCH_WORDS = new Set([
  "a", "an", "and", "at", "for", "in", "of", "on", "the", "to", "with",
  "cost", "costs", "price", "prices", "compare", "comparison", "cheap", "cheaper",
  "india", "indian", "usa", "us", "eu", "europe", "australia",
  "medicine", "medicines", "med", "meds", "drug", "drugs", "treatment", "guide",
  "surgery", "surgeries", "operation", "operations", "procedure", "procedures",
]);

const CLASS_ALIASES: Record<string, string[]> = {
  statin: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "pitavastatin"],
  statins: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "pitavastatin"],
  "ace inhibitor": ["ramipril", "lisinopril", "enalapril", "perindopril", "captopril"],
  "ace inhibitors": ["ramipril", "lisinopril", "enalapril", "perindopril", "captopril"],
  arb: ["telmisartan", "losartan", "valsartan", "olmesartan", "candesartan"],
  arbs: ["telmisartan", "losartan", "valsartan", "olmesartan", "candesartan"],
  "angiotensin receptor blocker": ["telmisartan", "losartan", "valsartan", "olmesartan", "candesartan"],
  "beta blocker": ["metoprolol", "bisoprolol", "carvedilol", "nebivolol", "atenolol"],
  "beta blockers": ["metoprolol", "bisoprolol", "carvedilol", "nebivolol", "atenolol"],
  anticoagulant: ["apixaban", "rivaroxaban", "dabigatran", "warfarin", "edoxaban"],
  anticoagulants: ["apixaban", "rivaroxaban", "dabigatran", "warfarin", "edoxaban"],
  "blood thinner": ["apixaban", "rivaroxaban", "dabigatran", "warfarin", "clopidogrel"],
  "blood thinners": ["apixaban", "rivaroxaban", "dabigatran", "warfarin", "clopidogrel"],
  antiplatelet: ["clopidogrel", "aspirin", "ticagrelor", "prasugrel"],
  antiplatelets: ["clopidogrel", "aspirin", "ticagrelor", "prasugrel"],
  "glp 1 agonist": ["semaglutide", "liraglutide", "dulaglutide", "exenatide"],
  "glp 1 agonists": ["semaglutide", "liraglutide", "dulaglutide", "exenatide"],
  glp1: ["semaglutide", "liraglutide", "dulaglutide", "exenatide"],
  sglt2: ["empagliflozin", "dapagliflozin", "canagliflozin"],
  "sglt 2 inhibitor": ["empagliflozin", "dapagliflozin", "canagliflozin"],
  "dpp4": ["sitagliptin", "linagliptin", "saxagliptin", "vildagliptin"],
  "dpp 4 inhibitor": ["sitagliptin", "linagliptin", "saxagliptin", "vildagliptin"],
  ssri: ["sertraline", "escitalopram", "fluoxetine", "paroxetine", "citalopram"],
  ssris: ["sertraline", "escitalopram", "fluoxetine", "paroxetine", "citalopram"],
  "proton pump inhibitor": ["omeprazole", "pantoprazole", "esomeprazole", "lansoprazole"],
  "proton pump inhibitors": ["omeprazole", "pantoprazole", "esomeprazole", "lansoprazole"],
  ppi: ["omeprazole", "pantoprazole", "esomeprazole", "lansoprazole"],
  antibiotics: ["amoxicillin", "azithromycin", "ciprofloxacin", "doxycycline", "cefixime"],
};

const KNOWN_MISSPELLINGS: Record<string, string> = {
  migrane: "migraine",
  migraene: "migraine",
  migrain: "migraine",
  diabetis: "diabetes",
  diabates: "diabetes",
  hipertension: "hypertension",
  hipertenssion: "hypertension",
  astma: "asthma",
  alzheimers: "alzheimer",
  alzheimerss: "alzheimer",
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function misspellingCorrection(query: string): string | null {
  const normalized = normalizeSearchText(query);
  return KNOWN_MISSPELLINGS[normalized] ?? null;
}

export function classSearchTerms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  const exact = CLASS_ALIASES[normalized];
  if (exact) return exact;
  const coreQuery = normalized.split(" ").filter((token) => !COMMON_SEARCH_WORDS.has(token)).join(" ");
  return CLASS_ALIASES[coreQuery] ?? [];
}

export function matchesMedicineSearch(query: string, medicine: MedicineSearchRecord): boolean {
  const normalized = normalizeSearchText(query);
  if (!normalized) return false;
  const fields = [
    medicine.name,
    medicine.genericSalt,
    medicine.brandNames ?? "",
    medicine.company ?? "",
    medicine.useCases ?? "",
    medicine.therapyArea ?? "",
    medicine.category ?? "",
    medicine.strength ?? "",
    medicine.form ?? "",
    medicine.packSize ?? "",
  ].map(normalizeSearchText);

  if (fields.some((field) => field.includes(normalized))) return true;
  const queryTokens = normalized.split(" ").filter((token) => token.length > 1 && !COMMON_SEARCH_WORDS.has(token));
  if (queryTokens.length > 0 && queryTokens.every((token) => fields.some((field) => field.includes(token)))) return true;
  return classSearchTerms(normalized).some((term) => {
    const normalizedTerm = normalizeSearchText(term);
    return fields.some((field) => field.includes(normalizedTerm));
  });
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (b.length > a.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  if (i < a.length || j < b.length) edits += 1;
  return edits === 1;
}

/** Find a one-character correction only when the original search is empty. */
export function suggestSearchCorrection(
  query: string,
  records: readonly MedicineSearchRecord[],
): string | null {
  const normalized = normalizeSearchText(query);
  if (!normalized || normalized.includes(" ") || normalized.length < 5) return null;
  const known = misspellingCorrection(normalized);
  if (known) return known;

  const frequencies = new Map<string, number>();
  for (const record of records) {
    const text = [record.name, record.genericSalt, record.brandNames, record.useCases, record.therapyArea]
      .filter(Boolean)
      .join(" ");
    const seen = new Set(normalizeSearchText(text).split(" "));
    for (const word of seen) {
      if (word.length >= 5 && editDistanceAtMostOne(normalized, word)) {
        frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
      }
    }
  }
  const best = [...frequencies.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return best && best[1] >= 2 ? best[0] : null;
}

export function getTypoBannerLabel(query: string, correction: string): string {
  return `Showing results for “${correction}” instead of “${query}”.`;
}
