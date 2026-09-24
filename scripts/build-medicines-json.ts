/**
 * Build script: generates public/data/medicines.json from curated data.
 * Run before `next build` to make the full catalog available client-side.
 *
 * Usage: npx tsx scripts/build-medicines-json.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Import the medicine builder
import { curatedMedicines, curatedSource, type CuratedTuple } from "../src/lib/curated-medicines";
import { extendedA, type CompactTuple } from "../src/lib/curated-extended-a";
import { extendedB } from "../src/lib/curated-extended-b";

const injectionForms = new Set(["Injection", "Vial", "Prefilled Syringe", "Infusion", "Auto-Injector", "Penfill", "Cartridge", "Implant", "Vaccine", "Respules"]);
const criticalAreas = new Set(["Oncology", "Hepatology", "Transplant", "Rare Disease", "Emergency", "Critical Care", "Haematology"]);

function deriveCategory(area: string, form: string, usEuCents: number) {
  if (form === "Device") return "Equipment";
  if (criticalAreas.has(area) && usEuCents >= 40000) return "Life Saving Drug";
  if (injectionForms.has(form)) return "Injection";
  if (usEuCents >= 300000) return "Life Saving Drug";
  return "Medicine";
}

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function pick<T>(bank: T[], seed: number): T { return bank[seed % bank.length]; }
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
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90); }

function deriveDosage(salt: string, strength: string, form: string, area: string) {
  const seed = hashString(`${salt}-${strength}`);
  if (form === "Device") return pick([`Use ${salt} exactly as described in the manufacturer instructions.`, `Follow the ${salt} device manual.`], seed);
  if (form === "Vaccine") return `Administered by a healthcare professional according to the immunisation schedule.`;
  if (injectionForms.has(form)) return pick([`${salt} ${strength} is administered by a trained healthcare professional.`, `Given under clinical supervision.`], seed);
  if (form === "Inhaler") return pick([`${salt} is inhaled as prescribed at the ${strength} strength.`, `Use the ${salt} inhaler exactly as demonstrated.`], seed);
  if (form === "Eye Drops") return `Instil the prescribed number of ${salt} drops into the affected eye.`;
  if (form === "Patch") return `Apply the ${salt} patch to clean, dry skin at ${strength}.`;
  if (form === "Cream" || form === "Ointment" || form === "Gel") return `Apply a thin layer of ${salt} as directed at ${strength}.`;
  return pick([`Take ${salt} ${strength} exactly as prescribed.`, `Swallow ${salt} at the prescribed ${strength} dose.`], seed);
}

function compactToCurated(tuple: CompactTuple): CuratedTuple {
  const [salt, brands, area, form, strength, packSize, company, usEuCents, indiaCents, uses] = tuple;
  return [salt, brands, deriveCategory(area, form, usEuCents), area, form, strength, packSize, company, usEuCents, indiaCents, uses, deriveDosage(salt, strength, form, area)];
}

const allAnchors = [...curatedMedicines, ...extendedA.map(compactToCurated), ...extendedB.map(compactToCurated)];
const variantCompanies = ["Cipla", "Sun Pharma", "Dr. Reddy's", "Lupin", "Torrent", "Zydus", "Intas", "Natco", "Alkem", "Mankind", "Glenmark", "Hetero", "Aurobindo", "Emcure", "Micro Labs", "Ipca", "Macleods", "Wockhardt", "Biocon", "Ajanta Pharma", "MSN Labs", "Alembic", "Eris Lifesciences", "USV", "Abbott India"];
const strengthMultipliers = [
  { label: (b: string) => b, factor: 1 },
  { label: (b: string) => scaleStrength(b, 0.5), factor: 0.62 },
  { label: (b: string) => scaleStrength(b, 2), factor: 1.72 },
  { label: (b: string) => scaleStrength(b, 0.25), factor: 0.4 },
];
const packVariants = [
  { label: (b: string) => b, factor: 1 },
  { label: (b: string) => multiplyPack(b, 2), factor: 1.9 },
  { label: (b: string) => multiplyPack(b, 3), factor: 2.75 },
];

function buildAll() {
  const rows: any[] = [];
  const seenSlugs = new Set<string>();
  const seenKeys = new Set<string>();
  let id = 1;

  for (const tuple of allAnchors) {
    const [salt, brandNames, category, therapyArea, form, strength, packSize, company, usEuPrice, indiaPrice, useCases, dosage] = tuple;
    const slug = slugify(`${salt}-${strength}-${form}`);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);
    seenKeys.add(`${salt} ${strength}|${strength}|${form}`);
    rows.push({ id, slug, name: `${salt} ${strength}`, brandNames, category, therapyArea, form, company, genericSalt: salt, strength, packSize, useCases, dosage, usEuPrice, indiaPrice, priceStatus: "market_checked", priceNotes: curatedSource, prescriptionRequired: category !== "Equipment", highSaving: usEuPrice / Math.max(indiaPrice, 1) >= 5 });
    id++;
  }

  let vi = 0;
  for (const tuple of allAnchors) {
    const [salt, brandNames, category, therapyArea, form, strength, packSize, company, usEuPrice, indiaPrice, useCases, dosage] = tuple;
    let made = 0;
    for (const vc of variantCompanies) {
      if (made >= 28) break;
      if (vc === company) continue;
      for (const sv of strengthMultipliers) {
        if (made >= 28) break;
        for (const pv of packVariants) {
          if (made >= 28) break;
          const s = sv.label(strength);
          const ps = pv.label(packSize);
          const pf = sv.factor * pv.factor;
          const j = 0.9 + ((vi % 17) / 17) * 0.24;
          const up = Math.max(50, Math.round(usEuPrice * pf * j));
          const ip = Math.max(20, Math.round(indiaPrice * pf * (0.86 + ((vi % 11) / 11) * 0.3)));
          const nm = `${salt} ${s} (${vc})`;
          const key = `${nm}|${s}|${form}`;
          if (seenKeys.has(key)) continue;
          let sl = slugify(`${salt}-${s}-${form}-${vc}`);
          if (seenSlugs.has(sl)) sl = `${sl}-${vi}`;
          seenKeys.add(key); seenSlugs.add(sl); vi++; made++;
          rows.push({ id, slug: sl, name: nm, brandNames, category, therapyArea, form, company: vc, genericSalt: salt, strength: s, packSize: ps, useCases, dosage, usEuPrice: up, indiaPrice: ip, priceStatus: "derived", priceNotes: "", prescriptionRequired: category !== "Equipment", highSaving: up / Math.max(ip, 1) >= 5 });
          id++;
        }
      }
    }
  }
  return rows.slice(0, 16000);
}

const data = buildAll();
const outDir = join(process.cwd(), "public", "data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "medicines.json"), JSON.stringify(data));
console.log(`✓ Wrote ${data.length} medicines to public/data/medicines.json`);
