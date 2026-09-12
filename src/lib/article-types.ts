export type Callout = {
  kind: "tip" | "warning" | "case" | "fact";
  title: string;
  body: string;
};

export type ArticleTable = {
  caption: string;
  head: string[];
  rows: string[][];
};

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  numbered?: string[];
  callout?: Callout;
  table?: ArticleTable;
};

export type Reference = {
  label: string;
  publisher: string;
  url: string;
};

export type Faq = { q: string; a: string };

export type CaseSnapshot = {
  patient: string;
  country: string;
  condition: string;
  medicine: string;
  westernCost: string;
  indianCost: string;
  saving: string;
};

export type Article = {
  slug: string;
  /** <title> — front-loaded with the primary keyword. */
  title: string;
  /** On-page H1, phrased naturally for readers. */
  h1: string;
  metaDescription: string;
  summary: string;
  keywords: string[];
  category: "Guide" | "Case Study" | "Safety" | "Explainer";
  intent: string;
  readingMinutes: number;
  updatedAt: string;
  /** Staggered editorial cadence publication date (laid over updatedAt). */
  publishedAt?: string;
  heroStat?: { value: string; label: string };
  snapshot?: CaseSnapshot;
  sections: ArticleSection[];
  faqs: Faq[];
  references: Reference[];
  tags: string[];
  /** Slugs of closely-related articles for internal linking. */
  related: string[];
};

/** Real, stable primary sources reused across the library. */
export const SOURCES = {
  fdaGenericFacts: {
    label: "Generic Drug Facts",
    publisher: "U.S. Food & Drug Administration",
    url: "https://www.fda.gov/drugs/generic-drugs/generic-drug-facts",
  },
  fdaOrangeBook: {
    label: "Approved Drug Products with Therapeutic Equivalence Evaluations (Orange Book)",
    publisher: "U.S. Food & Drug Administration",
    url: "https://www.accessdata.fda.gov/scripts/cder/ob/",
  },
  fdaPersonalImport: {
    label: "Personal Importation of Medicines",
    publisher: "U.S. Food & Drug Administration",
    url: "https://www.fda.gov/industry/import-basics/personal-importation",
  },
  fdaLabel: {
    label: "openFDA Drug Label API",
    publisher: "U.S. Food & Drug Administration",
    url: "https://open.fda.gov/apis/drug/label/",
  },
  emaGenerics: {
    label: "Generic and Hybrid Medicines",
    publisher: "European Medicines Agency",
    url: "https://www.ema.europa.eu/en/human-regulatory-overview/marketing-authorisation/generic-hybrid-medicines",
  },
  emaBiosimilar: {
    label: "Biosimilar Medicines Overview",
    publisher: "European Medicines Agency",
    url: "https://www.ema.europa.eu/en/human-regulatory-overview/biosimilar-medicines-overview",
  },
  whoEml: {
    label: "WHO Model List of Essential Medicines",
    publisher: "World Health Organization",
    url: "https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02",
  },
  whoPrequal: {
    label: "WHO Prequalification of Medical Products",
    publisher: "World Health Organization",
    url: "https://extranet.who.int/prequal/",
  },
  whoHepatitis: {
    label: "Hepatitis C Fact Sheet",
    publisher: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/hepatitis-c",
  },
  whoDiabetes: {
    label: "Diabetes Fact Sheet",
    publisher: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/diabetes",
  },
  mpp: {
    label: "Licence Agreements and Public Health Impact",
    publisher: "Medicines Patent Pool",
    url: "https://medicinespatentpool.org/",
  },
  cdsco: {
    label: "Central Drugs Standard Control Organisation",
    publisher: "Government of India, CDSCO",
    url: "https://cdsco.gov.in/opencms/opencms/en/Home/",
  },
  nppa: {
    label: "National Pharmaceutical Pricing Authority — Price Ceilings",
    publisher: "Government of India, NPPA",
    url: "https://www.nppaindia.nic.in/",
  },
  janAushadhi: {
    label: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana",
    publisher: "Government of India",
    url: "https://janaushadhi.gov.in/",
  },
  nabp: {
    label: "Find a Safe Online Pharmacy",
    publisher: "National Association of Boards of Pharmacy",
    url: "https://safe.pharmacy/buying-safely/",
  },
  mhra: {
    label: "Medicines and Healthcare products Regulatory Agency",
    publisher: "UK Government",
    url: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency",
  },
  nhsPrescription: {
    label: "NHS Prescription Costs and Help with Costs",
    publisher: "National Health Service, UK",
    url: "https://www.nhs.uk/nhs-services/prescriptions/",
  },
  kffCosts: {
    label: "Health Costs and Prescription Drug Research",
    publisher: "KFF (Kaiser Family Foundation)",
    url: "https://www.kff.org/health-costs/",
  },
  rxnorm: {
    label: "RxNorm Drug Vocabulary",
    publisher: "U.S. National Library of Medicine",
    url: "https://www.nlm.nih.gov/research/umls/rxnorm/index.html",
  },
  medlineplus: {
    label: "MedlinePlus Drug Information",
    publisher: "U.S. National Library of Medicine",
    url: "https://medlineplus.gov/druginformation.html",
  },
  unaids: {
    label: "Global HIV Treatment Data",
    publisher: "UNAIDS",
    url: "https://www.unaids.org/en/resources/fact-sheet",
  },
  globalFund: {
    label: "Pooled Procurement Mechanism Reference Pricing",
    publisher: "The Global Fund",
    url: "https://www.theglobalfund.org/en/sourcing-management/health-products/",
  },
  cdcTravel: {
    label: "Travelling with Medications",
    publisher: "U.S. Centers for Disease Control and Prevention",
    url: "https://wwwnc.cdc.gov/travel/page/travelers-with-chronic-illnesses",
  },
  fdaShortage: {
    label: "Drug Shortages Database",
    publisher: "U.S. Food & Drug Administration",
    url: "https://www.accessdata.fda.gov/scripts/drugshortages/",
  },
} as const satisfies Record<string, Reference>;

export const CASE_DISCLAIMER =
  "This is a composite case study. It illustrates a real, documented price pattern using a representative patient profile rather than a specific identifiable individual. Figures are reference ranges, not quotations, and outcomes vary by person, dose and market.";
