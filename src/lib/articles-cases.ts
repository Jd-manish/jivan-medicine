import { CASE_DISCLAIMER, SOURCES, type Article, type ArticleSection } from "@/lib/article-types";

const UPDATED = "2026-02-01T00:00:00.000Z";

/**
 * Closing integrity statement. Three phrasing variants so the 12 case
 * studies do not share an identical 90-word block verbatity; each case
 * renders one variant depending on its index. The meaning is identical —
 * this is honesty framing, not content padding.
 */
const disclaimerVariants: { body: string[] }[] = [
  {
    body: [
      CASE_DISCLAIMER,
      "We publish these because abstract percentages do not communicate what a price gap means to a household. A number like '98% cheaper' is forgettable. A monthly bill that drops from an impossible figure to an affordable one is not.",
      "Nothing here is a recommendation to change your own treatment. Every switch described was made with a prescriber's involvement, and yours should be too.",
    ],
  },
  {
    body: [
      CASE_DISCLAIMER,
      "Statistics alone cannot carry the weight of a decision about medicine. A line like 'the same course is 340 times cheaper' means nothing until you can see what it did to one household's bills, monitoring schedule and peace of mind.",
      "The only reason we show any switch is to illustrate a pattern. Your own move must be planned with your prescriber.",
    ],
  },
  {
    body: [
      CASE_DISCLAIMER,
      "Showing figures without a story leaves the real lesson out: these cases are about adherence that became possible again, monitoring that started up again, and rationing that stopped — not simply about a cheaper invoice.",
      "Discuss any change of medicine, dose or brand with a licensed clinician before acting on anything on this page.",
    ],
  },
];

let disclaimerCursor = 0;

function disclaimerSection(): ArticleSection {
  const variant = disclaimerVariants[disclaimerCursor % disclaimerVariants.length];
  disclaimerCursor += 1;

  return {
    id: "about-this-case",
    heading: "About this case study",
    paragraphs: [
      ...variant.body,
      "Jivan publishes pricing and educational information only. Do not start, stop, substitute or re-dose any medicine without a licensed physician's approval.",
    ],
  };
}

export const caseArticles: Article[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "case-2000-dollar-medicine-for-5-dollars",
    title: "Case Study: How a $2,000 Prescription Became $5 a Month",
    h1: "How a $2,000 monthly prescription became $5",
    metaDescription:
      "A composite case study showing how a patient on four high-cost chronic medicines reduced a $2,000 monthly bill to under $30 using same-salt generics — with the full arithmetic.",
    summary:
      "One household, four medicines, and the exact line-by-line arithmetic behind a 98% reduction in monthly prescription cost.",
    keywords: [
      "2000 dollar medicine for 5 dollars",
      "prescription cost case study",
      "medicine savings story",
      "cheap generic alternative",
    ],
    category: "Case Study",
    intent: "Reader has seen a dramatic savings claim and wants to see whether the arithmetic is real.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "98.6%", label: "reduction in monthly prescription cost" },
    snapshot: {
      patient: "Composite profile — 58-year-old with type 2 diabetes, hypertension and atrial fibrillation",
      country: "United States",
      condition: "Multiple chronic conditions",
      medicine: "Sitagliptin, apixaban, rosuvastatin, telmisartan",
      westernCost: "$2,046 per month",
      indianCost: "$28 per month",
      saving: "$24,216 per year",
    },
    sections: [
      {
        id: "situation",
        heading: "The situation",
        paragraphs: [
          "The patient in this composite profile is 58 years old, employed, and insured with a high-deductible plan. He takes four medicines daily: a DPP-4 inhibitor for diabetes, an anticoagulant following an atrial fibrillation diagnosis, a statin and an ARB.",
          "None of these are exotic. They are among the most commonly prescribed molecules in the world. Yet until the deductible was met each year, the combined out-of-pocket cost exceeded $2,000 a month.",
          "His response was the response most people have, and it is the dangerous one: he began taking the anticoagulant every other day to make the pack last twice as long, without telling anyone.",
        ],
        callout: {
          kind: "warning",
          title: "This part is the real emergency",
          body: "Halving an anticoagulant dose in atrial fibrillation materially increases stroke risk. The financial problem was serious; the rationing response was potentially fatal. This is why cost must be discussed openly with a prescriber.",
        },
      },
      {
        id: "arithmetic",
        heading: "The arithmetic, line by line",
        paragraphs: [
          "At a review appointment he disclosed the rationing. His physician's first action was to restore correct anticoagulant dosing. The second was to work through the list molecule by molecule against same-salt reference pricing.",
        ],
        table: {
          caption: "Monthly cost before and after same-salt substitution (USD, reference ranges)",
          head: ["Medicine", "Before", "After", "Reduction"],
          rows: [
            ["Sitagliptin 100 mg, 30 tablets", "$550", "$11.00", "98%"],
            ["Apixaban 5 mg, 60 tablets", "$620", "$9.00", "98.5%"],
            ["Rosuvastatin 10 mg, 30 tablets", "$98", "$2.10", "97.9%"],
            ["Telmisartan 40 mg, 30 tablets", "$180", "$1.50", "99.2%"],
            ["Insulin pen needles and strips", "$598", "$4.40", "99.3%"],
            ["Monthly total", "$2,046", "$28.00", "98.6%"],
          ],
        },
        callout: {
          kind: "fact",
          title: "Nothing about the treatment changed",
          body: "Same four active salts. Same four strengths. Same daily doses. The only variables that changed were the manufacturer and the market the product was priced in.",
        },
      },
      {
        id: "how",
        heading: "How the switch was actually managed",
        paragraphs: [
          "The physician did not switch everything at once. Anticoagulation carries the highest consequence of getting it wrong, so it was handled first and alone, with a clear monitoring plan.",
        ],
        numbered: [
          "Anticoagulant restored to the correct dose immediately, before any cost discussion continued.",
          "Manufacturer verification for each proposed product — company name, regulatory approvals, batch traceability.",
          "One substitution at a time, with two to three weeks between changes.",
          "Home blood-pressure log and a repeat lipid panel at eight weeks.",
          "HbA1c repeated at three months to confirm glycaemic control held.",
          "A written list kept of every product and batch number in use.",
        ],
      },
      {
        id: "outcome",
        heading: "The outcome",
        paragraphs: [
          "At the six-month review, blood pressure and lipid results were consistent with his previous readings, HbA1c was marginally improved, and — most importantly — he was taking the anticoagulant every single day as prescribed for the first time in over a year.",
          "The clinically significant outcome of this case is not the $24,216 saved. It is that a patient at elevated stroke risk stopped rationing a stroke-prevention medicine.",
        ],
        callout: {
          kind: "tip",
          title: "The transferable lesson",
          body: "The saving came from two ordinary steps: telling the prescriber the truth about affordability, and comparing each molecule individually rather than treating 'my medications' as a single unaffordable block.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Is a 98% reduction genuinely achievable?",
        a: "For off-patent molecules with many competing manufacturers, yes — this reflects documented price differences for identical active ingredients. For on-patent branded therapy the achievable reduction is usually far smaller, and patient assistance programmes matter more.",
      },
      {
        q: "Did the patient change any of his medicines?",
        a: "No. All four active salts, strengths and daily doses stayed exactly the same. Only the manufacturer and the pricing market changed.",
      },
      {
        q: "What was the most important step?",
        a: "Disclosing the rationing. Everything else followed from that conversation, and the rationing itself posed a greater risk than the financial problem.",
      },
    ],
    references: [SOURCES.fdaGenericFacts, SOURCES.kffCosts, SOURCES.nppa, SOURCES.medlineplus],
    tags: ["case study", "savings", "chronic disease", "adherence"],
    related: ["how-to-get-massive-discounts-on-medicines", "how-to-talk-to-your-doctor-about-medicine-costs", "are-indian-generic-medicines-safe"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-hepatitis-c-cure-84000-to-240",
    title: "Case Study: A Hepatitis C Cure — $84,000 vs $240",
    h1: "A hepatitis C cure that cost $84,000 in one country and $240 in another",
    metaDescription:
      "A composite case study of a 12-week hepatitis C cure, the licensing arrangement behind the price difference, and how the patient obtained treatment through a public programme.",
    summary:
      "The widest documented price gap in modern medicine, explained through one patient's 12-week treatment course.",
    keywords: [
      "hepatitis c cure cost case",
      "sofosbuvir 84000",
      "hepatitis c treatment story",
      "cheap hepatitis c cure",
    ],
    category: "Case Study",
    intent: "Reader with hepatitis C wants to understand real-world cost and access routes.",
    readingMinutes: 9,
    updatedAt: UPDATED,
    heroStat: { value: "~350×", label: "difference between US list price and licensed generic reference price" },
    snapshot: {
      patient: "Composite profile — 47-year-old diagnosed after routine liver enzyme testing",
      country: "United States",
      condition: "Chronic hepatitis C, genotype 1, no cirrhosis",
      medicine: "Sofosbuvir-based 12-week direct-acting antiviral regimen",
      westernCost: "~$84,000 per course (list)",
      indianCost: "~$240 per course (licensed generic reference)",
      saving: "Curative course moved from unaffordable to affordable",
    },
    sections: [
      {
        id: "diagnosis",
        heading: "Diagnosis",
        paragraphs: [
          "The patient was diagnosed incidentally when routine blood tests showed raised liver enzymes. Confirmatory HCV RNA testing established chronic infection with genotype 1, and fibrosis assessment showed no cirrhosis.",
          "The clinical news was good: modern direct-acting antivirals cure more than 95% of people with a finite 8 to 12 week oral course, and WHO documents these cure rates. There is no lifelong therapy involved. It is a defined course with a defined endpoint.",
          "The financial news was not. The list price quoted for the recommended regimen was approximately $84,000 for 12 weeks — a figure that became a global reference point in the medicine pricing debate.",
        ],
      },
      {
        id: "gap",
        heading: "Why the identical molecule costs $240 elsewhere",
        paragraphs: [
          "The active ingredients in these regimens are not expensive to manufacture at scale. The price difference is a function of patent status and licensing territory, not production cost.",
          "The originator granted voluntary licences allowing named generic manufacturers — several based in India — to produce and supply the molecule across a defined list of countries. The Medicines Patent Pool documents this licensing model and its measured public-health impact.",
          "This is authorised parallel supply, not a grey market. The same molecule, produced under licence, legitimately sells for a few hundred dollars per course in those territories.",
        ],
        callout: {
          kind: "fact",
          title: "A cure has a ceiling",
          body: "Unlike chronic suppression therapy, a hepatitis C course ends. That makes the pricing question unusually stark: the barrier to eliminating a curable infection is very often the price of a finite number of tablets.",
        },
      },
      {
        id: "route",
        heading: "The route the patient actually took",
        paragraphs: [
          "He did not import anything. His hepatologist referred him to a state hepatitis C elimination programme, which had negotiated bulk pricing and covered treatment for eligible residents.",
          "This matters, because the instinctive reaction to a price gap is to look abroad. In this case the domestic public programme was faster, fully supervised, and cost him nothing.",
        ],
        numbered: [
          "Hepatologist confirmed genotype and fibrosis stage.",
          "Hepatitis B screening completed, since reactivation is a recognised risk during therapy.",
          "Full drug-interaction review against his other medicines.",
          "Referral to the state elimination programme and eligibility assessment.",
          "Twelve-week course completed with adherence support.",
          "Sustained virological response confirmed by testing 12 weeks after completion.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The post-treatment test confirmed sustained virological response — cure. He requires ongoing liver health monitoring, but the chronic infection is gone and the risk trajectory toward cirrhosis and liver cancer is fundamentally altered.",
          "The lesson generalises beyond hepatitis C. When a medicine looks unaffordable, the correct first question is not 'where can I buy this cheaper' but 'what public programme, assistance scheme or licensed pathway already exists for this exact condition'.",
        ],
        callout: {
          kind: "tip",
          title: "Ask about elimination programmes first",
          body: "Many countries run hepatitis C elimination programmes providing treatment at little or no cost to eligible patients. A hepatologist or national liver charity can confirm eligibility in a single conversation.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Is hepatitis C genuinely curable?",
        a: "Yes. Direct-acting antiviral regimens cure over 95% of treated people within 8 to 12 weeks, confirmed by an undetectable viral load sustained after treatment ends.",
      },
      {
        q: "Why is the generic version legal?",
        a: "Voluntary licences from the patent holder authorise named manufacturers to produce and supply the molecule in a defined list of territories. Within those territories it is fully authorised supply, not counterfeit or diverted product.",
      },
      {
        q: "Should I import hepatitis C medicine myself?",
        a: "Speak to a hepatologist first. Treatment requires genotype assessment, fibrosis staging, hepatitis B screening, interaction review and post-treatment confirmation of cure. Many patients also qualify for free domestic programmes they were unaware of.",
      },
    ],
    references: [SOURCES.whoHepatitis, SOURCES.mpp, SOURCES.globalFund, SOURCES.medlineplus],
    tags: ["case study", "hepatitis c", "licensing", "cure"],
    related: ["hepatitis-c-treatment-cost-guide", "why-us-drug-prices-are-the-highest-in-the-world", "where-to-buy-cheapest-safe-medications"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-breast-cancer-trastuzumab-savings",
    title: "Case Study: HER2 Breast Cancer Treatment at a Fraction of the Cost",
    h1: "How a full year of HER2 breast cancer therapy became affordable",
    metaDescription:
      "A composite case study of HER2-positive breast cancer treatment showing how biosimilar trastuzumab and generic supportive care reduced a year of therapy cost without changing the protocol.",
    summary:
      "A full year of trastuzumab plus supportive care, and how biosimilars changed what that year costs.",
    keywords: [
      "trastuzumab cost",
      "herceptin biosimilar price",
      "breast cancer treatment cost",
      "affordable cancer therapy",
    ],
    category: "Case Study",
    intent: "Patient or family facing HER2 breast cancer treatment costs.",
    readingMinutes: 9,
    updatedAt: UPDATED,
    heroStat: { value: "~82%", label: "reduction across a full year of therapy and supportive care" },
    snapshot: {
      patient: "Composite profile — 44-year-old, HER2-positive early breast cancer",
      country: "Germany, treated privately for part of the pathway",
      condition: "HER2-positive breast cancer, adjuvant therapy",
      medicine: "Trastuzumab, docetaxel, pegfilgrastim, zoledronic acid, ondansetron",
      westernCost: "~$61,000 for 12 months",
      indianCost: "~$11,000 equivalent reference basket",
      saving: "~$50,000 across the treatment year",
    },
    sections: [
      {
        id: "protocol",
        heading: "The protocol, and what could not change",
        paragraphs: [
          "HER2-positive breast cancer is treated with targeted anti-HER2 therapy alongside chemotherapy, typically continuing for around twelve months in the adjuvant setting. The schedule is evidence-based and dose intensity matters.",
          "The first principle established with her oncologist was that the protocol itself was not negotiable. No delayed cycles, no reduced doses, no omitted supportive medicines. Cost management had to operate entirely inside the clinical plan.",
        ],
        callout: {
          kind: "warning",
          title: "Why this constraint is absolute",
          body: "In curative-intent oncology, delaying or reducing treatment to spread cost can reduce the probability of cure. A financial saving that lowers cure probability is not a saving.",
        },
      },
      {
        id: "where",
        heading: "Where the cost actually sat",
        paragraphs: [
          "Itemising the year revealed something the family had not expected: supportive care was almost a third of the total. Growth-factor support, bone-protective therapy and anti-emetics together approached the cost of the chemotherapy agent itself.",
        ],
        table: {
          caption: "Annual therapy cost by component (USD, reference ranges)",
          head: ["Component", "Originator basis", "Biosimilar / generic basis", "Reduction"],
          rows: [
            ["Trastuzumab (year of therapy)", "~$34,000", "~$6,200", "82%"],
            ["Docetaxel (6 cycles)", "~$5,800", "~$260", "96%"],
            ["Pegfilgrastim (6 doses)", "~$37,200", "~$660", "98%"],
            ["Zoledronic acid (12 doses)", "~$7,400", "~$220", "97%"],
            ["Ondansetron and anti-emetics", "~$1,900", "~$140", "93%"],
          ],
        },
        callout: {
          kind: "fact",
          title: "Biosimilars did the heavy lifting",
          body: "Trastuzumab, bevacizumab and rituximab all have approved biosimilars. Regulators approve these only after demonstrating no clinically meaningful differences from the reference product in quality, safety and efficacy.",
        },
      },
      {
        id: "decisions",
        heading: "The decisions taken",
        paragraphs: [
          "Her oncology centre already used biosimilar trastuzumab as standard, which she had not realised. The remaining changes were made to supportive care, where generic equivalents were straightforward.",
        ],
        numbered: [
          "Confirmed the centre's biosimilar trastuzumab policy and the specific product used.",
          "Switched growth-factor support to a generic equivalent with the oncologist's agreement.",
          "Moved bone-protective therapy to generic zoledronic acid.",
          "Switched anti-emetics to generic ondansetron and generic aprepitant.",
          "Applied to a breast cancer charity for travel and accommodation support.",
          "Recorded product and batch numbers at every administration for pharmacovigilance.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "She completed all planned cycles on schedule, with no delays attributable to cost. Cardiac monitoring during anti-HER2 therapy remained within acceptable limits, and the protocol finished as designed.",
          "The financial navigator at her centre — a role she had not known existed until she asked — handled two of the charity applications. That single question, asked at the second appointment rather than the tenth, was worth several thousand dollars.",
        ],
        callout: {
          kind: "tip",
          title: "Ask about supportive care first",
          body: "Families often assume the headline cancer drug is the only place savings exist. Supportive medicines are frequently a third of the total and are usually the easiest component to substitute safely.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Are biosimilar cancer drugs equivalent to the originator?",
        a: "Regulators approve biosimilars only after a comparability programme demonstrates no clinically meaningful differences in quality, safety and efficacy. Many cancer centres use them as the default option.",
      },
      {
        q: "Can supportive care medicines be safely substituted?",
        a: "Generic equivalents of anti-emetics, growth factors and bone agents are widely used. The decision belongs to the oncology team, but it is usually straightforward and is frequently the largest available saving.",
      },
      {
        q: "What is a financial navigator?",
        a: "A staff member at many cancer centres whose job is to connect patients with assistance programmes, charitable grants and hardship funds. Ask at your first or second appointment rather than waiting.",
      },
    ],
    references: [SOURCES.emaBiosimilar, SOURCES.fdaGenericFacts, SOURCES.whoEml, SOURCES.medlineplus],
    tags: ["case study", "oncology", "biosimilars", "breast cancer"],
    related: ["cancer-medication-cost-guide", "biosimilars-vs-generics-explained", "patient-assistance-and-discount-programs"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-insulin-family-annual-savings",
    title: "Case Study: A Family With Two Diabetics Cut Insulin Costs 88%",
    h1: "How one family cut its annual insulin bill by 88%",
    metaDescription:
      "A composite case study of a household with two insulin-dependent members, showing how biosimilar switching, delivery changes and assistance programmes ended dangerous rationing.",
    summary:
      "Two insulin-dependent family members, one budget, and the changes that stopped the rationing.",
    keywords: [
      "insulin cost case study",
      "family insulin savings",
      "insulin rationing",
      "affordable insulin story",
    ],
    category: "Case Study",
    intent: "Family struggling with insulin affordability wants a realistic worked example.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "88%", label: "reduction in annual household insulin cost" },
    snapshot: {
      patient: "Composite profile — father (type 2) and teenage daughter (type 1)",
      country: "United States",
      condition: "Insulin-dependent diabetes, two household members",
      medicine: "Insulin glargine, insulin aspart, pen needles, test strips, CGM sensors",
      westernCost: "~$9,400 per year",
      indianCost: "~$1,130 per year equivalent basket",
      saving: "~$8,270 per year",
    },
    sections: [
      {
        id: "situation",
        heading: "The situation",
        paragraphs: [
          "Two insulin-dependent people in one household on a single insurance plan with a substantial deductible. Basal and rapid-acting insulin for both, plus consumables — pen needles, test strips and continuous glucose monitoring sensors for the daughter.",
          "The father had started quietly reducing his own basal dose so his daughter's supply would never be interrupted. His HbA1c had drifted upward over eighteen months and neither he nor his physician had connected that trend to cost.",
        ],
        callout: {
          kind: "warning",
          title: "Insulin rationing is a medical emergency risk",
          body: "Reducing or skipping insulin can precipitate diabetic ketoacidosis, which is life-threatening. Anyone in this position should contact their prescriber or pharmacist immediately rather than continuing to ration.",
        },
      },
      {
        id: "changes",
        heading: "The five changes that worked",
        paragraphs: [
          "The diabetes team addressed this across two appointments. Every change was clinical, and glucose monitoring was intensified during the transition.",
        ],
        numbered: [
          "Enrolled both members in manufacturer insulin cost-cap programmes they were eligible for but had never applied to.",
          "Switched the father's basal insulin to a biosimilar glargine with the endocrinologist's agreement.",
          "Moved the father from prefilled pens to vial-and-syringe delivery after a technique assessment.",
          "Consolidated to 90-day supplies instead of monthly fills.",
          "Sourced pen needles and test strips as unbranded equivalents rather than the branded originals.",
        ],
        table: {
          caption: "Annual household cost before and after (USD, reference ranges)",
          head: ["Item", "Before", "After", "Reduction"],
          rows: [
            ["Insulin glargine (both members)", "$3,360", "$410", "88%"],
            ["Insulin aspart (both members)", "$3,120", "$380", "88%"],
            ["Pen needles and syringes", "$540", "$62", "89%"],
            ["Test strips", "$1,180", "$140", "88%"],
            ["CGM sensors", "$1,200", "$138", "89%"],
            ["Annual total", "$9,400", "$1,130", "88%"],
          ],
        },
      },
      {
        id: "monitoring",
        heading: "How the transition was monitored",
        paragraphs: [
          "Insulin changes require close observation. The team set a structured two-week protocol before either member changed product.",
        ],
        bullets: [
          "Increased glucose checks for two weeks after each change, including overnight readings.",
          "A written hypoglycaemia action plan for both members and for the school.",
          "One change at a time, never both members simultaneously.",
          "Telephone review at seven days and clinic review at four weeks.",
          "HbA1c repeated at three months for both.",
        ],
        callout: {
          kind: "tip",
          title: "The overlooked step was the simplest",
          body: "The single largest saving came from enrolling in manufacturer cost-cap programmes they already qualified for. Nobody had ever mentioned them, and they had never asked.",
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "At the three-month review, the father's HbA1c had improved for the first time in two years — not because of a better insulin, but because he was finally taking the full prescribed dose. His daughter's control remained stable throughout.",
          "The clinically important result was the end of rationing. The financial result made that possible.",
        ],
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Is biosimilar insulin safe to switch to?",
        a: "Biosimilars are approved after demonstrating no clinically meaningful differences from the reference product. Switching should be prescriber-led with intensified glucose monitoring for the first weeks.",
      },
      {
        q: "Are vials really cheaper than pens?",
        a: "Usually yes, per unit of insulin. The trade-off is that drawing up requires adequate dexterity, vision and technique, so it needs an assessment before switching.",
      },
      {
        q: "What should I do tonight if I cannot afford tomorrow's insulin?",
        a: "Contact your prescriber or a pharmacist immediately and say you cannot afford it. Emergency supply mechanisms, manufacturer programmes and clinic samples exist for exactly this situation. Do not ration.",
      },
    ],
    references: [SOURCES.whoDiabetes, SOURCES.emaBiosimilar, SOURCES.kffCosts, SOURCES.medlineplus],
    tags: ["case study", "insulin", "diabetes", "family"],
    related: ["insulin-cost-saving-guide", "patient-assistance-and-discount-programs", "cold-chain-medicine-shipping-guide"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-multiple-sclerosis-treatment-cost",
    title: "Case Study: Multiple Sclerosis Therapy — $96,000 to $1,140 a Year",
    h1: "A year of multiple sclerosis therapy: $96,000 versus $1,140",
    metaDescription:
      "A composite case study of relapsing MS treatment showing the price gap in disease-modifying therapy and the monitoring plan that made a supervised switch safe.",
    summary:
      "Disease-modifying therapy for MS is lifelong. Over a lifetime, the price difference compounds into an extraordinary figure.",
    keywords: [
      "multiple sclerosis treatment cost",
      "fingolimod price",
      "MS drug cost",
      "affordable MS therapy",
    ],
    category: "Case Study",
    intent: "MS patient facing indefinite high-cost therapy wants to understand options.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "$94,860", label: "annual difference for one disease-modifying therapy" },
    snapshot: {
      patient: "Composite profile — 34-year-old with relapsing-remitting MS",
      country: "United States",
      condition: "Relapsing-remitting multiple sclerosis",
      medicine: "Fingolimod 0.5 mg daily",
      westernCost: "~$96,000 per year",
      indianCost: "~$1,140 per year reference",
      saving: "~$94,860 per year",
    },
    sections: [
      {
        id: "problem",
        heading: "The problem with lifelong therapy",
        paragraphs: [
          "Disease-modifying therapy in relapsing MS is not a course. It continues for years, often decades, to reduce relapse frequency and slow disability accumulation.",
          "That changes the arithmetic entirely. A cost that is merely painful for twelve weeks becomes structurally impossible over twenty years. At list pricing, two decades of one oral disease-modifying therapy approaches two million dollars.",
          "The patient in this profile was insured, but a plan change moved her therapy to a specialty tier with coinsurance that made continuation unaffordable. She had begun taking the capsule every other day.",
        ],
        callout: {
          kind: "warning",
          title: "Why alternate-day dosing was dangerous here",
          body: "Disease-modifying therapies work through sustained pharmacological effect. Irregular dosing can reduce efficacy and, with some agents, discontinuation carries a risk of rebound disease activity. This required urgent neurologist input.",
        },
      },
      {
        id: "options",
        heading: "The options her neurologist laid out",
        paragraphs: [
          "Rather than a single answer, the neurologist presented four routes and their trade-offs. This is the conversation worth replicating.",
        ],
        table: {
          caption: "Options considered for continuing disease-modifying therapy",
          head: ["Option", "Annual cost", "Trade-off"],
          rows: [
            ["Continue branded fingolimod", "~$96,000", "Financially impossible"],
            ["Manufacturer assistance programme", "$0 if approved", "Income tested; approval not guaranteed"],
            ["Switch to a different DMT class", "Varies widely", "Requires washout and new risk profile"],
            ["Same-salt generic fingolimod", "~$1,140 reference", "Requires verification and supervision"],
          ],
        },
      },
      {
        id: "process",
        heading: "The process followed",
        paragraphs: [
          "The assistance programme application was submitted first, because a free supply from the originator would have been the simplest outcome. While it was pending, the correct daily dose was restored using existing stock.",
        ],
        numbered: [
          "Correct daily dosing restored immediately — the alternate-day pattern stopped that week.",
          "Manufacturer assistance application submitted with the clinic's help.",
          "Manufacturer verification carried out for the generic option in parallel.",
          "Baseline bloods, liver function and ophthalmological assessment documented before any change.",
          "Cardiac monitoring arrangements confirmed, as required for this agent class.",
          "MRI scheduled at six months to compare lesion activity objectively.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The assistance application was partially approved, covering a defined period. She used that window to complete verification of a same-salt option with her neurologist so that continuity was assured when the assistance period ended.",
          "At six months, MRI showed no new lesion activity and she had experienced no relapse. Crucially, she had taken her therapy every single day for the first time in eight months.",
        ],
        callout: {
          kind: "tip",
          title: "Apply for assistance even if you expect refusal",
          body: "Partial or time-limited approval is common and buys the breathing room to arrange a sustainable long-term route without a treatment gap. The application costs nothing but time.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Can MS disease-modifying therapy be stopped to save money?",
        a: "Stopping should only ever be a neurologist's decision. Some agents carry a risk of rebound disease activity after discontinuation, and unplanned interruption can allow relapse.",
      },
      {
        q: "Are generic MS therapies available?",
        a: "Several oral disease-modifying therapies including fingolimod, dimethyl fumarate and teriflunomide now have generic versions in various markets. Injectable and infused biologics follow the biosimilar pathway instead.",
      },
      {
        q: "What monitoring is needed after switching?",
        a: "It depends on the agent, but typically baseline and follow-up bloods, liver function, specific cardiac or ophthalmological checks for certain drugs, and interval MRI to assess disease activity objectively.",
      },
    ],
    references: [SOURCES.emaGenerics, SOURCES.fdaOrangeBook, SOURCES.medlineplus, SOURCES.kffCosts],
    tags: ["case study", "multiple sclerosis", "neurology", "lifelong therapy"],
    related: ["patient-assistance-and-discount-programs", "how-to-talk-to-your-doctor-about-medicine-costs", "are-indian-generic-medicines-safe"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-epipen-adrenaline-emergency-cost",
    title: "Case Study: Adrenaline for Anaphylaxis — $650 vs $45",
    h1: "Adrenaline auto-injectors: why the same drug costs $650 or $45",
    metaDescription:
      "A composite case study on adrenaline auto-injector pricing, why the device rather than the drug drives cost, and how one family kept adequate emergency cover.",
    summary:
      "Adrenaline costs cents. The auto-injector device is what costs hundreds — and that distinction has real safety consequences.",
    keywords: [
      "epipen cost",
      "adrenaline auto injector price",
      "anaphylaxis emergency cost",
      "cheap epinephrine",
    ],
    category: "Case Study",
    intent: "Parent or allergy patient needs adequate emergency cover but cannot afford multiple devices.",
    readingMinutes: 7,
    updatedAt: UPDATED,
    heroStat: { value: "~14×", label: "price difference for the same active drug in different presentations" },
    snapshot: {
      patient: "Composite profile — family with a 9-year-old with severe peanut allergy",
      country: "United States",
      condition: "Anaphylaxis risk requiring emergency adrenaline",
      medicine: "Adrenaline (epinephrine) auto-injector",
      westernCost: "~$650 per two-pack",
      indianCost: "~$45 reference equivalent",
      saving: "Adequate cover at home, school and in transit",
    },
    sections: [
      {
        id: "problem",
        heading: "The coverage problem",
        paragraphs: [
          "Anaphylaxis guidance generally recommends immediate access to adrenaline wherever the person is. For a school-age child that realistically means several devices: home, school, the parent's bag and any regular activity setting.",
          "Auto-injectors also expire, typically within twelve to eighteen months, so the cost recurs annually regardless of whether a device is ever used.",
          "This family carried a single two-pack and moved it between locations. That is a rational financial decision and a poor safety decision, because the device is only useful if it is present at the moment of the reaction.",
        ],
        callout: {
          kind: "warning",
          title: "One device in the wrong place is zero devices",
          body: "Anaphylaxis can progress within minutes. A device at home does not help during a reaction at school. Adequate coverage means a device wherever the person actually is.",
        },
      },
      {
        id: "device",
        heading: "The drug is cheap; the device is not",
        paragraphs: [
          "Adrenaline is an old, off-patent molecule that costs very little to produce. A plain ampoule of adrenaline solution is inexpensive almost everywhere in the world.",
          "What is expensive is the auto-injector: a spring-loaded device engineered so an untrained, panicking bystander can deliver a correct intramuscular dose through clothing without hesitation. That device carries its own patents and its own price.",
        ],
        table: {
          caption: "Presentations of the same active drug (USD, reference ranges)",
          head: ["Presentation", "Reference price", "Who can realistically use it"],
          rows: [
            ["Branded auto-injector two-pack", "~$650", "Anyone, including untrained bystanders"],
            ["Generic auto-injector two-pack", "~$300", "Anyone, including untrained bystanders"],
            ["Reference-market auto-injector", "~$45", "Anyone, including untrained bystanders"],
            ["Adrenaline ampoule and syringe", "~$3", "Trained users only"],
          ],
        },
        callout: {
          kind: "warning",
          title: "Ampoules are not a substitute for most families",
          body: "Drawing up and injecting the correct dose from an ampoule during anaphylaxis requires training and composure that most bystanders will not have. The device is not a luxury; for untrained users it is the point.",
        },
      },
      {
        id: "solution",
        heading: "What the family did",
        paragraphs: [
          "The allergist's approach prioritised coverage over brand.",
        ],
        numbered: [
          "Switched from the branded auto-injector to an authorised generic auto-injector with identical delivery.",
          "Obtained enough devices for home, school and the parent's bag rather than a single shared pack.",
          "Registered for the manufacturer's savings programme.",
          "Set calendar reminders for expiry dates on every individual device.",
          "Completed an anaphylaxis action plan with the school, including training on the specific device.",
          "Confirmed the school held its own stock device as a backup.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The family moved from one shared two-pack to six devices distributed across the locations the child actually spends time in — for less than the previous annual cost of the single branded pack.",
          "The safety improvement here is not financial. It is that adrenaline is now physically present wherever the child is.",
        ],
        callout: {
          kind: "tip",
          title: "Always call emergency services after use",
          body: "Adrenaline buys time; it is not definitive treatment. Anaphylaxis can rebound after the initial dose, so emergency medical assessment is required every time a device is used.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Are generic auto-injectors as reliable as the brand?",
        a: "Authorised generic auto-injectors deliver the same drug and dose. Devices differ in activation mechanism, so anyone who may need to use it — including school staff — must be trained on the specific device the patient carries.",
      },
      {
        q: "Can I use an expired auto-injector?",
        a: "Use an in-date device whenever possible. In a genuine emergency with no alternative, using an expired device is generally considered better than withholding adrenaline — but call emergency services immediately and replace expired devices promptly.",
      },
      {
        q: "How many devices should we have?",
        a: "Follow your allergist's advice, but the principle is coverage wherever the person is. For a school-age child that usually means home, school and a carried device at minimum.",
      },
    ],
    references: [SOURCES.medlineplus, SOURCES.fdaGenericFacts, SOURCES.whoEml, SOURCES.kffCosts],
    tags: ["case study", "anaphylaxis", "emergency", "devices"],
    related: ["how-to-get-massive-discounts-on-medicines", "patient-assistance-and-discount-programs", "annual-medicine-budget-planning"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-hiv-treatment-lifetime-cost",
    title: "Case Study: HIV Treatment — $36,000 a Year vs $110",
    h1: "HIV antiretroviral therapy: $36,000 a year versus $110",
    metaDescription:
      "A composite case study on HIV treatment costs, how licensing and pooled procurement transformed global access, and why adherence matters more than any saving.",
    summary:
      "HIV therapy is the clearest proof that licensing and competition can collapse the price of a lifelong medicine without changing the molecule.",
    keywords: [
      "hiv treatment cost",
      "antiretroviral price",
      "hiv medication cost",
      "affordable hiv treatment",
    ],
    category: "Case Study",
    intent: "Person with HIV or a caregiver researching long-term treatment affordability.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "~300×", label: "difference in annual cost of a single-tablet regimen" },
    snapshot: {
      patient: "Composite profile — 31-year-old newly diagnosed, no prior treatment",
      country: "United States",
      condition: "HIV, treatment-naive",
      medicine: "Tenofovir + lamivudine + dolutegravir single-tablet regimen",
      westernCost: "~$36,000 per year",
      indianCost: "~$110 per year reference",
      saving: "Lifelong therapy becomes structurally affordable",
    },
    sections: [
      {
        id: "context",
        heading: "Why HIV is the reference case for access",
        paragraphs: [
          "Modern antiretroviral therapy converts HIV into a manageable chronic condition. With sustained viral suppression, life expectancy approaches that of the general population, and a person with an undetectable viral load does not transmit the virus sexually.",
          "That makes treatment both an individual and a public-health intervention — which is precisely why global access mechanisms were built for it earlier and more comprehensively than for almost any other disease.",
          "Voluntary licensing, pooled procurement and generic competition reduced the annual cost of first-line therapy from thousands of dollars to a low double-digit figure in supplied countries. UNAIDS and the Global Fund document that trajectory.",
        ],
        callout: {
          kind: "fact",
          title: "The molecule never changed",
          body: "The same active ingredients that cost tens of thousands annually at branded pricing are supplied for around $110 per patient-year in licensed markets. The difference is licensing, procurement scale and competition — not chemistry.",
        },
      },
      {
        id: "diagnosis",
        heading: "The patient's situation",
        paragraphs: [
          "Newly diagnosed, employed, insured with a high-deductible plan, and quoted a specialty-tier cost that made the first months of therapy unaffordable at the exact moment treatment should begin promptly.",
          "Delay is the specific risk here. Early treatment initiation improves outcomes and reduces transmission, so a financial barrier at diagnosis has consequences beyond the individual.",
        ],
      },
      {
        id: "route",
        heading: "The route taken",
        paragraphs: [
          "His clinic connected him to programmes that exist precisely for this gap. He did not import anything.",
        ],
        numbered: [
          "Same-week treatment initiation using clinic-held starter supply.",
          "Enrolment in a national HIV medication assistance programme.",
          "Application to the manufacturer's patient assistance scheme as a parallel route.",
          "Switch to a generic single-tablet regimen once available on his formulary.",
          "Viral load monitoring at defined intervals to confirm suppression.",
          "Adherence support, since single-tablet regimens depend on consistent daily dosing.",
        ],
        table: {
          caption: "Annual first-line regimen cost by route (USD, reference ranges)",
          head: ["Route", "Annual cost", "Notes"],
          rows: [
            ["Branded single-tablet regimen", "~$36,000", "List pricing before assistance"],
            ["Generic single-tablet regimen", "~$4,800", "Where generics available on formulary"],
            ["Assistance programme", "$0–$600", "Income tested"],
            ["Licensed generic reference market", "~$110", "Under voluntary licence"],
          ],
        },
      },
      {
        id: "adherence",
        heading: "Why adherence outranks cost here",
        paragraphs: [
          "HIV therapy is unforgiving of irregular dosing. Inconsistent adherence allows viral replication in the presence of drug, which selects for resistance — and resistance narrows future options and pushes you toward more expensive second-line regimens.",
          "So the cost strategy and the clinical strategy point the same way: whatever route makes daily uninterrupted dosing sustainable for years is the correct one, even if a marginally cheaper route exists.",
        ],
        callout: {
          kind: "warning",
          title: "Never interrupt to save money",
          body: "A treatment interruption can cost far more than it saves by driving resistance and forcing a switch to costlier second-line therapy. Speak to your clinic before you run out, not after.",
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "He achieved an undetectable viral load within the expected timeframe and has maintained it. The assistance programme covered the initial period; the generic regimen made continuation sustainable.",
          "The general lesson is that for HIV specifically, well-developed access infrastructure already exists in most countries. The first step is asking the clinic what is available, not searching for a cheaper supplier.",
        ],
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Why is HIV medicine so cheap in some countries?",
        a: "Voluntary licensing agreements, pooled procurement by international funders and intense generic competition together reduced first-line therapy costs dramatically in supplied countries.",
      },
      {
        q: "Are generic antiretrovirals equivalent?",
        a: "Generic antiretrovirals used in international programmes are typically WHO-prequalified and are the backbone of global HIV treatment for millions of people.",
      },
      {
        q: "What happens if I miss doses?",
        a: "Inconsistent adherence risks viral rebound and drug resistance, which narrows future treatment options. If cost is threatening your adherence, tell your clinic immediately — assistance mechanisms exist for this.",
      },
    ],
    references: [SOURCES.unaids, SOURCES.globalFund, SOURCES.mpp, SOURCES.whoPrequal],
    tags: ["case study", "hiv", "licensing", "adherence"],
    related: ["hepatitis-c-treatment-cost-guide", "patient-assistance-and-discount-programs", "where-to-buy-cheapest-safe-medications"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-rheumatoid-arthritis-biologic-savings",
    title: "Case Study: Rheumatoid Arthritis Biologic — $62,000 to $5,300",
    h1: "Rheumatoid arthritis biologic therapy at a fraction of the cost",
    metaDescription:
      "A composite case study of RA treatment showing how biosimilar adalimumab and generic conventional DMARDs preserved remission while cutting annual cost by over 90%.",
    summary:
      "Biosimilar competition in rheumatology is one of the clearest recent examples of price falling without treatment changing.",
    keywords: [
      "rheumatoid arthritis cost",
      "adalimumab biosimilar price",
      "humira cost",
      "affordable biologic therapy",
    ],
    category: "Case Study",
    intent: "RA patient on an expensive biologic wants to know whether a cheaper equivalent is safe.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "91%", label: "reduction in annual therapy cost while remaining in remission" },
    snapshot: {
      patient: "Composite profile — 52-year-old, seropositive rheumatoid arthritis in remission",
      country: "United Kingdom, private supplementary treatment",
      condition: "Rheumatoid arthritis",
      medicine: "Adalimumab plus methotrexate and folic acid",
      westernCost: "~$62,000 per year",
      indianCost: "~$5,300 per year reference",
      saving: "~$56,700 per year",
    },
    sections: [
      {
        id: "situation",
        heading: "Stable disease, unstable finances",
        paragraphs: [
          "After several years of escalating therapy, this patient reached sustained remission on a TNF inhibitor combined with low-dose weekly methotrexate. Remission in RA is valuable and fragile; the priority was not to disturb it.",
          "A change in her supplementary coverage moved a substantial share of the biologic cost to her directly. She considered extending her injection interval to make each pen last longer.",
        ],
        callout: {
          kind: "warning",
          title: "Interval extension is a clinical decision",
          body: "Some rheumatology services do taper biologic frequency in sustained remission — but as a monitored, protocolised decision with defined flare criteria, not as an unsupervised cost measure. Self-directed extension risks losing remission, and regaining it is not guaranteed.",
        },
      },
      {
        id: "biosimilar",
        heading: "The biosimilar switch",
        paragraphs: [
          "Adalimumab biosimilars have been widely adopted across European rheumatology services since the reference product lost exclusivity. Her rheumatology team had a structured switching pathway already in place.",
          "Biosimilars are approved only after a comparability programme demonstrates no clinically meaningful differences from the reference product in quality, safety and efficacy.",
        ],
        table: {
          caption: "Annual therapy cost components (USD, reference ranges)",
          head: ["Component", "Before", "After", "Reduction"],
          rows: [
            ["Adalimumab 40 mg, every 2 weeks", "~$59,600", "~$4,900", "92%"],
            ["Methotrexate 15 mg weekly", "~$1,900", "~$290", "85%"],
            ["Folic acid", "~$180", "~$22", "88%"],
            ["Monitoring bloods", "~$320", "~$88", "73%"],
            ["Annual total", "~$62,000", "~$5,300", "91%"],
          ],
        },
      },
      {
        id: "protocol",
        heading: "The switching protocol",
        paragraphs: [
          "Rheumatology biosimilar switching is well-established and follows a consistent pattern worth knowing about.",
        ],
        numbered: [
          "Baseline disease activity score recorded before the switch.",
          "Patient education on the new injection device, which differed from the original.",
          "Switch made at a scheduled dose with no gap in therapy.",
          "Disease activity reassessed at 12 weeks.",
          "Injection-site reactions and any new symptoms reported actively.",
          "Product name and batch number recorded at every administration.",
        ],
        callout: {
          kind: "tip",
          title: "The device is the thing patients notice",
          body: "Biosimilar switches most often generate complaints about the injection device — grip, needle visibility, injection force, audible click — rather than about efficacy. Device training at the point of switch prevents most of these.",
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "Disease activity at 12 weeks was unchanged and remission was maintained at the twelve-month review. She reported the new device as slightly less comfortable but manageable after training.",
          "Because the biologic was now affordable, she also stopped skipping the monitoring blood tests she had been deferring to save money — an unplanned safety improvement.",
        ],
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Will switching to a biosimilar cause a flare?",
        a: "Structured switching programmes in rheumatology have been widely implemented, with disease activity monitored before and after. Discuss the evidence and the monitoring plan with your rheumatology team.",
      },
      {
        q: "Can I extend my injection interval to save money?",
        a: "Only under rheumatology supervision. Some services taper frequency in sustained remission as a monitored protocol with defined flare criteria. Doing it unsupervised risks losing remission.",
      },
      {
        q: "Why record the batch number every time?",
        a: "Biologic pharmacovigilance is product-specific. If an adverse event occurs, the exact product and batch must be identifiable, which is why biologics are not treated like interchangeable small-molecule generics.",
      },
    ],
    references: [SOURCES.emaBiosimilar, SOURCES.mhra, SOURCES.medlineplus, SOURCES.fdaGenericFacts],
    tags: ["case study", "rheumatology", "biosimilars", "remission"],
    related: ["biosimilars-vs-generics-explained", "cancer-medication-cost-guide", "patient-assistance-and-discount-programs"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-child-leukemia-imatinib",
    title: "Case Study: Childhood Leukaemia — Imatinib at 1% of the Price",
    h1: "Imatinib for childhood leukaemia at one percent of the price",
    metaDescription:
      "A composite case study following a family managing chronic myeloid leukaemia therapy for a child, and how generic imatinib made indefinite treatment sustainable.",
    summary:
      "A targeted therapy that turned a fatal leukaemia into a manageable condition — and the price collapse that followed patent expiry.",
    keywords: [
      "imatinib cost",
      "gleevec price",
      "childhood leukemia treatment cost",
      "cml treatment affordable",
    ],
    category: "Case Study",
    intent: "Family facing indefinite targeted-therapy costs for a child.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "~87×", label: "difference between branded and generic reference pricing" },
    snapshot: {
      patient: "Composite profile — 11-year-old with chronic myeloid leukaemia",
      country: "Spain, with family originally from outside the EU",
      condition: "Chronic myeloid leukaemia, chronic phase",
      medicine: "Imatinib 400 mg daily",
      westernCost: "~$126,000 per year (branded reference)",
      indianCost: "~$1,440 per year reference",
      saving: "Indefinite therapy becomes sustainable",
    },
    sections: [
      {
        id: "background",
        heading: "A disease transformed by one molecule",
        paragraphs: [
          "Chronic myeloid leukaemia was, within living memory, a disease with a poor prognosis. The arrival of imatinib — a targeted inhibitor of the specific abnormal protein driving the disease — changed that fundamentally, with many patients achieving long-term disease control on continuing oral therapy.",
          "The corollary is that therapy is typically indefinite. For a child diagnosed at eleven, the relevant time horizon is decades, and at branded pricing the lifetime figure becomes almost unreadable.",
        ],
        callout: {
          kind: "fact",
          title: "Patent expiry did what competition always does",
          body: "Imatinib's core patents expired in major markets during the 2010s. Multiple manufacturers entered, and prices fell by well over 90% in most markets — the standard pattern when many suppliers compete on an identical molecule.",
        },
      },
      {
        id: "problem",
        heading: "The family's specific problem",
        paragraphs: [
          "The child's treatment was covered under the national system, but the family faced a period of transition in residency status during which coverage was uncertain. They needed to guarantee no interruption in therapy during that window.",
          "In CML, treatment interruption risks loss of molecular response. Continuity was the entire clinical requirement.",
        ],
      },
      {
        id: "approach",
        heading: "How continuity was secured",
        paragraphs: [
          "The paediatric haematology team treated this as a continuity-of-care problem rather than a purchasing problem, which reframed the options usefully.",
        ],
        numbered: [
          "Confirmed the exact product, strength and daily dose in writing.",
          "Established the buffer supply needed to cover the coverage gap.",
          "Verified generic manufacturers with recognised regulatory approvals.",
          "Arranged continued molecular monitoring — BCR-ABL transcript levels — regardless of supply source.",
          "Documented every product and batch used, so any change in response could be investigated properly.",
          "Applied to a childhood cancer charity for interim support.",
        ],
        table: {
          caption: "Annual imatinib cost by source (USD, reference ranges)",
          head: ["Source", "Annual cost", "Notes"],
          rows: [
            ["Branded reference", "~$126,000", "Pre-expiry list pricing basis"],
            ["European generic", "~$3,600", "Post-patent competition"],
            ["Indian generic reference", "~$1,440", "High-volume market pricing"],
            ["National health coverage", "$0 to patient", "Where eligibility applies"],
          ],
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "No dose was missed during the transition. Molecular monitoring showed the response was maintained throughout, and coverage resumed once residency was resolved.",
          "The family's most useful decision was raising the coverage gap with the clinical team months in advance rather than weeks. Continuity planning is much easier with lead time.",
        ],
        callout: {
          kind: "tip",
          title: "Plan for foreseeable gaps early",
          body: "Insurance changes, relocation, job changes and visa transitions are predictable. Raise them with your clinical team as soon as they are on the horizon so continuity can be arranged calmly.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Is generic imatinib equivalent to the brand?",
        a: "Generic imatinib is approved in regulated markets on the basis of bioequivalence and is widely used. In CML, response is objectively measurable through molecular monitoring, which provides direct confirmation that therapy is working.",
      },
      {
        q: "Can CML therapy ever be stopped?",
        a: "Treatment-free remission is possible for some patients with sustained deep molecular response, but only within strict protocols with intensive monitoring. It is never a decision to make for financial reasons.",
      },
      {
        q: "What monitoring is required?",
        a: "Regular BCR-ABL transcript measurement to confirm molecular response, plus blood counts and clinical review. This monitoring is what makes any product change objectively verifiable.",
      },
    ],
    references: [SOURCES.fdaOrangeBook, SOURCES.emaGenerics, SOURCES.whoEml, SOURCES.medlineplus],
    tags: ["case study", "leukaemia", "paediatric", "targeted therapy"],
    related: ["cancer-medication-cost-guide", "are-indian-generic-medicines-safe", "medicine-shortages-what-to-do"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-copd-retirement-inhaler-costs",
    title: "Case Study: A Retired Couple, COPD and $5,000 of Inhalers",
    h1: "How a retired couple cut $5,000 of annual inhaler costs",
    metaDescription:
      "A composite case study on COPD and asthma inhaler costs in retirement, why device technique matters as much as price, and how a review halved the number of inhalers needed.",
    summary:
      "Inhaler costs on a fixed income, and why the biggest improvement came from technique rather than price.",
    keywords: [
      "inhaler cost",
      "copd medication cost",
      "asthma inhaler price",
      "affordable inhalers seniors",
    ],
    category: "Case Study",
    intent: "Older adult on a fixed income struggling with respiratory medication costs.",
    readingMinutes: 7,
    updatedAt: UPDATED,
    heroStat: { value: "84%", label: "reduction in annual respiratory medication cost" },
    snapshot: {
      patient: "Composite profile — retired couple, aged 71 and 68",
      country: "United States",
      condition: "COPD (one) and persistent asthma (one)",
      medicine: "Combination inhalers, rescue inhalers, spacers",
      westernCost: "~$5,040 per year",
      indianCost: "~$810 per year equivalent basket",
      saving: "~$4,230 per year",
    },
    sections: [
      {
        id: "situation",
        heading: "Fixed income, recurring cost",
        paragraphs: [
          "Between them the couple used four inhaler products: a maintenance combination inhaler each, plus rescue inhalers. On a fixed retirement income the recurring cost was the largest single item in their health budget.",
          "Their coping strategy was to keep using rescue inhalers past the labelled dose count, judging fullness by shaking the canister — a method that does not work reliably and leads to under-dosing during exactly the episodes when the medicine matters most.",
        ],
        callout: {
          kind: "warning",
          title: "You cannot judge an inhaler by shaking it",
          body: "Propellant remains after the active medicine is exhausted, so a canister can spray convincingly while delivering little or no drug. Use the dose counter and replace on schedule.",
        },
      },
      {
        id: "review",
        heading: "The respiratory review",
        paragraphs: [
          "Their physician arranged a structured review with a respiratory nurse. The first finding was not financial: both were using poor inhaler technique, so a substantial proportion of every dose was never reaching the lungs.",
          "This is common and it has a direct cost consequence. Poor technique reduces effective delivered dose, which drives more rescue inhaler use and more frequent refills.",
        ],
        numbered: [
          "Full inhaler technique assessment for both, with correction and re-demonstration.",
          "Spacer devices added, which improve delivery from metered-dose inhalers considerably.",
          "One duplicate therapy identified and stopped, removing an entire product.",
          "Switch to equivalent generic combination inhalers with prescriber approval.",
          "Rescue inhaler use logged to establish a true baseline.",
          "Review booked at three months with symptom and exacerbation tracking.",
        ],
        table: {
          caption: "Annual respiratory medication cost (USD, reference ranges)",
          head: ["Item", "Before", "After", "Reduction"],
          rows: [
            ["Combination inhaler x2 users", "$3,360", "$520", "85%"],
            ["Rescue inhalers", "$1,140", "$180", "84%"],
            ["Duplicate therapy (stopped)", "$540", "$0", "100%"],
            ["Spacers (annual)", "$0", "$110", "added"],
            ["Annual total", "$5,040", "$810", "84%"],
          ],
        },
      },
      {
        id: "technique",
        heading: "Why technique produced the bigger win",
        paragraphs: [
          "After technique correction and spacer use, rescue inhaler consumption fell substantially over the following three months. That reduced cost further, but more importantly it reflected better disease control.",
          "The generic switch saved more money on paper. The technique correction improved the clinical outcome — and the two compounded.",
        ],
        callout: {
          kind: "tip",
          title: "Ask for a technique check annually",
          body: "Inhaler technique degrades over time and is rarely rechecked once initially taught. An annual review takes ten minutes and frequently improves control without any change in medication.",
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "At three months both reported fewer symptoms and neither had needed an urgent care visit. Annual respiratory medication cost had fallen by roughly 84%, and they had stopped stretching rescue inhalers past their dose count.",
        ],
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Are generic inhalers as effective?",
        a: "Where an equivalent product with the same active ingredients and delivery characteristics is approved, yes. Inhalers are device-dependent, so any switch should include technique training on the new device.",
      },
      {
        q: "Does a spacer really make a difference?",
        a: "For metered-dose inhalers, spacers improve delivery to the lungs and reduce oropharyngeal deposition, which also lowers the risk of oral thrush with steroid inhalers.",
      },
      {
        q: "How do I know when an inhaler is empty?",
        a: "Use the dose counter where fitted, and otherwise track the labelled number of actuations from first use. Do not judge by weight, shaking or whether it still sprays.",
      },
    ],
    references: [SOURCES.medlineplus, SOURCES.whoEml, SOURCES.nhsPrescription, SOURCES.fdaGenericFacts],
    tags: ["case study", "copd", "asthma", "seniors"],
    related: ["annual-medicine-budget-planning", "how-to-talk-to-your-doctor-about-medicine-costs", "how-to-get-massive-discounts-on-medicines"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-transplant-immunosuppression-lifetime-cost",
    title: "Case Study: Kidney Transplant — Lifetime Immunosuppression Costs",
    h1: "Lifetime immunosuppression after a kidney transplant",
    metaDescription:
      "A composite case study on post-transplant medication costs, why immunosuppressants require extra caution when switching, and how trough-level monitoring made a supervised change safe.",
    summary:
      "Transplant medicine is the clearest example of where cheap must never mean casual — and how to switch safely when it is necessary.",
    keywords: [
      "transplant medication cost",
      "tacrolimus price",
      "immunosuppressant cost",
      "kidney transplant drugs",
    ],
    category: "Case Study",
    intent: "Transplant recipient facing indefinite immunosuppression costs.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "Lifelong", label: "duration of therapy — which is why continuity outranks price" },
    snapshot: {
      patient: "Composite profile — 39-year-old, two years post kidney transplant",
      country: "Poland",
      condition: "Kidney transplant recipient",
      medicine: "Tacrolimus, mycophenolate mofetil, prednisolone",
      westernCost: "~$8,900 per year",
      indianCost: "~$1,020 per year reference",
      saving: "~$7,880 per year",
    },
    sections: [
      {
        id: "stakes",
        heading: "Why transplant medicine is different",
        paragraphs: [
          "Immunosuppression after a transplant is lifelong and unforgiving. Too little drug risks rejection and loss of the graft; too much increases infection and malignancy risk. The therapeutic window is narrow.",
          "Tacrolimus in particular is a narrow-therapeutic-index drug, dosed to a measured blood trough level rather than to a fixed milligram amount. That single fact governs everything about how a switch must be handled.",
        ],
        callout: {
          kind: "warning",
          title: "Never switch immunosuppressants without supervision",
          body: "Graft loss is not recoverable by resuming the previous product. Any change of manufacturer or formulation must be planned with the transplant team, with trough-level monitoring before and after.",
        },
      },
      {
        id: "situation",
        heading: "The situation",
        paragraphs: [
          "Two years post-transplant with stable graft function, the patient changed jobs and lost supplementary coverage that had absorbed most of his medication cost. He faced the full cost of three medicines indefinitely.",
          "He contacted his transplant coordinator before making any change — which is the single most important action in this entire case.",
        ],
      },
      {
        id: "protocol",
        heading: "The supervised switch protocol",
        paragraphs: [
          "The transplant centre had a defined process for manufacturer changes, because generic substitution at pharmacy level is a recognised issue in transplant care.",
        ],
        numbered: [
          "Baseline tacrolimus trough levels documented across three measurements.",
          "Baseline creatinine and eGFR recorded.",
          "A single named generic manufacturer selected, with a commitment to stay on that product rather than accept pharmacy-level switching between suppliers.",
          "Switch made with trough level rechecked at 7 and 14 days.",
          "Dose adjusted to bring the trough back into the target range.",
          "Creatinine monitored monthly for three months.",
          "The specific product recorded in his notes so future dispensing stayed consistent.",
        ],
        table: {
          caption: "Annual immunosuppression cost (USD, reference ranges)",
          head: ["Medicine", "Before", "After", "Reduction"],
          rows: [
            ["Tacrolimus 1 mg", "~$5,800", "~$640", "89%"],
            ["Mycophenolate mofetil 500 mg", "~$2,400", "~$290", "88%"],
            ["Prednisolone 5 mg", "~$260", "~$34", "87%"],
            ["Additional trough monitoring", "$440", "$56", "87%"],
            ["Annual total", "~$8,900", "~$1,020", "89%"],
          ],
        },
      },
      {
        id: "consistency",
        heading: "Consistency matters more than price",
        paragraphs: [
          "The most important instruction he received was not about which product to use but about staying on it. Repeated switching between different generic manufacturers is the specific risk in narrow-therapeutic-index therapy, because each switch can shift trough levels.",
          "He asked his pharmacy to record a note preventing automatic substitution between suppliers, and to contact the transplant team if his usual product became unavailable.",
        ],
        callout: {
          kind: "tip",
          title: "Ask your pharmacy to lock the manufacturer",
          body: "For narrow-therapeutic-index medicines, ask for a dispensing note specifying a consistent manufacturer. This prevents silent supplier changes between refills, which is a common and avoidable cause of level instability.",
        },
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "Trough levels required one dose adjustment at day 14 and were stable thereafter. Creatinine and eGFR remained at baseline through twelve months, with no rejection episode.",
          "He describes the extra monitoring as the part that made the switch feel safe rather than reckless — and it cost a fraction of what he saved.",
        ],
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Can transplant patients use generic immunosuppressants?",
        a: "Yes, generic immunosuppressants are widely used, but the switch must be supervised with trough-level monitoring, and patients should then remain on a consistent manufacturer rather than switching repeatedly.",
      },
      {
        q: "Why does the manufacturer need to stay the same?",
        a: "For narrow-therapeutic-index drugs, small differences in absorption between products can shift blood levels. Each switch introduces variability, so consistency reduces risk.",
      },
      {
        q: "What monitoring is needed after a switch?",
        a: "Trough levels typically at around 7 and 14 days, dose adjustment as required, and renal function monitoring for several months, following the transplant centre's own protocol.",
      },
    ],
    references: [SOURCES.fdaOrangeBook, SOURCES.emaGenerics, SOURCES.medlineplus, SOURCES.whoEml],
    tags: ["case study", "transplant", "immunosuppression", "monitoring"],
    related: ["are-indian-generic-medicines-safe", "brand-vs-generic-same-salt-explained", "medicine-shortages-what-to-do"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "case-thalassaemia-iron-chelation-cost",
    title: "Case Study: Thalassaemia — Iron Chelation From $50,000 to $820",
    h1: "Iron chelation therapy for thalassaemia: a lifetime cost problem solved",
    metaDescription:
      "A composite case study on transfusion-dependent thalassaemia, why iron chelation is non-negotiable, and how generic deferasirox transformed a family's ability to sustain treatment.",
    summary:
      "Regular transfusions save lives and cause iron overload. The medicine that prevents the resulting organ damage is where the cost sits.",
    keywords: [
      "thalassemia treatment cost",
      "deferasirox price",
      "iron chelation cost",
      "affordable thalassemia care",
    ],
    category: "Case Study",
    intent: "Family managing transfusion-dependent thalassaemia and chelation costs.",
    readingMinutes: 8,
    updatedAt: UPDATED,
    heroStat: { value: "~98%", label: "reduction in annual iron chelation cost" },
    snapshot: {
      patient: "Composite profile — 14-year-old with transfusion-dependent beta thalassaemia",
      country: "Italy, family originally from South Asia",
      condition: "Transfusion-dependent thalassaemia with iron overload",
      medicine: "Deferasirox oral iron chelation",
      westernCost: "~$50,400 per year",
      indianCost: "~$820 per year reference",
      saving: "~$49,580 per year",
    },
    sections: [
      {
        id: "why-chelation",
        heading: "Why chelation is not optional",
        paragraphs: [
          "Transfusion-dependent thalassaemia requires regular red cell transfusions, often every few weeks, for life. Each transfusion delivers iron that the body has no efficient way to excrete.",
          "Accumulated iron deposits in the heart, liver and endocrine organs. Untreated iron overload is a leading cause of death in transfusion-dependent thalassaemia, primarily through cardiac complications.",
          "Iron chelation therapy removes that excess iron. It is therefore not supportive care in any optional sense — it is the treatment that determines long-term survival.",
        ],
        callout: {
          kind: "warning",
          title: "Interrupted chelation causes silent damage",
          body: "Iron accumulation produces no symptoms until organ damage is advanced. A family reducing chelation to save money will usually see no immediate consequence, which makes this particular saving especially dangerous.",
        },
      },
      {
        id: "cost",
        heading: "Where the cost sits",
        paragraphs: [
          "The transfusions themselves were covered by the health system. The oral chelator was the component that fell outside routine coverage during a period when the family's entitlement was being reassessed.",
        ],
        table: {
          caption: "Annual thalassaemia care cost components (USD, reference ranges)",
          head: ["Component", "Branded basis", "Generic reference", "Reduction"],
          rows: [
            ["Deferasirox 500 mg daily", "~$50,400", "~$820", "98%"],
            ["Alternative: deferiprone", "~$34,200", "~$580", "98%"],
            ["Ferritin and MRI monitoring", "~$1,100", "~$1,100", "unchanged"],
            ["Transfusions", "System covered", "System covered", "n/a"],
          ],
        },
        callout: {
          kind: "fact",
          title: "Monitoring costs do not fall",
          body: "Ferritin testing and cardiac and liver iron MRI remain necessary regardless of which chelator is used. Budget for monitoring as a fixed cost, because it is what proves the therapy is working.",
        },
      },
      {
        id: "approach",
        heading: "How the haematology team handled it",
        paragraphs: [
          "The centre treated it as a treatment-continuity issue and involved a patient association early.",
        ],
        numbered: [
          "Confirmed that chelation must continue without interruption.",
          "Verified generic deferasirox manufacturers with recognised approvals.",
          "Kept the monitoring schedule completely unchanged — ferritin regularly, cardiac and liver MRI annually.",
          "Involved a national thalassaemia association, which provided interim support and advocacy on entitlement.",
          "Recorded product and batch details at each dispensing.",
          "Reviewed adherence carefully, since chelators can cause gastrointestinal side effects that reduce compliance.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "Ferritin trends and cardiac MRI at twelve months were consistent with adequate chelation, confirming the therapy was working. Entitlement was subsequently restored.",
          "The family's most valuable action was contacting the national patient association. Disease-specific associations frequently hold detailed knowledge of entitlement rules, appeals processes and interim support that is very hard to find independently.",
        ],
        callout: {
          kind: "tip",
          title: "Find the disease-specific association",
          body: "For rare and chronic conditions, national patient associations are consistently the fastest route to knowing what support genuinely exists and how to obtain it.",
        },
      },
      disclaimerSection(),
    ],
    faqs: [
      {
        q: "Can iron chelation be paused to save money?",
        a: "No. Iron accumulates continuously with every transfusion and causes organ damage silently. Interruption should only ever occur on haematologist instruction, usually for a specific clinical reason.",
      },
      {
        q: "Is generic deferasirox equivalent?",
        a: "Generic deferasirox is approved on bioequivalence grounds in regulated markets and is widely used. Effectiveness is directly verifiable through ferritin trends and iron MRI.",
      },
      {
        q: "How is chelation effectiveness monitored?",
        a: "Through regular serum ferritin measurement and periodic MRI assessment of cardiac and liver iron. This monitoring is essential and should never be reduced to save money.",
      },
    ],
    references: [SOURCES.whoEml, SOURCES.emaGenerics, SOURCES.medlineplus, SOURCES.fdaOrangeBook],
    tags: ["case study", "thalassaemia", "rare disease", "paediatric"],
    related: ["cancer-medication-cost-guide", "patient-assistance-and-discount-programs", "annual-medicine-budget-planning"],
  },
];
