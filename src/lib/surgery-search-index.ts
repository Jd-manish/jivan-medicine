import { normalizeSearchText } from "@/lib/search-utils";

export type SurgerySearchEntry = {
  slug: string;
  name: string;
  category: string;
  description: string;
  searchTerms: string[];
};

const QUERY_STOP_WORDS = new Set([
  "a", "an", "and", "for", "in", "of", "the", "to", "with",
  "cost", "costs", "price", "prices", "compare", "comparison", "cheap", "cheaper",
  "india", "indian", "us", "usa", "united", "states", "eu", "europe", "germany", "australia",
  "surgery", "surgeries", "operation", "operations", "procedure", "procedures", "treatment", "guide",
]);

/** Small client-side search index; full medical content stays out of the search bundle. */
export const surgerySearchIndex: SurgerySearchEntry[] = [
  { slug: "cataract-surgery", name: "Cataract Surgery", category: "Eye", description: "Clouded lens removal and intraocular lens replacement.", searchTerms: ["cataract", "cloudy vision", "lens replacement"] },
  { slug: "lasik-eye-surgery", name: "LASIK Eye Surgery", category: "Eye", description: "Laser vision correction procedure.", searchTerms: ["lasik", "laser eye", "vision correction"] },
  { slug: "knee-replacement", name: "Total Knee Replacement (TKR)", category: "Orthopaedic", description: "Replacement of a damaged knee joint with a prosthetic implant.", searchTerms: ["knee replacement", "tkr", "knee arthroplasty"] },
  { slug: "hip-replacement", name: "Total Hip Replacement (THR)", category: "Orthopaedic", description: "Replacement of a damaged hip joint with a prosthetic implant.", searchTerms: ["hip replacement", "thr", "hip arthroplasty"] },
  { slug: "acl-reconstruction", name: "ACL Reconstruction", category: "Orthopaedic", description: "Surgical reconstruction of the anterior cruciate ligament.", searchTerms: ["acl", "anterior cruciate ligament", "knee ligament"] },
  { slug: "spinal-fusion", name: "Spinal Fusion", category: "Spine Surgery", description: "Surgical stabilization of selected spinal segments.", searchTerms: ["spinal fusion", "back surgery", "spine surgery"] },
  { slug: "heart-valve-replacement", name: "Heart Valve Replacement", category: "Cardiac", description: "Surgical treatment for selected heart valve disease.", searchTerms: ["heart valve", "valve replacement", "cardiac valve"] },
  { slug: "coronary-artery-bypass", name: "Coronary Artery Bypass (CABG)", category: "Cardiac", description: "Bypass surgery for selected coronary artery disease.", searchTerms: ["cabg", "bypass", "coronary bypass", "heart bypass"] },
  { slug: "angioplasty-stent", name: "Angioplasty & Stent", category: "Cardiac", description: "Catheter-based treatment to open a narrowed coronary artery.", searchTerms: ["angioplasty", "stent", "coronary angioplasty"] },
  { slug: "kidney-transplant", name: "Kidney Transplant", category: "Transplant", description: "Kidney transplant pathway and cost references.", searchTerms: ["renal transplant", "kidney transplantation"] },
  { slug: "liver-transplant", name: "Liver Transplant", category: "Transplant", description: "Liver transplant pathway and cost references.", searchTerms: ["hepatic transplant", "liver transplantation"] },
  { slug: "rhinoplasty", name: "Rhinoplasty (Nose Reshaping)", category: "Cosmetic Surgery", description: "Surgical reshaping of the nose for selected functional or cosmetic indications.", searchTerms: ["nose surgery", "nose job", "nasal surgery"] },
  { slug: "bariatric-surgery", name: "Bariatric Surgery", category: "Weight Management", description: "Surgical treatment options for selected obesity-related conditions.", searchTerms: ["weight loss surgery", "gastric bypass", "sleeve gastrectomy"] },
  { slug: "hernia-repair", name: "Hernia Repair", category: "General Surgery", description: "Surgical repair of selected abdominal wall and groin hernias.", searchTerms: ["hernia surgery", "inguinal hernia", "abdominal hernia"] },
  { slug: "dental-implant", name: "Dental Implant", category: "Dental", description: "Dental implant placement and restoration cost references.", searchTerms: ["tooth implant", "dental implants", "implant dentistry"] },
  { slug: "mastectomy", name: "Mastectomy", category: "Cancer Surgery", description: "Breast surgery planning and source-linked cost references.", searchTerms: ["breast removal", "breast surgery", "breast cancer surgery"] },
  { slug: "prostate-surgery", name: "Prostate Surgery (TURP / Radical Prostatectomy)", category: "Urology", description: "Cost references for selected prostate procedures; approach and diagnosis differ.", searchTerms: ["turp", "prostatectomy", "prostate operation"] },
  { slug: "appendectomy", name: "Appendectomy (Appendix Removal)", category: "General Surgery", description: "Surgical removal of an inflamed or infected appendix.", searchTerms: ["appendix", "appendix removal", "अपेंडिक्स", "appendicitis", "appendicectomy"] },
  { slug: "gallbladder-removal", name: "Gallbladder Removal (Cholecystectomy)", category: "General Surgery", description: "Gallbladder removal, most often using laparoscopic surgery.", searchTerms: ["cholecystectomy", "gallbladder surgery", "gallstones", "gall bladder", "पित्त की थैली"] },
  { slug: "hysterectomy", name: "Hysterectomy (Uterus Removal)", category: "Gynaecology", description: "Uterus removal with approach-specific price and recovery information.", searchTerms: ["uterus removal", "womb removal", "uterine surgery"] },
  { slug: "ivf-treatment", name: "IVF (In Vitro Fertilisation)", category: "Fertility Treatment", description: "IVF cycle price references and treatment-scope comparisons.", searchTerms: ["in vitro fertilization", "in vitro fertilisation", "fertility treatment", "ivf cycle"] },
  { slug: "knee-arthroscopy", name: "Knee Arthroscopy", category: "Orthopaedic", description: "Camera-guided knee procedure; diagnostic scope and repairs differ.", searchTerms: ["arthroscopic knee surgery", "meniscus surgery", "knee scope", "knee keyhole surgery"] },
  { slug: "pacemaker-implantation", name: "Pacemaker Implantation", category: "Cardiac", description: "Cardiac device implantation and long-term follow-up references.", searchTerms: ["heart pacemaker", "cardiac device implantation", "pacemaker surgery", "bradycardia device"] },
  { slug: "shoulder-replacement", name: "Shoulder Replacement (Shoulder Arthroplasty)", category: "Orthopaedic", description: "Shoulder replacement price references by implant and procedure type.", searchTerms: ["shoulder arthroplasty", "shoulder implant", "reverse shoulder replacement", "shoulder joint replacement"] },
  { slug: "tonsillectomy", name: "Tonsillectomy (Tonsil Removal)", category: "ENT", description: "Tonsil removal price references, with a separate adenoidectomy caveat.", searchTerms: ["tonsil removal", "tonsil surgery", "tonsils removed", "tonsillitis operation"] },
];

/** Search procedure names and synonyms, ignoring common cost/market words in natural queries. */
export function searchProcedureIndex(query: string): SurgerySearchEntry[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  if (["surgery", "surgeries", "operation", "operations", "procedure", "procedures"].includes(normalized)) {
    return surgerySearchIndex;
  }

  const tokens = normalized.split(" ").filter((token) => token.length > 1 && !QUERY_STOP_WORDS.has(token));
  if (!tokens.length) return [];

  return surgerySearchIndex
    .map((procedure, order) => {
      const fields = [procedure.name, procedure.slug, procedure.category, ...procedure.searchTerms]
        .map(normalizeSearchText);
      const matchedTokens = tokens.filter((token) => fields.some((field) => field.includes(token)));
      const coverage = matchedTokens.length / tokens.length;
      const phraseMatch = fields.some((field) => field.includes(normalized));
      return { procedure, order, score: phraseMatch ? 2 : coverage };
    })
    .filter(({ score }) => score >= Math.max(0.5, 1 / tokens.length))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ procedure }) => procedure);
}
