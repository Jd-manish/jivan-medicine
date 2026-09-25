/**
 * Surgery / Operation Cost Comparison — India vs US/EU/Australia.
 *
 * All prices are approximate USD ranges based on publicly available
 * hospital pricing (2024-2026). Sources: Medigo, Patients Beyond Border,
 * Medical Tourism Association, individual hospital published rates.
 *
 * TO ADD A NEW SURGERY: Just add an entry to the array below.
 * The page will automatically pick it up.
 */

export type Surgery = {
  slug: string;
  name: string;
  category: string;
  description: string;
  /** What the surgery treats / when you need it */
  indications: string[];
  /** Duration of the procedure */
  duration: string;
  /** Hospital stay */
  hospitalStay: string;
  /** Recovery time */
  recovery: string;
  prices: {
    us: { low: number; high: number };
    eu: { low: number; high: number };
    australia: { low: number; high: number };
    india: { low: number; high: number };
  };
  /** Why India is cheaper — specific factors */
  whyCheaper: string[];
  /** Quality notes — accreditation, success rates */
  quality: string;
  /** Risks to be aware of */
  risks: string[];
  /** Key questions to ask the hospital */
  questionsToAsk: string[];
};

export const surgeries: Surgery[] = [
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
      us: { low: 3500, high: 7000 },
      eu: { low: 2500, high: 5500 },
      australia: { low: 3000, high: 6000 },
      india: { low: 200, high: 800 },
    },
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
      us: { low: 2000, high: 5000 },
      eu: { low: 1800, high: 4000 },
      australia: { low: 2500, high: 5500 },
      india: { low: 300, high: 1000 },
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
      us: { low: 30000, high: 50000 },
      eu: { low: 15000, high: 30000 },
      australia: { low: 20000, high: 35000 },
      india: { low: 3500, high: 8000 },
    },
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
      us: { low: 30000, high: 60000 },
      eu: { low: 15000, high: 35000 },
      australia: { low: 20000, high: 40000 },
      india: { low: 4000, high: 9000 },
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
      us: { low: 15000, high: 35000 },
      eu: { low: 8000, high: 20000 },
      australia: { low: 10000, high: 25000 },
      india: { low: 2000, high: 5000 },
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
      us: { low: 50000, high: 150000 },
      eu: { low: 25000, high: 60000 },
      australia: { low: 30000, high: 80000 },
      india: { low: 5000, high: 15000 },
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
      us: { low: 80000, high: 200000 },
      eu: { low: 40000, high: 100000 },
      australia: { low: 50000, high: 120000 },
      india: { low: 5500, high: 18000 },
    },
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
      us: { low: 70000, high: 200000 },
      eu: { low: 30000, high: 80000 },
      australia: { low: 40000, high: 100000 },
      india: { low: 4500, high: 12000 },
    },
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
      us: { low: 25000, high: 50000 },
      eu: { low: 10000, high: 25000 },
      australia: { low: 15000, high: 35000 },
      india: { low: 1500, high: 5000 },
    },
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
      us: { low: 100000, high: 250000 },
      eu: { low: 50000, high: 100000 },
      australia: { low: 60000, high: 120000 },
      india: { low: 8000, high: 20000 },
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
      us: { low: 300000, high: 600000 },
      eu: { low: 150000, high: 300000 },
      australia: { low: 200000, high: 400000 },
      india: { low: 25000, high: 55000 },
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
      eu: { low: 4000, high: 10000 },
      australia: { low: 6000, high: 15000 },
      india: { low: 800, high: 2500 },
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
      us: { low: 15000, high: 35000 },
      eu: { low: 10000, high: 20000 },
      australia: { low: 12000, high: 25000 },
      india: { low: 3000, high: 7000 },
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
      australia: { low: 4000, high: 10000 },
      india: { low: 500, high: 2000 },
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
      us: { low: 3000, high: 6000 },
      eu: { low: 2000, high: 4500 },
      australia: { low: 3000, high: 7000 },
      india: { low: 300, high: 1000 },
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
      australia: { low: 10000, high: 30000 },
      india: { low: 2000, high: 6000 },
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
      eu: { low: 6000, high: 20000 },
      australia: { low: 8000, high: 30000 },
      india: { low: 1500, high: 6000 },
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
];

/**
 * Get all unique surgery categories.
 */
export function getSurgerCategories(): string[] {
  return [...new Set(surgeries.map((s) => s.category))];
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

/**
 * Calculate savings percentage — accurate to 1 decimal, capped at 99.9%.
 */
export function surgerySavingsPercent(usPrice: number, indiaPrice: number): number {
  if (!usPrice || usPrice <= 0) return 0;
  const raw = (1 - indiaPrice / usPrice) * 100;
  return Math.max(0, Math.min(99.9, Math.floor(raw * 10) / 10));
}

/**
 * Format price range as "$X,XXX – $Y,YYY".
 */
export function formatRange(low: number, high: number): string {
  return `$${low.toLocaleString("en-US")} – $${high.toLocaleString("en-US")}`;
}