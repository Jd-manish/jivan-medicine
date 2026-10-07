/**
 * Surgery / Operation Cost Comparison — India vs US/EU/Australia.
 *
 * Market prices are source-reported references—not provider quotes. They may
 * be ranges, starting prices, point estimates, or claims-based hospital figures;
 * source currency and procedure/package scope are retained in each record.
 * Clickable price evidence is maintained in surgery-price-evidence.ts.
 *
 * TO ADD A NEW SURGERY: add an entry to the array below and provide evidence
 * for every displayed market. The static pages pick it up automatically.
 */

import { surgeryPriceEvidence, type SurgeryPriceEvidence } from "@/lib/surgery-price-evidence";

export type PriceRange = {
  low: number;
  high: number;
  /** Most existing comparisons are USD; local Australian benchmarks retain AUD. */
  currency?: "USD" | "AUD" | "EUR";
  /** Preserve the source's distinction between a starting estimate and a range. */
  qualifier?: "from" | "about";
};

export type Surgery = {
  slug: string;
  name: string;
  category: string;
  description: string;
  /** Search-friendly alternate spellings, procedure names, and local-language terms. */
  searchTerms?: string[];
  /** What the surgery treats / when you need it */
  indications: string[];
  /** Duration of the procedure */
  duration: string;
  /** Hospital stay */
  hospitalStay: string;
  /** Recovery time */
  recovery: string;
  prices: {
    us: PriceRange;
    eu: PriceRange;
    australia: PriceRange | null;
    india: PriceRange;
  };
  /** Legacy editorial source notes retained for backward compatibility. */
  sources?: string[];
  /** Market-by-market clickable price evidence shown beside the comparison. */
  priceEvidence: SurgeryPriceEvidence[];
  /** Why India is cheaper — specific factors */
  whyCheaper: string[];
  /** Quality notes — accreditation, success rates */
  quality: string;
  /** Risks to be aware of */
  risks: string[];
  /** Key questions to ask the hospital */
  questionsToAsk: string[];
};

type SurgeryDraft = Omit<Surgery, "priceEvidence">;

const surgeryDrafts: SurgeryDraft[] = [
  // ──────────────────────────────────────────────
  //  EYE
  // ──────────────────────────────────────────────
  {
    slug: "cataract-surgery",
    name: "Cataract Surgery",
    category: "Eye",
    description:
      "Removal of the clouded natural lens and replacement with an artificial intraocular lens (IOL). One of the most common surgeries worldwide — over 20 million performed annually.",
    indications: [
      "Blurred or cloudy vision",
      "Difficulty seeing at night",
      "Sensitivity to light and glare",
      "Fading or yellowing of colors",
    ],
    duration: "15–30 minutes per eye",
    hospitalStay: "Same-day discharge (outpatient)",
    recovery: "1–2 weeks for full vision stabilisation",
    prices: {
      us: { low: 3500, high: 10000 },
      eu: { low: 2500, high: 5500 },
      australia: { low: 4700, high: 4700, currency: "AUD" },
      india: { low: 600, high: 2000 },
    },
    sources: [
      "hexahealth.com/treatment/cataract-surgery-cost — India: ₹20,000–₹1,30,000 (2026)",
      "curemeabroad.com — US: $3,500–$10,000, India: $600–$2,000 (2026)",
      "pristyncare.com — India phaco: ₹32,500–₹39,000 per eye",
    ],
    whyCheaper: [
      "High surgical volume — Indian eye hospitals perform thousands per month",
      "Lower surgeon and staff fees without compromising training standards",
      "Subsidised IOL manufacturing in India (Aurolab, Appasamy)",
      "Government-supported Aravind Eye Care model drives costs down",
    ],
    quality:
      "India has some of the world's highest-volume cataract centres. Aravind Eye Hospital has performed over 7 million surgeries with outcomes matching US benchmarks. Many centres are JCI or NABH accredited.",
    risks: [
      "Posterior capsule opacification (treatable with laser)",
      "Infection (rare, <0.1% with modern protocols)",
      "Retinal detachment (very rare)",
    ],
    questionsToAsk: [
      "What IOL brand and type will be used?",
      "Is the hospital JCI or NABH accredited?",
      "What is the surgeon's personal complication rate?",
      "What follow-up is included in the package?",
    ],
  },
  {
    slug: "lasik-eye-surgery",
    name: "LASIK Eye Surgery",
    category: "Eye",
    description:
      "Laser-assisted reshaping of the cornea to correct near-sightedness, far-sightedness, and astigmatism. Eliminates or reduces dependence on glasses and contact lenses.",
    indications: [
      "Myopia (near-sightedness)",
      "Hyperopia (far-sightedness)",
      "Astigmatism",
      "Stable prescription for at least 12 months",
    ],
    duration: "20–30 minutes for both eyes",
    hospitalStay: "Same-day (walk-in, walk-out)",
    recovery: "1–2 days for daily activities, 1 month for full stabilisation",
    prices: {
      us: { low: 4000, high: 6000 },
      eu: { low: 919, high: 3500 },
      australia: null,
      india: { low: 500, high: 1200 },
    },
    whyCheaper: [
      "India is a global LASIK hub — high volume drives per-unit costs down",
      "Same US/FDA-approved lasers (Zeiss, Alcon, Johnson & Vision) used in India",
      "Lower facility overhead and staffing costs",
    ],
    quality:
      "Indian LASIK centres like Sankara Nethralaya, LV Prasad Eye Institute, and Narayana Nethralaya use the same generation of femtosecond and excimer lasers as US/EU centres. Outcomes comparable to global benchmarks.",
    risks: [
      "Dry eyes (temporary, most common)",
      "Glare or halos at night (usually resolves)",
      "Under/over-correction (enhancement possible)",
    ],
    questionsToAsk: [
      "Which LASIK technology is used (bladeless femtosecond)?",
      "Am I a suitable candidate based on corneal thickness?",
      "What is the enhancement policy if needed?",
    ],
  },
  // ──────────────────────────────────────────────
  //  ORTHOPEDIC
  // ──────────────────────────────────────────────
  {
    slug: "knee-replacement",
    name: "Total Knee Replacement (TKR)",
    category: "Orthopaedic",
    description:
      "Surgical replacement of the damaged knee joint with an artificial implant (prosthesis). Typically recommended for advanced osteoarthritis when conservative treatments have failed.",
    indications: [
      "Severe osteoarthritis with bone-on-bone contact",
      "Chronic knee pain limiting daily activities",
      "Failed conservative treatments (physiotherapy, injections)",
      "Rheumatoid arthritis with joint destruction",
    ],
    duration: "1–2 hours",
    hospitalStay: "3–5 days",
    recovery: "6–12 weeks for daily activities, 3–6 months for full recovery",
    prices: {
      us: { low: 30000, high: 70000 },
      eu: { low: 12000, high: 23500 },
      australia: { low: 23200, high: 23200, currency: "AUD" },
      india: { low: 3600, high: 6600 },
    },
    sources: [
      "jforh.com — India: $5,500–$8,500, US: $35,000–$65,000 (2026)",
      "qualitycareglobal.com — India: $3,600–$9,000, US: $30,000–$70,000",
      "bookimed.com — India: $3,600–$6,600, US avg: $45,000",
      "hospital.alampoint.com — India: $3,000–$6,000, US: $35,000–$60,000+",
    ],
    whyCheaper: [
      "Same implant brands (Zimmer Biomet, Stryker, DePuy Synthes) at lower markup",
      "Lower surgeon fees — not lower skill, but lower cost of living",
      "Government price caps on medical devices in India since 2017",
      "High patient volume reduces per-surgery overhead",
    ],
    quality:
      "Indian orthopaedic centres like AIIMS, Apollo, Fortis, and Manipal have internationally trained surgeons. Many use computer-navigated or robotic-assisted surgery (same technology as US hospitals). JCI-accredited hospitals report comparable outcomes.",
    risks: [
      "Blood clots (DVT) — mitigated with blood thinners",
      "Infection (<1% with modern protocols)",
      "Implant loosening over 15–20 years",
      "Stiffness — requires diligent physiotherapy",
    ],
    questionsToAsk: [
      "Which implant brand and model will be used?",
      "Is computer navigation or robotic assistance available?",
      "What physiotherapy is included post-surgery?",
      "What is the implant warranty?",
    ],
  },
  {
    slug: "hip-replacement",
    name: "Total Hip Replacement (THR)",
    category: "Orthopaedic",
    description:
      "Replacement of the damaged hip joint with a prosthetic implant. Restores mobility and eliminates chronic hip pain from arthritis or fracture.",
    indications: [
      "Severe hip osteoarthritis",
      "Hip fracture",
      "Avascular necrosis of the femoral head",
      "Failed previous hip surgery",
    ],
    duration: "1–2 hours",
    hospitalStay: "3–5 days",
    recovery: "4–6 weeks for daily activities, 3–6 months for full recovery",
    prices: {
      us: { low: 40000, high: 80000 },
      eu: { low: 15000, high: 35000 },
      australia: { low: 25600, high: 25600, currency: "AUD" },
      india: { low: 4350, high: 8000 },
    },
    whyCheaper: [
      "Same global implant manufacturers at India-negotiated pricing",
      "Government-mandated price caps on orthopaedic implants",
      "High-volume surgical teams reduce per-case costs",
    ],
    quality:
      "India's leading hip replacement centres (AIIMS, Fortis, Apollo, Max Healthcare) use the same ceramic-on-ceramic and metal-on-polyethylene bearing surfaces. Many surgeons trained at UK/US fellowship programmes.",
    risks: [
      "Dislocation (risk highest in first 6 weeks)",
      "Blood clots (DVT/PE)",
      "Leg length discrepancy (rare with experienced surgeons)",
      "Implant wear over 15–25 years",
    ],
    questionsToAsk: [
      "What bearing surface will be used (ceramic, metal, polyethylene)?",
      "What approach — anterior, posterior, or lateral?",
      "What is the expected implant lifespan?",
      "Is robotic-assisted surgery available?",
    ],
  },
  {
    slug: "acl-reconstruction",
    name: "ACL Reconstruction Surgery",
    category: "Orthopaedic",
    description:
      "Reconstruction of the torn anterior cruciate ligament (ACL) using a tissue graft. Essential for athletes and active individuals who need knee stability.",
    indications: [
      "Complete ACL tear confirmed by MRI",
      "Knee instability during physical activity",
      "Associated meniscus or ligament injuries",
      "Young, active patients planning return to sport",
    ],
    duration: "1–1.5 hours",
    hospitalStay: "1–2 days (often day surgery)",
    recovery: "6–9 months for return to sport",
    prices: {
      us: { low: 27500, high: 27500 },
      eu: { low: 10000, high: 14000 },
      australia: { low: 8000, high: 15000, currency: "AUD" },
      india: { low: 5800, high: 8650 },
    },
    whyCheaper: [
      "Arthroscopic equipment and graft costs significantly lower in India",
      "Lower surgeon and anaesthesia fees",
      "High sports medicine volume in Indian metropolitan hospitals",
    ],
    quality:
      "Indian sports medicine centres (Kokilaben Hospital, Fortis, Manipal) use the same arthroscopic techniques and graft options (patellar tendon, hamstring, quadriceps tendon). Many surgeons have FIFA/IOC sports medicine certifications.",
    risks: [
      "Graft failure (3–5%)",
      "Stiffness (requires aggressive physiotherapy)",
      "Re-tear on return to sport (5–10%)",
      "Donor site morbidity (depends on graft type)",
    ],
    questionsToAsk: [
      "Which graft type do you recommend and why?",
      "Is all-inside or standard technique used?",
      "What is your return-to-sport protocol timeline?",
    ],
  },
  {
    slug: "spinal-fusion",
    name: "Spinal Fusion Surgery",
    category: "Orthopaedic",
    description:
      "Joining two or more vertebrae to eliminate painful motion. Used for degenerative disc disease, scoliosis, spinal stenosis, and fractures.",
    indications: [
      "Degenerative disc disease unresponsive to conservative care",
      "Spondylolisthesis (slipped vertebra)",
      "Spinal stenosis with nerve compression",
      "Spinal fractures or tumours",
    ],
    duration: "2–6 hours (depends on levels fused)",
    hospitalStay: "3–7 days",
    recovery: "3–6 months for bone fusion, 6–12 months for full recovery",
    prices: {
      us: { low: 100000, high: 100000 },
      eu: { low: 40000, high: 55000 },
      australia: null,
      india: { low: 18000, high: 27600 },
    },
    whyCheaper: [
      "Spinal implant costs (pedicle screws, rods, cages) 60-80% lower in India",
      "Lower surgical team and facility fees",
      "Government price caps on spinal implants",
    ],
    quality:
      "India's top spine centres (AIIMS, Kokilaben, Fortis, Narayana Health) have neurosurgeons and orthopaedic spine surgeons trained at US/UK/EU fellowships. Intraoperative neuromonitoring and navigation systems are available at major centres.",
    risks: [
      "Non-union (pseudoarthrosis) — 5–10%",
      "Infection (1–3%)",
      "Nerve injury (rare with experienced teams)",
      "Adjacent segment disease (long-term)",
    ],
    questionsToAsk: [
      "How many spinal fusions does the surgeon perform per year?",
      "Is intraoperative neuromonitoring used?",
      "What implant system will be used?",
      "What is the bone graft source?",
    ],
  },
  // ──────────────────────────────────────────────
  //  CARDIAC
  // ──────────────────────────────────────────────
  {
    slug: "heart-valve-replacement",
    name: "Heart Valve Replacement",
    category: "Cardiac",
    description:
      "Replacement of a damaged heart valve (aortic, mitral, tricuspid, or pulmonary) with a mechanical or biological prosthetic valve. Can be done via open-heart surgery or minimally invasive (TAVR).",
    indications: [
      "Severe aortic stenosis",
      "Severe mitral regurgitation",
      "Valve calcification or congenital defects",
      "Failed previous valve repair",
    ],
    duration: "2–5 hours (open surgery), 1–2 hours (TAVR)",
    hospitalStay: "5–10 days (open), 2–4 days (TAVR)",
    recovery: "6–12 weeks (open), 2–4 weeks (TAVR)",
    prices: {
      us: { low: 50000, high: 150000 },
      eu: { low: 25000, high: 60000 },
      australia: null,
      india: { low: 6000, high: 12000 },
    },
    sources: [
      "afiyaindia.com — India: $4,800–$12,000, US: $80,000+ (2025)",
      "shifamhealth.com — India: $3,500–$9,000, US: ≥$80,000 (2026)",
      "wmedtour.com — India: $8,000–$15,000, US: $50,000–$100,000+",
    ],
    whyCheaper: [
      "India manufactures its own heart valves (TTK Healthcare, Meril Life Sciences)",
      "Same international brands (Edwards, Medtronic) available at India-negotiated prices",
      "Lower cardiac surgical team costs — not lower quality, lower cost of living",
      "Government price caps on cardiac stents and implants since 2017",
    ],
    quality:
      "India has over 50 centres performing 500+ open-heart surgeries per year. Escorts (Fortis), AIIMS, Narayana Health, and Apollo have internationally benchmarked outcomes. TAVR is available at multiple centres using Edwards Sapien and Medtronic Evolut valves.",
    risks: [
      "Stroke (1–3%)",
      "Bleeding requiring re-exploration (2–5%)",
      "Infection (endocarditis risk)",
      "Blood clot formation (requires lifelong anticoagulation for mechanical valves)",
    ],
    questionsToAsk: [
      "Mechanical vs biological valve — which is recommended for my age?",
      "Is TAVR (minimally invasive) an option?",
      "How many valve replacements does this centre perform annually?",
      "What anticoagulation will I need long-term?",
    ],
  },
  {
    slug: "coronary-artery-bypass",
    name: "Coronary Artery Bypass Graft (CABG)",
    category: "Cardiac",
    description:
      "Open-heart surgery that creates new routes for blood to flow around blocked coronary arteries using grafts from other blood vessels. The gold standard for multi-vessel coronary artery disease.",
    indications: [
      "Multi-vessel coronary artery disease",
      "Left main coronary artery disease",
      "Failed angioplasty or stenting",
      "Diabetes with multi-vessel disease",
    ],
    duration: "3–6 hours",
    hospitalStay: "5–10 days",
    recovery: "6–12 weeks, 3–6 months for full recovery",
    prices: {
      us: { low: 57000, high: 150000 },
      eu: { low: 30000, high: 70000 },
      australia: null,
      india: { low: 5500, high: 10000 },
    },
    sources: [
      "treatmentpossible.com — India: $4,000–$6,000, US: $57,000–$150,000 (2026)",
      "afiyaindia.com — India: $4,000–$12,000, US: $75,000–$150,000+",
      "curemeabroad.com — India: $5,000–$10,000, US: $57,000–$150,000",
    ],
    whyCheaper: [
      "Same surgical technique and equipment (on-pump and off-pump CABG)",
      "Lower surgeon and team fees — not lower training standards",
      "High volume — top Indian centres do 2000+ CABG per year",
      "Indian-made heart-lung machines and consumables reduce costs",
    ],
    quality:
      "Narayana Health, AIIMS, Escorts Fortis, and Apollo perform CABG with outcomes matching STS (Society of Thoracic Surgeons) benchmarks. Off-pump CABG (OPCAB) pioneered and widely used in India. Many surgeons trained at Cleveland Clinic, Mayo Clinic, or UK centres.",
    risks: [
      "Stroke (1–2%)",
      "Infection (sternal wound, 1–3%)",
      "Kidney dysfunction (temporary)",
      "Atrial fibrillation (common, usually temporary)",
    ],
    questionsToAsk: [
      "On-pump or off-pump — which do you recommend?",
      "How many CABG surgeries does the surgeon perform per year?",
      "What is the centre's mortality rate for CABG?",
      "What cardiac rehabilitation programme is included?",
    ],
  },
  {
    slug: "angioplasty-stent",
    name: "Angioplasty with Stent Placement",
    category: "Cardiac",
    description:
      "Minimally invasive procedure to open blocked coronary arteries using a balloon catheter and drug-eluting stent. The most common cardiac intervention worldwide.",
    indications: [
      "Acute heart attack (primary PCI)",
      "Stable angina not responding to medication",
      "Significant coronary artery blockage (>70%)",
      "Post-failed medical therapy",
    ],
    duration: "1–2 hours",
    hospitalStay: "1–2 days",
    recovery: "1 week for daily activities, 1 month for full activity",
    prices: {
      us: { low: 95000, high: 95000 },
      eu: { low: 25000, high: 45000 },
      australia: null,
      india: { low: 5102, high: 5102 },
    },
    sources: [
      "afiyaindia.com — India: $2,400–$6,400, US: $30,000–$50,000+ (2025)",
      "treatmentpossible.com — India: $2,500–$4,000, US: $25,000–$50,000",
    ],
    whyCheaper: [
      "India capped coronary stent prices in 2017 — drug-eluting stents capped at ₹30,000 (~$360)",
      "Same international brands (Abbott, Boston Scientific, Medtronic) at regulated prices",
      "High cath-lab volume reduces per-procedure costs",
    ],
    quality:
      "India performs over 300,000 angioplasties per year — one of the highest volumes globally. Centres like AIIMS, Fortis Escorts, and Narayana Health have outcomes comparable to US benchmarks. Indian-made stents (Meril, Translumina) are CE-marked and increasingly used globally.",
    risks: [
      "Re-stenosis (2–5% with drug-eluting stents)",
      "Bleeding at catheter insertion site",
      "Blood clot in stent (requires dual antiplatelet therapy)",
      "Very rare: vessel damage, kidney contrast injury",
    ],
    questionsToAsk: [
      "Which stent brand and type will be used?",
      "How long will I need dual antiplatelet therapy?",
      "What is this centre's door-to-balloon time for heart attacks?",
    ],
  },
  // ──────────────────────────────────────────────
  //  ORGAN TRANSPLANT
  // ──────────────────────────────────────────────
  {
    slug: "kidney-transplant",
    name: "Kidney Transplant",
    category: "Transplant",
    description:
      "Surgical placement of a healthy kidney from a living or deceased donor. The gold standard treatment for end-stage renal disease, offering better quality of life than long-term dialysis.",
    indications: [
      "End-stage renal disease (Stage 5 CKD)",
      "GFR below 20 ml/min",
      "Dependence on dialysis",
      "Suitable donor available",
    ],
    duration: "3–5 hours",
    hospitalStay: "7–14 days",
    recovery: "4–6 weeks for daily activities, 3–6 months for full recovery",
    prices: {
      us: { low: 400000, high: 400000 },
      eu: { low: 95000, high: 140000 },
      australia: null,
      india: { low: 14000, high: 19000 },
    },
    whyCheaper: [
      "Lower surgical team and hospital fees",
      "Immunosuppressant medicines (tacrolimus, mycophenolate) manufactured in India at fraction of cost",
      "Government hospitals offer subsidised transplants",
      "High living-donor transplant volume (India's Transplant of Human Organs Act regulates this)",
    ],
    quality:
      "India has over 300 transplant centres. AIIMS, PGIMER Chandigarh, Apollo, and Manipal have graft survival rates comparable to international registries. India performed over 15,000 kidney transplants in 2023 — the second-highest in the world after the US.",
    risks: [
      "Rejection (managed with immunosuppression)",
      "Infection (increased risk due to immunosuppression)",
      "Side effects of anti-rejection medicines",
      "Recurrence of original kidney disease",
    ],
    questionsToAsk: [
      "What is the centre's 1-year graft survival rate?",
      "What immunosuppression protocol is used?",
      "What long-term follow-up is included?",
      "What is the donor evaluation process?",
    ],
  },
  {
    slug: "liver-transplant",
    name: "Liver Transplant",
    category: "Transplant",
    description:
      "Replacement of a diseased liver with a healthy liver from a deceased or living donor. The only cure for end-stage liver disease and certain liver cancers.",
    indications: [
      "End-stage liver cirrhosis",
      "Acute liver failure",
      "Hepatocellular carcinoma (within Milan criteria)",
      "Metabolic liver diseases",
    ],
    duration: "8–14 hours",
    hospitalStay: "14–21 days",
    recovery: "3–6 months for full recovery",
    prices: {
      us: { low: 750000, high: 750000 },
      eu: { low: 250000, high: 250000 },
      australia: null,
      india: { low: 35000, high: 55000 },
    },
    whyCheaper: [
      "India pioneered living-donor liver transplant — high surgical expertise at lower cost",
      "Lower immunosuppressant costs (Indian-manufactured tacrolimus, sirolimus)",
      "Lower ICU and hospitalisation costs",
      "High surgical volume — centres like ILBS Delhi, Apollo Chennai perform 200+ per year",
    ],
    quality:
      "India is a global leader in living-donor liver transplant (LDLT). ILBS Delhi, Apollo Chennai, and Aster Medcity have performed thousands of transplants with outcomes matching international benchmarks. 1-year survival rates: 85–90%.",
    risks: [
      "Graft rejection or dysfunction",
      "Biliary complications (10–15%)",
      "Infection (bacterial, fungal, viral)",
      "Disease recurrence (Hepatitis B/C, HCC)",
    ],
    questionsToAsk: [
      "How many liver transplants has the centre performed?",
      "Is living-donor or deceased-donor transplant recommended?",
      "What is the centre's 1-year patient survival rate?",
      "What long-term immunosuppression monitoring is included?",
    ],
  },
  // ──────────────────────────────────────────────
  //  COSMETIC / ELECTIVE
  // ──────────────────────────────────────────────
  {
    slug: "rhinoplasty",
    name: "Rhinoplasty (Nose Reshaping)",
    category: "Cosmetic",
    description:
      "Surgical reshaping of the nose for cosmetic or functional reasons (breathing correction). One of the most commonly performed cosmetic surgeries worldwide.",
    indications: [
      "Cosmetic dissatisfaction with nose shape or size",
      "Deviated septum causing breathing difficulty",
      "Post-traumatic nasal deformity",
      "Congital nasal defects",
    ],
    duration: "1.5–3 hours",
    hospitalStay: "Same-day or 1 night",
    recovery: "1–2 weeks for visible bruising, 6–12 months for final shape",
    prices: {
      us: { low: 5000, high: 15000 },
      eu: { low: 4000, high: 12000 },
      australia: { low: 10300, high: 10300, currency: "AUD" },
      india: { low: 850, high: 6200 },
    },
    whyCheaper: [
      "Lower surgeon and anaesthesia fees",
      "Same surgical techniques (open vs closed rhinoplasty) at lower facility costs",
      "Growing medical tourism hub — India performed 2.5M+ cosmetic procedures in 2023",
    ],
    quality:
      "Indian cosmetic surgeons at centres like Apollo, Fortis, and dedicated clinics (e.g., Allure Medspa) are board-certified and often trained internationally. India's National Board of Examinations (DNB) in Plastic Surgery is internationally recognised.",
    risks: [
      "Swelling and bruising (expected, temporary)",
      "Asymmetry or unsatisfactory cosmetic result",
      "Breathing difficulty (if structural support compromised)",
      "Need for revision surgery (5–15%)",
    ],
    questionsToAsk: [
      "Open or closed technique — which is recommended?",
      "Can I see before/after photos of similar cases?",
      "What is the revision policy?",
      "Is functional septoplasty included if needed?",
    ],
  },
  {
    slug: "bariatric-surgery",
    name: "Bariatric Surgery (Weight Loss)",
    category: "General",
    description:
      "Surgical procedures (gastric bypass, sleeve gastrectomy, gastric band) to help with significant weight loss in patients with BMI >40 or BMI >35 with comorbidities.",
    indications: [
      "BMI ≥ 40 (or ≥ 35 with diabetes, hypertension, sleep apnoea)",
      "Failed conservative weight loss attempts",
      "Type 2 diabetes with obesity",
      "Obesity-related joint damage",
    ],
    duration: "1–3 hours (laparoscopic)",
    hospitalStay: "2–4 days",
    recovery: "2–4 weeks for daily activities, 6–12 weeks for full recovery",
    prices: {
      us: { low: 15000, high: 30000 },
      eu: { low: 12000, high: 25000 },
      australia: { low: 14300, high: 14300, currency: "AUD" },
      india: { low: 3900, high: 8000 },
    },
    whyCheaper: [
      "Same laparoscopic staplers and equipment at lower procurement costs",
      "Lower surgeon and hospital fees",
      "India is a growing bariatric surgery hub — high volume at major centres",
    ],
    quality:
      "India's top bariatric centres (Mohak Bariatrics, Nova Specialty Surgery, Apollo) perform thousands of procedures annually. Indian surgeons have pioneered single-anastomosis techniques. IFSO (International Federation for Surgery of Obesity) accredited programmes available.",
    risks: [
      "Staple line leak (1–2%)",
      "Nutritional deficiencies (requires lifelong supplementation)",
      "Dumping syndrome (after gastric bypass)",
      "Gallstone formation",
    ],
    questionsToAsk: [
      "Which procedure — sleeve, bypass, or band — is recommended for me?",
      "How many bariatric surgeries has the surgeon performed?",
      "What is the long-term follow-up programme?",
      "What dietary support is included?",
    ],
  },
  {
    slug: "hernia-repair",
    name: "Hernia Repair Surgery",
    category: "General",
    description:
      "Surgical repair of a hernia (inguinal, umbilical, incisional, or hiatal) using mesh reinforcement. One of the most common general surgeries worldwide.",
    indications: [
      "Visible or palpable bulge in the groin, navel, or abdomen",
      "Pain or discomfort during lifting or straining",
      "Incarcerated or strangulated hernia (emergency)",
      "Hiatal hernia causing severe acid reflux",
    ],
    duration: "1–2 hours (laparoscopic), 30–60 min (open)",
    hospitalStay: "Same-day to 1 day (laparoscopic), 1–3 days (open)",
    recovery: "1–2 weeks (laparoscopic), 3–6 weeks (open)",
    prices: {
      us: { low: 5000, high: 15000 },
      eu: { low: 3000, high: 8000 },
      australia: null,
      india: { low: 914, high: 3400 },
    },
    whyCheaper: [
      "India manufactures surgical mesh (Ethicon, Brahmos) locally",
      "High volume — hernia repair is the most common general surgery in India",
      "Lower anaesthesia and facility costs",
    ],
    quality:
      "Hernia repair is routine in India with outcomes matching global standards. Laparoscopic repair (TEP/TAPP) widely available. Indian surgeons are trained in the same techniques as US/EU counterparts. Recurrence rates: 1–5% with mesh repair.",
    risks: [
      "Recurrence (1–5% with mesh)",
      "Chronic pain (1–2%)",
      "Infection (1–2%)",
      "Mesh-related complications (rare)",
    ],
    questionsToAsk: [
      "Laparoscopic or open — which is recommended?",
      "Which mesh type will be used?",
      "What is the recurrence rate at this centre?",
    ],
  },
  // ──────────────────────────────────────────────
  //  DENTAL
  // ──────────────────────────────────────────────
  {
    slug: "dental-implant",
    name: "Dental Implant (Single Tooth)",
    category: "Dental",
    description:
      "Surgical placement of a titanium or ceramic post into the jawbone to support an artificial tooth. The most durable and natural-feeling tooth replacement option.",
    indications: [
      "Missing single tooth",
      "Failed root canal or broken tooth beyond repair",
      "Denture wearer seeking fixed solution",
      "Sufficient jawbone density (or bone graft needed)",
    ],
    duration: "1–2 hours per implant",
    hospitalStay: "Outpatient (dental clinic)",
    recovery: "3–6 months for osseointegration, then 2–4 weeks for crown",
    prices: {
      us: { low: 3200, high: 3200 },
      eu: { low: 2000, high: 4500 },
      australia: null,
      india: { low: 500, high: 1100 },
    },
    whyCheaper: [
      "Same implant brands (Straumann, Nobel Biocare, Osstem) at lower distribution costs",
      "Lower dentist and lab fees",
      "India has the second-highest number of dental colleges globally — high supply of trained dentists",
    ],
    quality:
      "India has 300+ dental colleges and a large pool of implantologists trained in European/American protocols. Centres like Clove Dental, 32 Smiles, and Axiss Dental use CBCT-guided implant placement. Straumann and Nobel Biocare implants are widely available.",
    risks: [
      "Implant failure (2–5%)",
      "Infection (rare with proper protocol)",
      "Nerve damage (very rare with CBCT planning)",
      "Peri-implantitis (long-term gum disease around implant)",
    ],
    questionsToAsk: [
      "Which implant brand will be used?",
      "Is CBCT/3D scan planning included?",
      "What is the implant warranty?",
      "Is bone grafting needed and what is the additional cost?",
    ],
  },
  // ──────────────────────────────────────────────
  //  CANCER SURGERY
  // ──────────────────────────────────────────────
  {
    slug: "mastectomy",
    name: "Mastectomy (Breast Cancer Surgery)",
    category: "Cancer Surgery",
    description:
      "Surgical removal of breast tissue to treat or prevent breast cancer. Options include total mastectomy, modified radical mastectomy, and skin/nipple-sparing mastectomy with immediate reconstruction.",
    indications: [
      "Early-stage or locally advanced breast cancer",
      "High genetic risk (BRCA1/BRCA2 positive)",
      "Recurrence after lumpectomy + radiation",
      "Multicentric disease",
    ],
    duration: "1–3 hours (longer with reconstruction)",
    hospitalStay: "1–3 days",
    recovery: "2–4 weeks for daily activities, 6–8 weeks for full recovery",
    prices: {
      us: { low: 15000, high: 50000 },
      eu: { low: 8000, high: 25000 },
      australia: null,
      india: { low: 2650, high: 4450 },
    },
    whyCheaper: [
      "Lower surgical and anaesthesia fees",
      "Same surgical techniques and equipment",
      "High cancer surgery volume — India treats 1.5M+ new cancer cases per year",
      "Government hospitals offer free/subsidised cancer surgery",
    ],
    quality:
      "India's cancer centres (Tata Memorial Mumbai, AIIMS Delhi, Adyar Cancer Institute Chennai, Kidwai Bangalore) have internationally benchmarked outcomes. Oncoplastic and immediate reconstruction techniques are widely available. Tata Memorial alone performs 15,000+ cancer surgeries annually.",
    risks: [
      "Seroma (fluid collection, common but manageable)",
      "Lymphoedema (after axillary dissection)",
      "Wound infection",
      "Psychological impact — counselling support important",
    ],
    questionsToAsk: [
      "Is skin-sparing or nipple-sparing mastectomy possible?",
      "Is immediate reconstruction available?",
      "What lymph node assessment technique is used (sentinel vs axillary)?",
      "What supportive care (counselling, prosthesis) is included?",
    ],
  },
  {
    slug: "prostate-surgery",
    name: "Prostate Surgery (TURP / Radical Prostatectomy)",
    category: "Cancer Surgery",
    description:
      "Surgical treatment for enlarged prostate (BPH) or prostate cancer. TURP for BPH; radical prostatectomy (open, laparoscopic, or robotic) for cancer.",
    indications: [
      "Benign prostatic hyperplasia (BPH) with urinary obstruction",
      "Localised prostate cancer (Gleason 6–8)",
      "Failed medical therapy for BPH",
      "Rising PSA with biopsy-confirmed cancer",
    ],
    duration: "1–2 hours (TURP), 2–4 hours (radical prostatectomy)",
    hospitalStay: "2–3 days (TURP), 3–5 days (radical)",
    recovery: "2–4 weeks (TURP), 4–8 weeks (radical)",
    prices: {
      us: { low: 10000, high: 40000 },
      eu: { low: 17000, high: 20000 },
      australia: null,
      india: { low: 6100, high: 14150 },
    },
    whyCheaper: [
      "Same robotic systems (da Vinci) available at major Indian centres",
      "Lower surgical team and hospital fees",
      "High urology volume at government and private hospitals",
    ],
    quality:
      "India has 20+ da Vinci robotic surgery systems. AIIMS, Apollo, and Fortis perform thousands of prostate surgeries annually. Robotic radical prostatectomy outcomes (continence, potency) match international benchmarks.",
    risks: [
      "Urinary incontinence (temporary in most, permanent in 5–10%)",
      "Erectile dysfunction (depends on nerve-sparing technique)",
      "Bleeding (TURP syndrome is rare with modern bipolar systems)",
      "Stricture formation",
    ],
    questionsToAsk: [
      "Is robotic surgery available and recommended?",
      "What is the surgeon's continence and potency outcome data?",
      "What nerve-sparing technique will be used?",
    ],
  },
  // ──────────────────────────────────────────────
  //  NEW PROCEDURES
  // ──────────────────────────────────────────────
  {
    slug: "appendectomy",
    name: "Appendectomy (Appendix Removal)",
    category: "General Surgery",
    searchTerms: ["appendix", "appendix removal", "अपेंडिक्स", "appendicitis", "appendicectomy"],
    description:
      "Surgical removal of an inflamed or infected appendix. Most uncomplicated cases are treated with laparoscopic surgery; perforation or abscess can require a more complex admission.",
    indications: [
      "Appendicitis confirmed by clinical assessment and imaging",
      "Concern for perforation, abscess, or worsening infection",
      "A surgeon recommends removal after considering non-operative treatment",
    ],
    duration: "About 1 hour; longer for complicated disease",
    hospitalStay: "Usually 1–3 days; varies with infection and recovery",
    recovery: "Often 1–3 weeks after uncomplicated laparoscopic surgery",
    prices: {
      us: { low: 15000, high: 30000 },
      eu: { low: 8500, high: 13500 },
      australia: { low: 6235, high: 7747, currency: "AUD" },
      india: { low: 1600, high: 2000 },
    },
    whyCheaper: [
      "Private hospital, surgeon, and room charges differ substantially by country and facility",
      "Published India prices are often package estimates; emergency complications can change the total",
      "Travel is not an appropriate substitute for urgent assessment of suspected appendicitis",
    ],
    quality:
      "Appendectomy is performed in accredited hospitals in India and internationally. Ask about the surgeon's laparoscopic experience, emergency backup, infection-control protocols, and what the estimate includes.",
    risks: [
      "Bleeding, infection, or injury to nearby structures",
      "Abscess or wound complications, especially after perforation",
      "Anesthesia-related complications",
    ],
    questionsToAsk: [
      "Is the case uncomplicated, perforated, or associated with an abscess?",
      "Does the package include anesthesia, imaging, pathology, medicines, and hospital stay?",
      "What follow-up is required before travel?",
    ],
  },
  {
    slug: "gallbladder-removal",
    name: "Gallbladder Removal (Cholecystectomy)",
    category: "General Surgery",
    searchTerms: ["cholecystectomy", "gallbladder surgery", "gallstones", "gall bladder", "पित्त की थैली"],
    description:
      "Surgical removal of the gallbladder, most often by laparoscopic keyhole surgery for symptomatic gallstones. Emergency inflammation, bile-duct stones, or open surgery can change the plan and cost.",
    indications: [
      "Recurrent symptoms from gallstones",
      "Acute gallbladder inflammation when a surgeon recommends surgery",
      "Other gallbladder conditions assessed by a qualified clinician",
    ],
    duration: "About 1–2 hours",
    hospitalStay: "Same day to 2 nights for uncomplicated laparoscopic surgery",
    recovery: "Often 1–3 weeks for routine activity after laparoscopic surgery",
    prices: {
      us: { low: 12000, high: 25000 },
      eu: { low: 9300, high: 9300, qualifier: "from" },
      australia: { low: 7300, high: 7300, currency: "AUD" },
      india: { low: 1500, high: 3000 },
    },
    whyCheaper: [
      "Hospital package scope and insurance arrangements differ between markets",
      "Laparoscopic and open procedures are not interchangeable price points",
      "Medical-tourism quotes may exclude travel, follow-up, and management of complications",
    ],
    quality:
      "Laparoscopic cholecystectomy is available at established Indian hospitals. Confirm the surgeon's experience, availability of endoscopy/ERCP if needed, and the plan for follow-up after returning home.",
    risks: [
      "Bile leak or bile-duct injury",
      "Bleeding, infection, or anesthesia complications",
      "Conversion to open surgery or a longer stay if the case is complex",
    ],
    questionsToAsk: [
      "Is the quote for laparoscopic or open surgery?",
      "Does it include pre-operative imaging and any bile-duct procedure?",
      "How long should I remain near the hospital after discharge?",
    ],
  },
  {
    slug: "hysterectomy",
    name: "Hysterectomy (Uterus Removal)",
    category: "Gynaecology",
    searchTerms: ["uterus removal", "womb removal", "uterine surgery", "hysterectomy surgery"],
    description:
      "Surgical removal of the uterus for selected gynaecological conditions. Abdominal, vaginal, laparoscopic, and robotic approaches have different indications, recovery periods, and prices.",
    indications: [
      "Selected fibroids, heavy bleeding, endometriosis, or pelvic conditions after specialist assessment",
      "Some cancers or pre-cancerous conditions when recommended by a gynaecologic oncologist",
      "Symptoms not adequately managed with appropriate alternatives",
    ],
    duration: "About 1–4 hours depending on approach and complexity",
    hospitalStay: "Usually 1–5 days depending on approach and recovery",
    recovery: "Often 2–8 weeks; the surgeon's advice depends on the procedure",
    prices: {
      us: { low: 30000, high: 55000 },
      eu: { low: 8500, high: 9500 },
      australia: { low: 11340, high: 16167, currency: "AUD" },
      india: { low: 3500, high: 3500, qualifier: "from" },
    },
    whyCheaper: [
      "Hospital charges, surgical approach, pathology, and inpatient days drive much of the price variation",
      "A low quote may not include oncology care, reconstruction, medicines, or follow-up",
      "Medical decisions should be based on clinical need, not destination price alone",
    ],
    quality:
      "Indian centres offer open, vaginal, laparoscopic, and robotic procedures. Ask whether the surgeon and hospital are equipped for the specific diagnosis and whether pathology and oncology review are included when relevant.",
    risks: [
      "Bleeding, infection, blood clots, or injury to adjacent organs",
      "Anesthesia-related complications",
      "The operation permanently ends the ability to carry a pregnancy; discuss fertility-preserving options where relevant",
    ],
    questionsToAsk: [
      "Which surgical approach is recommended and why?",
      "Will the ovaries or cervix be removed, and what are the implications?",
      "Does the estimate include pathology, follow-up, and treatment of complications?",
    ],
  },
  {
    slug: "ivf-treatment",
    name: "IVF (In Vitro Fertilisation)",
    category: "Fertility Treatment",
    searchTerms: ["in vitro fertilization", "in vitro fertilisation", "fertility treatment", "test tube baby", "IVF cycle"],
    description:
      "Assisted reproduction in which eggs are retrieved, fertilised in a laboratory, and an embryo is transferred. A quoted cycle may exclude medicines, ICSI, donor services, genetic testing, storage, or later transfers.",
    indications: [
      "Infertility assessed by a qualified fertility specialist",
      "Treatment plan determined after reviewing both partners and prior care",
      "A specific assisted-reproduction option recommended after counselling",
    ],
    duration: "A treatment cycle typically spans several weeks",
    hospitalStay: "Usually outpatient visits; egg retrieval involves a short procedure visit",
    recovery: "Most routine activities resume quickly, but clinic monitoring continues through the cycle",
    prices: {
      us: { low: 17500, high: 26000 },
      eu: { low: 5000, high: 6000, currency: "EUR" },
      australia: { low: 13340, high: 13340, currency: "AUD" },
      india: { low: 3500, high: 3500, qualifier: "from" },
    },
    whyCheaper: [
      "Clinic package contents, medicine pricing, and rebate/insurance systems differ by country",
      "The headline cycle price is not the total cost if ICSI, donor services, testing, storage, or frozen transfers are needed",
      "Success rates depend strongly on age, diagnosis, and treatment history; price is not a proxy for outcome",
    ],
    quality:
      "India has established fertility clinics and specialist laboratories. Verify clinic registration, laboratory standards, the named clinician, counselling, consent, data privacy, and how outcomes are reported for patients with a profile like yours.",
    risks: [
      "Ovarian hyperstimulation and complications of egg retrieval",
      "Multiple pregnancy or pregnancy-related complications",
      "Emotional, financial, and legal considerations that vary by treatment and country",
    ],
    questionsToAsk: [
      "Does the estimate include stimulation medicines, monitoring, retrieval, fertilisation, and transfer?",
      "What are the clinic's live-birth outcomes for my age and diagnosis?",
      "What local law applies to donor material, embryo storage, and treatment eligibility?",
    ],
  },
  {
    slug: "knee-arthroscopy",
    name: "Knee Arthroscopy",
    category: "Orthopaedic",
    searchTerms: ["arthroscopic knee surgery", "meniscus surgery", "knee scope", "knee keyhole surgery"],
    description:
      "A camera-guided procedure through small incisions to assess or treat selected knee-joint problems. Diagnostic arthroscopy, meniscus repair, and ligament reconstruction are different procedures and should not share a single price assumption.",
    indications: [
      "Selected meniscus tears or loose fragments after clinical assessment",
      "Persistent mechanical symptoms when imaging and examination support surgery",
      "A specialist recommends arthroscopy after discussing non-operative options",
    ],
    duration: "About 30 minutes to 2 hours depending on the repair",
    hospitalStay: "Often day surgery; longer if a more complex repair is performed",
    recovery: "Several weeks; rehabilitation varies by the procedure performed",
    prices: {
      us: { low: 3485, high: 3485, qualifier: "about" },
      eu: { low: 2500, high: 22000 },
      australia: { low: 4610, high: 4610, currency: "USD", qualifier: "about" },
      india: { low: 975, high: 3030 },
    },
    whyCheaper: [
      "A diagnostic scope and a repair with implants are not equivalent packages",
      "Facility, anesthesia, imaging, and physiotherapy may be billed separately",
      "Medical-tourism comparisons should specify the exact repair and follow-up plan",
    ],
    quality:
      "Arthroscopy is available at Indian orthopaedic centres. Ask for the operative plan, surgeon volume for that repair, implant details if applicable, and a written rehabilitation plan that can continue after travel.",
    risks: [
      "Infection, bleeding, stiffness, or blood clots",
      "Persistent symptoms if the underlying problem is not improved by arthroscopy",
      "Risks associated with anesthesia and post-operative travel",
    ],
    questionsToAsk: [
      "What exact procedure is included: diagnostic scope, meniscus repair, or another repair?",
      "Are implants, anesthesia, hospital stay, and physiotherapy included?",
      "When is it safe to fly and who will manage rehabilitation at home?",
    ],
  },
  {
    slug: "pacemaker-implantation",
    name: "Pacemaker Implantation",
    category: "Cardiac",
    searchTerms: ["heart pacemaker", "cardiac device implantation", "pacemaker surgery", "bradycardia device"],
    description:
      "Placement of a cardiac device to help regulate an abnormal heart rhythm. Single-, dual-, and multi-chamber devices have different device and procedure costs; the treating cardiologist determines the appropriate device.",
    indications: [
      "A heart-rhythm diagnosis for which a cardiologist recommends pacing",
      "Symptoms or rhythm findings assessed with ECG and specialist testing",
      "A device type selected for the patient's clinical condition",
    ],
    duration: "About 1–3 hours depending on the device and case",
    hospitalStay: "Often 1–3 nights for implantation and monitoring",
    recovery: "Several weeks of wound care and activity restrictions; device checks are ongoing",
    prices: {
      us: { low: 20000, high: 100000 },
      eu: { low: 13000, high: 13000, qualifier: "from" },
      australia: { low: 15406, high: 23674, currency: "AUD" },
      india: { low: 5200, high: 10800 },
    },
    whyCheaper: [
      "The device model and number of leads drive a large share of the total cost",
      "Hospital monitoring, follow-up programming, and complication coverage should be itemised",
      "A price comparison cannot establish which device is medically appropriate",
    ],
    quality:
      "Major Indian cardiac hospitals implant pacemakers and provide electrophysiology follow-up. Confirm the named cardiologist, device brand/model, emergency support, remote monitoring, and a plan for device checks after returning home.",
    risks: [
      "Bleeding, infection, lead displacement, or pneumothorax",
      "Device or lead problems requiring further procedures",
      "Need for lifelong device checks and battery replacement planning",
    ],
    questionsToAsk: [
      "Which device and lead configuration is recommended, and why?",
      "Does the estimate include the device, procedure, monitoring, and follow-up checks?",
      "Who will interrogate the device after I return home?",
    ],
  },
  {
    slug: "shoulder-replacement",
    name: "Shoulder Replacement (Shoulder Arthroplasty)",
    category: "Orthopaedic",
    searchTerms: ["shoulder arthroplasty", "shoulder implant", "reverse shoulder replacement", "shoulder joint replacement"],
    description:
      "Replacement of some or all damaged parts of the shoulder joint with an implant. Anatomic, reverse, partial, and revision replacements have different indications, implant requirements, and costs.",
    indications: [
      "Severe shoulder arthritis or joint damage after specialist assessment",
      "Selected complex fractures or rotator-cuff-related joint disease",
      "Persistent pain and functional limitation despite appropriate non-surgical care",
    ],
    duration: "About 2–3 hours",
    hospitalStay: "Usually 2–5 days, depending on recovery and hospital protocol",
    recovery: "Several months of staged rehabilitation; restrictions depend on implant and procedure",
    prices: {
      us: { low: 10000, high: 30000 },
      eu: { low: 7000, high: 25000 },
      australia: { low: 25189, high: 30383, currency: "AUD" },
      india: { low: 1500, high: 7000 },
    },
    whyCheaper: [
      "Implant type, brand, and revision status materially affect the hospital quote",
      "Rehabilitation and follow-up make up an important part of the total episode cost",
      "A package should identify the implant and any excluded physiotherapy or imaging",
    ],
    quality:
      "Indian tertiary orthopaedic hospitals perform shoulder arthroplasty. Ask whether the surgeon routinely performs the exact replacement type and whether implant records and rehabilitation instructions will travel with you.",
    risks: [
      "Infection, dislocation, fracture, or nerve injury",
      "Stiffness or implant loosening over time",
      "Long rehabilitation and the need for follow-up imaging",
    ],
    questionsToAsk: [
      "Is anatomic, reverse, partial, or revision replacement planned?",
      "Which implant manufacturer and model are included in the quote?",
      "What physiotherapy and follow-up will be available after travel?",
    ],
  },
  {
    slug: "tonsillectomy",
    name: "Tonsillectomy (Tonsil Removal)",
    category: "ENT",
    searchTerms: ["tonsil removal", "tonsil surgery", "tonsils removed", "tonsillitis operation"],
    description:
      "Surgical removal of the tonsils for selected recurrent infections, obstruction, or other conditions. Coblation, laser, and conventional techniques differ; adenoid removal may be a separate or combined procedure.",
    indications: [
      "Recurrent tonsillitis meeting a clinician's criteria",
      "Obstructive symptoms or sleep-disordered breathing assessed by an ENT specialist",
      "Other tonsil conditions for which surgery is recommended",
    ],
    duration: "About 30–90 minutes",
    hospitalStay: "Often day surgery or one night of observation",
    recovery: "Usually 1–2 weeks; pain can persist during healing",
    prices: {
      us: { low: 6500, high: 9800 },
      eu: { low: 3000, high: 6500 },
      australia: { low: 4810, high: 4810, currency: "AUD" },
      india: { low: 1500, high: 3300 },
    },
    whyCheaper: [
      "Technique, hospital setting, anesthesia, and whether adenoids are removed affect the package",
      "The Australian price is a self-pay tonsil-removal package but excludes specialist consultation and follow-up",
      "Written quotes should state whether the procedure is outpatient or inpatient",
    ],
    quality:
      "ENT departments at major Indian hospitals perform tonsillectomy using standard techniques. Ask about the surgeon's approach, bleeding-management plan, post-operative pain control, and access to urgent care after discharge.",
    risks: [
      "Post-operative bleeding, which may require urgent treatment",
      "Pain, dehydration, nausea, or infection during recovery",
      "Anesthesia-related complications",
    ],
    questionsToAsk: [
      "Is adenoid removal included or is this tonsillectomy alone?",
      "Which technique is planned and what is included in the quote?",
      "What emergency contact and follow-up are available after discharge?",
    ],
  },
];

export const surgeries: Surgery[] = surgeryDrafts.map((surgery) => ({
  ...surgery,
  priceEvidence: surgeryPriceEvidence[surgery.slug] ?? [],
}));

/**
 * Get all unique surgery categories.
 */
export function getSurgerCategories(): string[] {
  return [...new Set(surgeries.map((s) => s.category))];
}

/** Select a representative value without pretending that a starting price is a full range. */
export function priceReferencePoint(price: PriceRange): number {
  return price.qualifier === "from" ? price.low : priceMidpoint(price);
}

/** Describe the exact arithmetic basis used for an India/US percentage comparison. */
export function priceComparisonBasis(india: PriceRange, us: PriceRange): string {
  const describe = (market: string, price: PriceRange) => {
    if (price.qualifier === "from") return `${market} starting price`;
    if (price.qualifier === "about") return `${market} published point estimate`;
    if (price.low === price.high) return `${market} published figure`;
    return `${market} range midpoint`;
  };
  return `${describe("India", india)} vs ${describe("US", us)}`;
}

/**
 * Find surgery by slug.
 */
export function getSurgerBySlug(slug: string): Surgery | undefined {
  return surgeries.find((s) => s.slug === slug);
}

/**
 * Get surgeries by category.
 */
export function getSurgerByCategory(category: string): Surgery[] {
  return surgeries.filter((s) => s.category === category);
}

/** Calculate the selected price-reference difference; positive results are floored and capped below 100%. */
export function surgerySavingsPercent(usPrice: number, indiaPrice: number): number {
  if (!Number.isFinite(usPrice) || usPrice <= 0 || !Number.isFinite(indiaPrice) || indiaPrice < 0) return 0;
  const raw = ((usPrice - indiaPrice) / usPrice) * 100;
  if (raw >= 0) return Math.min(99.9, Math.floor(raw * 10) / 10);
  return Math.round(raw * 10) / 10;
}

/** Format a source-currency price range. */
export function formatRange(low: number, high: number, currency: PriceRange["currency"] = "USD"): string {
  const prefix = currency === "AUD" ? "A$" : currency === "EUR" ? "€" : "$";
  const format = (value: number) => `${prefix}${value.toLocaleString("en-US")}`;
  return low === high ? format(low) : `${format(low)}–${format(high)}`;
}

export function formatPrice(price: PriceRange | null, market?: string): string {
  if (!price) return "No comparable published range";
  let formatted = formatRange(price.low, price.high, price.currency);
  if (market === "Australia" && price.currency === "USD") formatted = `US${formatted}`;
  if (price.qualifier === "from") return `From ${formatted}`;
  if (price.qualifier === "about") return `About ${formatted}`;
  return formatted;
}

export function priceMidpoint(price: PriceRange): number {
  return (price.low + price.high) / 2;
}

/** Search surgeries by title, category, description, or alternate medical/local terms. */
export function searchSurgeries(query: string): Surgery[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];
  return surgeries.filter((surgery) =>
    [surgery.name, surgery.category, surgery.description, ...(surgery.searchTerms ?? [])]
      .some((value) => value.toLocaleLowerCase().includes(normalized)),
  );
}