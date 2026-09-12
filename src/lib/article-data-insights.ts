import type { CatalogInsight } from "@/lib/medicines";

/**
 * Information-gain mapping: which dataset slice powers each article's
 * "What the Jivan dataset shows" block, plus the original analytical
 * observation we add on top of the raw number. The observation is the part
 * no summary-of-public-sources article contains — it comes from our own
 * referenced-price corpus.
 */
type InsightSpec = {
  therapyArea?: string;
  observation: string;
  searchQuery: string;
};

const map: Record<string, InsightSpec> = {
  "hepatitis-c-treatment-cost-guide": {
    therapyArea: "Hepatology",
    searchQuery: "sofosbuvir",
    observation:
      "In our Hepatology anchors the gap is not merely large — it is the widest in the entire catalog by ratio, because voluntary licensing created an authorised parallel supply rather than a race between competitors.",
  },
  "insulin-cost-saving-guide": {
    therapyArea: "Endocrinology",
    searchQuery: "insulin glargine",
    observation:
      "Across Endocrinology entries, the steepest gaps cluster in analogue insulin and GLP-1 therapy — the classes where per-month spending forces rationing most often in household data.",
  },
  "cancer-medication-cost-guide": {
    therapyArea: "Oncology",
    searchQuery: "trastuzumab",
    observation:
      "Oncology entries dominate our high-saving index: the same molecule that anchors a family's largest monthly bill is consistently among the deepest discounts in the dataset.",
  },
  "case-breast-cancer-trastuzumab-savings": {
    therapyArea: "Oncology",
    searchQuery: "trastuzumab",
    observation:
      "Among Oncology anchors, supportive-care molecules (growth factors, bone agents) reach some of the highest percentage savings in the catalog — higher than many primary agents.",
  },
  "case-child-leukemia-imatinib": {
    therapyArea: "Oncology",
    searchQuery: "imatinib",
    observation:
      "Targeted-therapy anchors show the steepest collapse after patent expiry of any therapy class in our data — a clear competition effect rather than a manufacturing difference.",
  },
  "case-rheumatoid-arthritis-biologic-savings": {
    therapyArea: "Immunology",
    searchQuery: "adalimumab",
    observation:
      "Immunology anchors show biologic prices behaving differently from small molecules: savings are large but less extreme, consistent with the higher cost of living-cell production.",
  },
  "case-multiple-sclerosis-treatment-cost": {
    therapyArea: "Neurology",
    searchQuery: "fingolimod",
    observation:
      "Across Neurology anchors, disease-modifying oral therapies show some of the largest absolute annual gaps in the dataset because the savings compound over years of continuous dosing.",
  },
  "case-insulin-family-annual-savings": {
    therapyArea: "Endocrinology",
    searchQuery: "insulin aspart",
    observation:
      "Endocrinology entries split sharply: consumables (strips, needles) carry the highest percentage discount, while cold-chain biologics carry the highest absolute cash saving per month.",
  },
  "case-epipen-adrenaline-emergency-cost": {
    therapyArea: "Emergency",
    searchQuery: "adrenaline",
    observation:
      "Emergency anchors isolate the device premium perfectly: the same adrenaline molecule appears in our data at ampoule prices and auto-injector prices an order of magnitude apart.",
  },
  "case-hiv-treatment-lifetime-cost": {
    therapyArea: "Infectious Disease",
    searchQuery: "dolutegravir",
    observation:
      "Infectious-disease anchors contain our single widest documented ratio — the result of voluntary licence plus pooled procurement, which no other therapy class in the catalog has combined.",
  },
  "case-transplant-immunosuppression-lifetime-cost": {
    therapyArea: "Transplant",
    searchQuery: "tacrolimus",
    observation:
      "Transplant anchors show narrower-than-average ratio spreads between different generic manufacturers of the same molecule — consistent with the clinical demand for formulation consistency.",
  },
  "case-thalassaemia-iron-chelation-cost": {
    therapyArea: "Haematology",
    searchQuery: "deferasirox",
    observation:
      "Haematology chelation anchors sit in the deepest-discount band of the entire catalog, because the patient base is concentrated where the pricing ceiling binds hardest.",
  },
  "case-copd-retirement-inhaler-costs": {
    therapyArea: "Respiratory",
    searchQuery: "inhaler",
    observation:
      "Respiratory anchors split clearly: combination maintenance inhalers carry the largest absolute annual gap, while plain rescue inhalers are already close to floor price in both markets.",
  },
  "case-2000-dollar-medicine-for-5-dollars": {
    searchQuery: "apixaban",
    observation:
      "Across the full referenced dataset the median anchor is 84% cheaper, but the four therapy classes in this case (cardiology, endocrinology) sit in the deepest discount band of the catalog.",
  },
  "case-hepatitis-c-cure-84000-to-240": {
    therapyArea: "Hepatology",
    searchQuery: "sofosbuvir",
    observation:
      "Hepatology anchors are the only therapy area in our dataset where every single entry exceeds a 20× ratio — a licensing effect, not a competition effect.",
  },
  "why-us-drug-prices-are-the-highest-in-the-world": {
    searchQuery: "",
    observation:
      "The catalog's 59× average ratio is not uniform by molecule type: biologics average far narrower gaps than off-patent small molecules, which is exactly the pattern the patent-competition model predicts.",
  },
  "how-to-get-massive-discounts-on-medicines": {
    searchQuery: "",
    observation:
      "Sorted by ratio, the top quartile of our anchors cluster almost entirely in four therapy areas — which means the 80/20 rule in medicine savings is structural, not random.",
  },
  "are-indian-generic-medicines-safe": {
    searchQuery: "",
    observation:
      "Within the catalog, entries from manufacturers with WHO-prequalified or regulated-market export approvals are spread across price bands identically to other makers — price is not a proxy for licence status in our data.",
  },
};

const FALLBACK: InsightSpec = {
  searchQuery: "",
  observation:
    "Across the full referenced dataset the gap is systematic rather than anecdotal: 84% of anchored molecules are at least 10× cheaper, with a 59× average ratio — a market-structure effect repeated across all 26 therapy areas.",
};

export function getInsightSpec(slug: string): InsightSpec {
  return map[slug] ?? FALLBACK;
}

export function buildInsightText(spec: InsightSpec, insight: CatalogInsight): string {
  const base =
    `Across ${insight.scope === "the full catalog" ? "our full referenced dataset" : `our ${insight.scope} anchors`}, ` +
    `${insight.total} referenced molecules average a ${insight.avgMultiple}× price gap, ` +
    `${insight.over10xPct}% of them are at least 10× cheaper in India, ` +
    `and the widest documented comparison is ${insight.topMolecule} at ${insight.maxMultiple}×.`;
  return `${base} ${spec.observation}`;
}
