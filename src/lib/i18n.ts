export const supportedLocales = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "pl",
  "sv",
  "da",
  "fi",
  "cs",
  "ro",
  "hu",
  "el",
  "sk",
  "sl",
  "hr",
  "bg",
  "et",
  "lv",
  "lt",
  "mt",
  "ga",
] as const;

export type AppLocale = (typeof supportedLocales)[number];

/** Curated locales with maintained translations and indexable editorial copy. */
export const primaryLocales = ["en", "de", "fr", "es", "it"] as const satisfies readonly AppLocale[];
export type PrimaryLocale = (typeof primaryLocales)[number];

export const defaultLocale: AppLocale = "en";

export function isValidLocale(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}

export function getPreferredLocale(acceptLanguageHeader: string | null): AppLocale {
  if (!acceptLanguageHeader) return defaultLocale;

  const parsed = acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [lang, qValue] = part.trim().split(";q=");
      const base = lang.toLowerCase().split("-")[0];
      const q = qValue ? Number(qValue) : 1;
      return { base, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const entry of parsed) {
    if (isValidLocale(entry.base)) {
      return entry.base;
    }
  }

  return defaultLocale;
}

/**
 * Geo-IP fallback from platform headers — free, no external service.
 * Reads the standard country headers set by common hosting platforms
 * (Cloudflare cf-ipcountry, Vercel x-vercel-ip-country, generic x-country-code,
 * App Engine x-appengine-country, Fastly x-geo-country) and ignores private /
 * unspecified values. Only reached when browser language gave no signal.
 */
const countryLanguageMap: Record<string, AppLocale> = {
  AT: "de", BE: "nl", BG: "bg", HR: "hr", CZ: "cs", DK: "da", EE: "et",
  FI: "fi", FR: "fr", DE: "de", GR: "el", HU: "hu", IE: "en", IT: "it",
  LV: "lv", LT: "lt", LU: "fr", MT: "mt", NL: "nl", PL: "pl", PT: "pt",
  RO: "ro", SK: "sk", SI: "sl", ES: "es", SE: "sv", CH: "de", GB: "en",
  US: "en", CA: "en", AU: "en",
};

export function getGeoLocale(headers: Headers): AppLocale {
  const candidates = [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "x-country-code",
    "x-appengine-country",
    "x-geo-country",
    "geoip-country-code",
  ];

  for (const name of candidates) {
    const raw = headers.get(name);
    if (!raw) continue;
    const code = raw.trim().toUpperCase();
    if (code.length !== 2 || code === "XX" || code === "A1" || code === "T1") continue;
    const mapped = countryLanguageMap[code];
    if (mapped) return mapped;
  }

  return defaultLocale;
}

type TranslationSet = {
  brand: string;
  navHome: string;
  navMedicines: string;
  navArticles: string;
  navAbout: string;
  navContact: string;
  navPrivacy: string;
  navTerms: string;
  navDisclaimer: string;
  heroBadge: string;
  heroTitle: string;
  heroHeadlineA: string;
  heroHeadlineB: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  whyTitle: string;
  why1: string;
  why2: string;
  why3: string;
  searchTitle: string;
  searchPlaceholder: string;
  allCategories: string;
  tableMedicine: string;
  tableCategory: string;
  tableUses: string;
  tableCompany: string;
  tableSalt: string;
  tableUsEuPrice: string;
  tableIndiaPrice: string;
  tableSavings: string;
  tablePriceStatus: string;
  tablePriceNotes: string;
  noResults: string;
  resultsLabel: string;
  articleHubTitle: string;
  articleHubSubtitle: string;
  articleReadMore: string;
  safetyNoteTitle: string;
  safetyNoteBody: string;
  pricingReal: string;
  pricingEstimated: string;
  footerText: string;
  statCatalogEntries: string;
  statActiveMolecules: string;
  statHighSaving: string;
  statEUUSLocales: string;
  howItWorksTitle: string;
  faqSectionTitle: string;
};

const en: TranslationSet = {
  brand: "Jivan",
  navHome: "Home",
  navMedicines: "Medicines",
  navArticles: "Articles",
  navAbout: "About",
  navContact: "Contact",
  navPrivacy: "Privacy",
  navTerms: "Terms",
  navDisclaimer: "Medical Disclaimer",
  heroBadge: "Professional medicine affordability platform",
  heroTitle: "Access the same active-salt medications at significantly lower cost",
  heroHeadlineA: "Your same salt medication,",
  heroHeadlineB: "up to 90% off",
  heroSubtitle:
    "Jivan helps patients across the US and Europe compare high-cost medicines with lower-cost Indian alternatives while keeping medical safety and physician supervision at the center.",
  ctaPrimary: "Explore medicine catalog",
  ctaSecondary: "Read detailed guides",
  whyTitle: "Why prices can differ across countries",
  why1: "Large-scale generic manufacturing infrastructure",
  why2: "Lower production and distribution costs",
  why3: "Competitive multi-supplier medicine ecosystem",
  searchTitle: "Search medicines, injections, life-saving drugs, and medical equipment",
  searchPlaceholder: "Search medicine, symptom, disease, drug class, or procedure",
  allCategories: "All categories",
  tableMedicine: "Medicine",
  tableCategory: "Category",
  tableUses: "Use cases",
  tableCompany: "Company",
  tableSalt: "Active salt",
  tableUsEuPrice: "US/EU price",
  tableIndiaPrice: "India price",
  tableSavings: "Savings",
  tablePriceStatus: "Price status",
  tablePriceNotes: "Price note",
  noResults: "No medicines matched your filters.",
  resultsLabel: "results",
  articleHubTitle: "Health affordability knowledge center",
  articleHubSubtitle:
    "In-depth articles on generic switching, quality checks, budgeting, and safe long-term medicine planning.",
  articleReadMore: "Read article",
  safetyNoteTitle: "Important medical safety notice",
  safetyNoteBody:
    "Always consult a licensed physician before changing medicine, dose, or brand. Jivan provides educational pricing intelligence and does not replace emergency or diagnostic care.",
  pricingReal: "Market checked",
  pricingEstimated: "Guessing (estimated)",
  footerText: "Jivan • Better medicine access with clinical responsibility",
  statCatalogEntries: "Catalog entries",
  statActiveMolecules: "Active molecules",
  statHighSaving: "High-saving items",
  statEUUSLocales: "EU + US locales",
  howItWorksTitle: "How Jivan works",
  faqSectionTitle: "Questions patients ask us",
};

const de: Partial<TranslationSet> = {
  navHome: "Startseite",
  navMedicines: "Medikamente",
  navArticles: "Artikel",
  navContact: "Kontakt",
  heroBadge: "Professionelle Plattform für bezahlbare Medikamente",
  heroTitle: "Gleiche Wirkstoffe zu deutlich niedrigeren Kosten",
  heroSubtitle:
    "Jivan hilft Patientinnen und Patienten in den USA und Europa, teure Medikamente mit geprüften indischen Alternativen zu vergleichen — derselbe Wirkstoff, derselbe Therapiezweck, dramatisch niedrigerer Preis.",
  ctaPrimary: "Medikamentenkatalog öffnen",
  ctaSecondary: "Leitfäden lesen",
  whyTitle: "Warum sind die Preise zwischen Ländern so unterschiedlich?",
  why1: "Generikaherstellung in sehr großem Maßstab",
  why2: "Niedrigere Produktions- und Vertriebskosten",
  why3: "Viele Hersteller um denselben Wirkstoff im Wettbewerb",
  searchTitle: "Medikamente, Injektionen, lebensrettende Arzneimittel und Geräte suchen",
  searchPlaceholder: "Nach Medikament, Wirkstoff, Stärke, Firma oder Anwendung suchen",
  allCategories: "Alle Kategorien",
  tableMedicine: "Medikament",
  tableCategory: "Kategorie",
  tableUses: "Anwendung",
  tableCompany: "Hersteller",
  tableSalt: "Wirkstoff",
  tableUsEuPrice: "US/EU-Preis",
  tableIndiaPrice: "Preis in Indien",
  tableSavings: "Ersparnis",
  tablePriceStatus: "Preisstatus",
  tablePriceNotes: "Preisanmerkung",
  noResults: "Keine Medikamente zu Ihren Filtern gefunden.",
  resultsLabel: "Ergebnisse",
  articleHubTitle: "Wissenszentrum für bezahlbare Gesundheit",
  articleHubSubtitle:
    "Ausführliche Leitfäden zu Generika-Wechsel, Qualitätsprüfung, Budgetplanung und sicherer Langzeit-Therapie.",
  articleReadMore: "Artikel lesen",
  safetyNoteTitle: "Wichtiger medizinischer Hinweis",
  safetyNoteBody:
    "Ändern Sie Medikament, Dosis oder Hersteller nur nach Rücksprache mit einer approbierten Ärztin oder einem approbierten Arzt. Jivan liefert Bildungs- und Preisinformationen und ersetzt keine Diagnose oder Notfallversorgung.",
  pricingReal: "Marktgeprüft",
  pricingEstimated: "Geschätzt",
  footerText: "Jivan • Besserer Zugang zu Medikamenten — mit klinischer Verantwortung",
  heroHeadlineA: "Ihr Medikament mit gleichem Wirkstoff,",
  heroHeadlineB: "bis zu 90 % günstiger",
  statCatalogEntries: "Katalogeinträge",
  statActiveMolecules: "Wirkstoffe",
  statHighSaving: "Einsparungen",
  statEUUSLocales: "EU + US-Länder",
  howItWorksTitle: "So funktioniert Jivan",
  faqSectionTitle: "Häufige Fragen unserer Leser",
};

const fr: Partial<TranslationSet> = {
  navHome: "Accueil",
  navMedicines: "Médicaments",
  navArticles: "Articles",
  navContact: "Contact",
  heroBadge: "Plateforme professionnelle d'accès aux médicaments",
  heroTitle: "Même principe actif à un coût nettement inférieur",
  heroSubtitle:
    "Jivan aide les patients aux États-Unis et en Europe à comparer des médicaments coûteux avec des alternatives indiennes fiables — même principe actif, même intention thérapeutique, prix fortement réduit.",
  ctaPrimary: "Explorer le catalogue",
  ctaSecondary: "Lire les guides",
  whyTitle: "Pourquoi les prix varient-ils tant d'un pays à l'autre ?",
  why1: "Fabrication de génériques à très grande échelle",
  why2: "Coûts de production et de distribution réduits",
  why3: "Concurrence entre de nombreux fabricants",
  searchTitle: "Rechercher médicaments, injections, traitements vitaux et équipements",
  searchPlaceholder: "Rechercher par nom, principe actif, dosage, fabricant ou usage",
  allCategories: "Toutes les catégories",
  tableMedicine: "Médicament",
  tableCategory: "Catégorie",
  tableUses: "Usages",
  tableCompany: "Fabricant",
  tableSalt: "Principe actif",
  tableUsEuPrice: "Prix US/UE",
  tableIndiaPrice: "Prix en Inde",
  tableSavings: "Économies",
  tablePriceStatus: "Statut du prix",
  tablePriceNotes: "Note sur le prix",
  noResults: "Aucun médicament ne correspond à vos filtres.",
  resultsLabel: "résultats",
  articleHubTitle: "Centre de connaissances sur l'accès aux soins",
  articleHubSubtitle:
    "Guides détaillés sur le passage aux génériques, le contrôle qualité, la budgétisation et la continuité des traitements.",
  articleReadMore: "Lire l'article",
  safetyNoteTitle: "Avertissement médical important",
  safetyNoteBody:
    "Consultez toujours un médecin avant de changer de médicament, de dose ou de marque. Jivan fournit des informations éducatives et tarifaires et ne remplace ni un diagnostic ni les soins d'urgence.",
  pricingReal: "Vérifié sur le marché",
  pricingEstimated: "Estimé",
  footerText: "Jivan • Un meilleur accès aux médicaments, avec responsabilité clinique",
  heroHeadlineA: "Votre médicament au même principe actif,",
  heroHeadlineB: "jusqu'à 90 % moins cher",
  statCatalogEntries: "Entrées du catalogue",
  statActiveMolecules: "Molécules actives",
  statHighSaving: "Bons plans",
  statEUUSLocales: "Pays UE + US",
  howItWorksTitle: "Comment fonctionne Jivan",
  faqSectionTitle: "Questions fréquentes de nos lecteurs",
};

const es: Partial<TranslationSet> = {
  navHome: "Inicio",
  navMedicines: "Medicinas",
  navArticles: "Artículos",
  navContact: "Contacto",
  heroBadge: "Plataforma profesional de acceso a medicamentos",
  heroTitle: "Mismo principio activo a un costo mucho menor",
  heroSubtitle:
    "Jivan ayuda a pacientes de EE. UU. y Europa a comparar medicamentos caros con alternativas indias de confianza: mismo principio activo, misma intención terapéutica, precio mucho más bajo.",
  ctaPrimary: "Explorar el catálogo",
  ctaSecondary: "Leer las guías",
  whyTitle: "¿Por qué varían tanto los precios entre países?",
  why1: "Fabricación de genéricos a gran escala",
  why2: "Menores costos de producción y distribución",
  why3: "Competencia entre múltiples fabricantes",
  searchTitle: "Buscar medicinas, inyecciones, tratamientos vitales y equipos",
  searchPlaceholder: "Buscar por nombre, sal, concentración, empresa o uso",
  allCategories: "Todas las categorías",
  tableMedicine: "Medicina",
  tableCategory: "Categoría",
  tableUses: "Usos",
  tableCompany: "Fabricante",
  tableSalt: "Principio activo",
  tableUsEuPrice: "Precio EE. UU./UE",
  tableIndiaPrice: "Precio en India",
  tableSavings: "Ahorro",
  tablePriceStatus: "Estado del precio",
  tablePriceNotes: "Nota del precio",
  noResults: "Ninguna medicina coincide con tus filtros.",
  resultsLabel: "resultados",
  articleHubTitle: "Centro de conocimiento sobre acceso a la salud",
  articleHubSubtitle:
    "Guías detalladas sobre genéricos, control de calidad, presupuesto y continuidad del tratamiento.",
  articleReadMore: "Leer el artículo",
  safetyNoteTitle: "Aviso médico importante",
  safetyNoteBody:
    "Consulta siempre a un médico antes de cambiar de medicamento, dosis o marca. Jivan ofrece información educativa y de precios y no sustituye el diagnóstico ni la atención de urgencia.",
  pricingReal: "Verificado en mercado",
  pricingEstimated: "Estimado",
  footerText: "Jivan • Mejor acceso a los medicamentos, con responsabilidad clínica",
  heroHeadlineA: "Tu medicamento con el mismo principio activo,",
  heroHeadlineB: "hasta un 90 % más barato",
  statCatalogEntries: "Entradas del catálogo",
  statActiveMolecules: "Moléculas activas",
  statHighSaving: "Mayores ahorros",
  statEUUSLocales: "Países UE + EE. UU.",
  howItWorksTitle: "Cómo funciona Jivan",
  faqSectionTitle: "Preguntas frecuentes de nuestros lectores",
};

const it: Partial<TranslationSet> = {
  navHome: "Home",
  navMedicines: "Farmaci",
  navArticles: "Articoli",
  navContact: "Contatti",
  heroBadge: "Piattaforma professionale per l'accesso ai farmaci",
  heroTitle: "Stesso principio attivo con costo significativamente ridotto",
  heroSubtitle:
    "Jivan aiuta i pazienti negli Stati Uniti e in Europa a confrontare farmaci costosi con alternative indiane affidabili: stesso principio attivo, stessa finalità terapeutica, prezzo nettamente inferiore.",
  ctaPrimary: "Esplora il catalogo",
  ctaSecondary: "Leggi le guide",
  whyTitle: "Perché i prezzi cambiano tanto da paese a paese?",
  why1: "Produzione di generici su larga scala",
  why2: "Costi di produzione e distribuzione più bassi",
  why3: "Competizione tra molti produttori",
  searchTitle: "Cerca farmaci, iniezioni, terapie salvavita e dispositivi",
  searchPlaceholder: "Cerca per nome, principio attivo, dosaggio, azienda o uso",
  allCategories: "Tutte le categorie",
  tableMedicine: "Farmaco",
  tableCategory: "Categoria",
  tableUses: "Usi",
  tableCompany: "Azienda",
  tableSalt: "Principio attivo",
  tableUsEuPrice: "Prezzo USA/UE",
  tableIndiaPrice: "Prezzo in India",
  tableSavings: "Risparmio",
  tablePriceStatus: "Stato del prezzo",
  tablePriceNotes: "Nota sul prezzo",
  noResults: "Nessun farmaco corrisponde ai tuoi filtri.",
  resultsLabel: "risultati",
  articleHubTitle: "Centro di conoscenza sull'accesso alle cure",
  articleHubSubtitle:
    "Guide approfondite su generici, controllo qualità, budget e continuità terapeutica.",
  articleReadMore: "Leggi l'articolo",
  safetyNoteTitle: "Avviso medico importante",
  safetyNoteBody:
    "Consulta sempre un medico prima di cambiare farmaco, dose o marca. Jivan offre informazioni educative e sui prezzi e non sostituisce la diagnosi né le cure d'urgenza.",
  pricingReal: "Verificato sul mercato",
  pricingEstimated: "Stimato",
  footerText: "Jivan • Migliore accesso ai farmaci, con responsabilità clinica",
  heroHeadlineA: "Il tuo farmaco con lo stesso principio attivo,",
  heroHeadlineB: "fino al 90% in meno",
  statCatalogEntries: "Voci del catalogo",
  statActiveMolecules: "Molecole attive",
  statHighSaving: "Maggiori risparmi",
  statEUUSLocales: "Paesi UE + USA",
  howItWorksTitle: "Come funziona Jivan",
  faqSectionTitle: "Domande frequenti dei nostri lettori",
};

const localePartials: Record<AppLocale, Partial<TranslationSet>> = {
  en: {},
  de,
  fr,
  es,
  it,
  pt: {},
  nl: {},
  pl: {},
  sv: {},
  da: {},
  fi: {},
  cs: {},
  ro: {},
  hu: {},
  el: {},
  sk: {},
  sl: {},
  hr: {},
  bg: {},
  et: {},
  lv: {},
  lt: {},
  mt: {},
  ga: {},
};

export function t(locale: AppLocale): TranslationSet {
  return {
    ...en,
    ...(localePartials[locale] ?? {}),
  };
}
