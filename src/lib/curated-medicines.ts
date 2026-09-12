/**
 * Curated high-savings medicine reference set.
 *
 * Prices are stored in USD cents and reflect publicly reported reference ranges:
 *  - US/EU column: published list / typical retail pharmacy price for the pack described.
 *  - India column: typical Indian retail market price (street price actually paid at pharmacy),
 *    not the printed MRP, converted to USD.
 *
 * These are reference ranges for education, not live quotations.
 */

export type CuratedTuple = [
  salt: string,
  brandNames: string,
  category: string,
  therapyArea: string,
  form: string,
  strength: string,
  packSize: string,
  company: string,
  usEuPriceCents: number,
  indiaPriceCents: number,
  useCases: string,
  dosage: string,
];

export const curatedSource =
  "Public reference ranges: US list/retail pricing vs Indian retail pharmacy market pricing (converted to USD).";

export const curatedMedicines: CuratedTuple[] = [
  // ---------------- Hepatitis C: the classic 100x gap ----------------
  ["Sofosbuvir", "Sovaldi, MyHep, Hepcvir", "Life Saving Drug", "Hepatology", "Tablet", "400 mg", "28 tablets", "Natco / Mylan India", 2800000, 24000, "Chronic hepatitis C infection, used in combination antiviral regimens", "Usually 400 mg once daily with food, for 12 weeks, combined with another direct-acting antiviral."],
  ["Sofosbuvir + Velpatasvir", "Epclusa, Velpanat, MyHep All", "Life Saving Drug", "Hepatology", "Tablet", "400 mg + 100 mg", "28 tablets", "Natco", 2450000, 32000, "Pan-genotypic hepatitis C cure regimen", "One tablet once daily for 12 weeks, with or without food."],
  ["Ledipasvir + Sofosbuvir", "Harvoni, Ledifos", "Life Saving Drug", "Hepatology", "Tablet", "90 mg + 400 mg", "28 tablets", "Hetero", 3150000, 28000, "Hepatitis C genotype 1, 4, 5, 6 treatment", "One tablet once daily for 8 to 12 weeks as advised."],
  ["Daclatasvir", "Daklinza, Natdac", "Life Saving Drug", "Hepatology", "Tablet", "60 mg", "28 tablets", "Natco", 2100000, 19000, "Hepatitis C combination therapy with sofosbuvir", "60 mg once daily for 12 weeks alongside sofosbuvir."],

  // ---------------- Oncology: targeted therapy ----------------
  ["Imatinib", "Gleevec, Veenat", "Life Saving Drug", "Oncology", "Tablet", "400 mg", "30 tablets", "Natco", 1050000, 12000, "Chronic myeloid leukaemia, GIST", "Commonly 400 mg once daily with a meal and a large glass of water."],
  ["Erlotinib", "Tarceva, Erlonat", "Life Saving Drug", "Oncology", "Tablet", "150 mg", "30 tablets", "Natco", 850000, 22000, "EGFR-mutated non-small cell lung cancer", "150 mg once daily at least one hour before or two hours after food."],
  ["Gefitinib", "Iressa, Geftinat", "Life Saving Drug", "Oncology", "Tablet", "250 mg", "30 tablets", "Natco", 780000, 14000, "EGFR-mutated advanced lung cancer", "250 mg once daily, with or without food."],
  ["Osimertinib", "Tagrisso, Osicent", "Life Saving Drug", "Oncology", "Tablet", "80 mg", "30 tablets", "Incepta / Hetero", 1750000, 95000, "EGFR T790M positive advanced lung cancer", "80 mg once daily at the same time each day."],
  ["Lenalidomide", "Revlimid, Lenalid", "Life Saving Drug", "Oncology", "Capsule", "25 mg", "30 capsules", "Natco", 2200000, 42000, "Multiple myeloma, myelodysplastic syndrome", "25 mg once daily on days 1-21 of a 28 day cycle, as prescribed."],
  ["Bortezomib", "Velcade, Bortenat", "Life Saving Drug", "Oncology", "Injection", "3.5 mg", "1 vial", "Natco", 145000, 12000, "Multiple myeloma, mantle cell lymphoma", "Given by a clinician as subcutaneous or IV injection on a defined cycle schedule."],
  ["Abiraterone", "Zytiga, Abirapro", "Life Saving Drug", "Oncology", "Tablet", "250 mg", "120 tablets", "Glenmark", 1150000, 48000, "Metastatic castration-resistant prostate cancer", "1000 mg once daily on an empty stomach with prednisolone."],
  ["Enzalutamide", "Xtandi, Bdenza", "Life Saving Drug", "Oncology", "Capsule", "40 mg", "112 capsules", "BDR Pharma", 1380000, 78000, "Advanced prostate cancer", "160 mg once daily, with or without food."],
  ["Sunitinib", "Sutent, Sunitix", "Life Saving Drug", "Oncology", "Capsule", "50 mg", "28 capsules", "Cipla", 1620000, 55000, "Renal cell carcinoma, GIST, pancreatic NET", "50 mg once daily for 4 weeks followed by 2 weeks off, as prescribed."],
  ["Sorafenib", "Nexavar, Soranib", "Life Saving Drug", "Oncology", "Tablet", "200 mg", "120 tablets", "Cipla", 1900000, 62000, "Hepatocellular, renal and thyroid carcinoma", "400 mg twice daily without food."],
  ["Pazopanib", "Votrient, Pazonib", "Life Saving Drug", "Oncology", "Tablet", "400 mg", "60 tablets", "Cipla", 1450000, 58000, "Renal cell carcinoma, soft tissue sarcoma", "800 mg once daily on an empty stomach."],
  ["Everolimus", "Afinitor, Evertor", "Life Saving Drug", "Oncology", "Tablet", "10 mg", "30 tablets", "Torrent", 1580000, 45000, "Advanced breast, renal and neuroendocrine tumours", "10 mg once daily at the same time each day."],
  ["Capecitabine", "Xeloda, Capegard", "Life Saving Drug", "Oncology", "Tablet", "500 mg", "60 tablets", "Cipla", 78000, 6500, "Colorectal and breast cancer chemotherapy", "Dose calculated by body surface area, taken twice daily after food."],
  ["Temozolomide", "Temodar, Temoget", "Life Saving Drug", "Oncology", "Capsule", "100 mg", "5 capsules", "Natco", 620000, 12000, "Glioblastoma and malignant glioma protocols", "Dose by body surface area, once daily on an empty stomach for defined days."],
  ["Pemetrexed", "Alimta, Pemgem", "Life Saving Drug", "Oncology", "Injection", "500 mg", "1 vial", "Dr. Reddy's", 285000, 14000, "Non-squamous NSCLC and mesothelioma", "500 mg/m2 IV infusion every 21 days with folic acid and B12 support."],
  ["Docetaxel", "Taxotere, Docetere", "Life Saving Drug", "Oncology", "Injection", "80 mg", "1 vial", "Intas", 96000, 4200, "Breast, lung, prostate and gastric cancer", "Given as IV infusion every 3 weeks by an oncology team."],
  ["Trastuzumab", "Herceptin, Canmab, Hertraz", "Life Saving Drug", "Oncology", "Injection", "440 mg", "1 vial", "Biocon / Mylan", 265000, 48000, "HER2-positive breast and gastric cancer", "Loading then maintenance IV infusion every 1 or 3 weeks under supervision."],
  ["Bevacizumab", "Avastin, Bevacirel, Cizumab", "Life Saving Drug", "Oncology", "Injection", "400 mg", "1 vial", "Reliance / Hetero", 245000, 32000, "Colorectal, lung, renal and ovarian cancer", "IV infusion every 2 or 3 weeks based on the protocol."],
  ["Rituximab", "Rituxan, Reditux, Maball", "Life Saving Drug", "Oncology", "Injection", "500 mg", "1 vial", "Dr. Reddy's", 425000, 42000, "Non-Hodgkin lymphoma, CLL, rheumatoid arthritis", "IV infusion under close monitoring on a protocol schedule."],
  ["Zoledronic Acid", "Zometa, Zoldria", "Injection", "Oncology", "Injection", "4 mg", "1 vial", "Natco", 62000, 1800, "Bone metastasis, hypercalcaemia of malignancy, osteoporosis", "4 mg IV infusion over 15 minutes every 3 to 4 weeks or as advised."],
  ["Pegfilgrastim", "Neulasta, Pegex", "Life Saving Drug", "Oncology", "Injection", "6 mg", "1 prefilled syringe", "Intas", 620000, 11000, "Prevention of chemotherapy induced neutropenia", "Single 6 mg subcutaneous injection about 24 hours after chemotherapy."],
  ["Filgrastim", "Neupogen, Grafeel", "Injection", "Oncology", "Injection", "300 mcg", "1 vial", "Dr. Reddy's", 32000, 900, "Neutropenia support during chemotherapy", "Daily subcutaneous injection as directed by the oncology team."],

  // ---------------- Autoimmune / biologics ----------------
  ["Adalimumab", "Humira, Exemptia", "Life Saving Drug", "Immunology", "Injection", "40 mg", "1 prefilled syringe", "Zydus Cadila", 680000, 22000, "Rheumatoid arthritis, psoriasis, Crohn's disease", "40 mg subcutaneously every other week, or as prescribed."],
  ["Etanercept", "Enbrel, Intacept", "Life Saving Drug", "Immunology", "Injection", "25 mg", "4 vials", "Intas", 590000, 19000, "Rheumatoid arthritis, ankylosing spondylitis, psoriasis", "25 mg twice weekly or 50 mg weekly subcutaneously."],
  ["Tofacitinib", "Xeljanz, Tofacinix", "Medicine", "Immunology", "Tablet", "5 mg", "30 tablets", "Torrent", 520000, 4200, "Moderate to severe rheumatoid arthritis and ulcerative colitis", "5 mg twice daily, with or without food."],
  ["Baricitinib", "Olumiant, Baricinix", "Medicine", "Immunology", "Tablet", "4 mg", "28 tablets", "Torrent", 480000, 5200, "Rheumatoid arthritis, severe alopecia areata", "2 to 4 mg once daily as prescribed."],
  ["Infliximab", "Remicade, Infimab", "Life Saving Drug", "Immunology", "Injection", "100 mg", "1 vial", "Epirus / Ranbaxy", 145000, 26000, "Crohn's disease, ulcerative colitis, rheumatoid arthritis", "IV infusion at weeks 0, 2, 6 then every 8 weeks."],
  ["Hydroxychloroquine", "Plaquenil, HCQS", "Medicine", "Immunology", "Tablet", "200 mg", "30 tablets", "Ipca", 7500, 180, "Rheumatoid arthritis, lupus, malaria prophylaxis", "200 to 400 mg daily with food, with periodic eye checks."],
  ["Methotrexate", "Trexall, Folitrax", "Medicine", "Immunology", "Tablet", "10 mg", "10 tablets", "Ipca", 6200, 150, "Rheumatoid arthritis, psoriasis, low dose oncology use", "Weekly single dose with folic acid support on other days."],

  // ---------------- Multiple sclerosis / neurology ----------------
  ["Fingolimod", "Gilenya, Fingus", "Life Saving Drug", "Neurology", "Capsule", "0.5 mg", "28 capsules", "Intas", 830000, 9500, "Relapsing forms of multiple sclerosis", "0.5 mg once daily with first-dose cardiac monitoring."],
  ["Dimethyl Fumarate", "Tecfidera, Dimefu", "Medicine", "Neurology", "Capsule", "240 mg", "60 capsules", "Zydus", 780000, 8200, "Relapsing remitting multiple sclerosis", "240 mg twice daily after an initial lower dose period."],
  ["Teriflunomide", "Aubagio, Terifly", "Medicine", "Neurology", "Tablet", "14 mg", "28 tablets", "Cipla", 720000, 7200, "Relapsing multiple sclerosis", "14 mg once daily with liver function monitoring."],
  ["Riluzole", "Rilutek, Rilutor", "Life Saving Drug", "Neurology", "Tablet", "50 mg", "60 tablets", "Sun Pharma", 92000, 3200, "Amyotrophic lateral sclerosis", "50 mg twice daily, one hour before or two hours after meals."],
  ["Pregabalin", "Lyrica, Pregabid", "Medicine", "Neurology", "Capsule", "75 mg", "30 capsules", "Intas", 42000, 320, "Neuropathic pain, fibromyalgia, adjunct epilepsy", "75 mg twice daily, titrated as tolerated."],
  ["Levetiracetam", "Keppra, Levipil", "Medicine", "Neurology", "Tablet", "500 mg", "30 tablets", "Intas", 18000, 260, "Partial onset and generalised seizures", "500 mg twice daily, adjusted by response and renal function."],

  // ---------------- Diabetes and metabolic ----------------
  ["Semaglutide", "Ozempic, Rybelsus", "Injection", "Endocrinology", "Injection", "1 mg/dose pen", "1 pen", "Novo Nordisk India", 96000, 22000, "Type 2 diabetes, weight management support", "Weekly subcutaneous injection, titrated slowly from a low dose."],
  ["Liraglutide", "Victoza, Lirafit", "Injection", "Endocrinology", "Injection", "6 mg/ml pen", "1 pen", "USV India", 82000, 14000, "Type 2 diabetes glycaemic control", "Daily subcutaneous injection with gradual dose escalation."],
  ["Sitagliptin", "Januvia, Istavel", "Medicine", "Endocrinology", "Tablet", "100 mg", "30 tablets", "Sun Pharma", 55000, 1100, "Type 2 diabetes as monotherapy or add-on", "100 mg once daily, adjusted in renal impairment."],
  ["Dapagliflozin", "Farxiga, Forxiga, Dapanorm", "Medicine", "Endocrinology", "Tablet", "10 mg", "28 tablets", "Torrent", 58000, 1200, "Type 2 diabetes, heart failure, chronic kidney disease", "10 mg once daily in the morning."],
  ["Empagliflozin", "Jardiance, Gibtulio", "Medicine", "Endocrinology", "Tablet", "10 mg", "28 tablets", "Lupin", 62000, 1400, "Type 2 diabetes with cardiovascular and renal benefit", "10 mg once daily, may increase to 25 mg."],
  ["Insulin Glargine", "Lantus, Basalog, Glaritus", "Injection", "Endocrinology", "Cartridge", "100 IU/ml 3 ml", "1 cartridge", "Biocon / Wockhardt", 28000, 2400, "Long acting basal insulin for type 1 and 2 diabetes", "Once daily subcutaneous injection at a fixed time."],
  ["Insulin Aspart", "NovoRapid, Novolog", "Injection", "Endocrinology", "Penfill", "100 IU/ml 3 ml", "1 penfill", "Novo Nordisk India", 26000, 2100, "Rapid acting mealtime insulin", "Injected just before meals as per titration plan."],
  ["Metformin", "Glucophage, Glycomet", "Medicine", "Endocrinology", "Tablet", "500 mg", "30 tablets", "USV", 5600, 90, "First line therapy for type 2 diabetes", "500 mg once or twice daily with meals, titrated upward."],
  ["Levothyroxine", "Synthroid, Thyronorm", "Medicine", "Endocrinology", "Tablet", "100 mcg", "100 tablets", "Abbott India", 24000, 180, "Hypothyroidism replacement therapy", "Once daily on an empty stomach, 30 to 60 minutes before breakfast."],

  // ---------------- Cardiology ----------------
  ["Apixaban", "Eliquis, Apixabid", "Life Saving Drug", "Cardiology", "Tablet", "5 mg", "60 tablets", "Natco", 62000, 1800, "Stroke prevention in atrial fibrillation, DVT and PE", "5 mg twice daily, reduced dose in specific risk groups."],
  ["Rivaroxaban", "Xarelto, Xarelto generic", "Life Saving Drug", "Cardiology", "Tablet", "20 mg", "28 tablets", "Zydus", 58000, 1600, "Anticoagulation for AF, DVT and PE", "20 mg once daily with the evening meal."],
  ["Ticagrelor", "Brilinta, Axcer", "Life Saving Drug", "Cardiology", "Tablet", "90 mg", "56 tablets", "Sun Pharma", 46000, 2200, "Acute coronary syndrome antiplatelet therapy", "90 mg twice daily with low dose aspirin."],
  ["Sacubitril + Valsartan", "Entresto, Azmarda", "Life Saving Drug", "Cardiology", "Tablet", "50 mg", "56 tablets", "Novartis India", 62000, 3600, "Chronic heart failure with reduced ejection fraction", "Twice daily dosing, uptitrated every 2 to 4 weeks."],
  ["Ivabradine", "Corlanor, Ivabrad", "Medicine", "Cardiology", "Tablet", "5 mg", "28 tablets", "Torrent", 48000, 1200, "Chronic heart failure and stable angina", "5 mg twice daily with meals, adjusted by heart rate."],
  ["Atorvastatin", "Lipitor, Atorva", "Medicine", "Cardiology", "Tablet", "20 mg", "30 tablets", "Zydus", 12000, 190, "High cholesterol and cardiovascular risk reduction", "10 to 80 mg once daily, usually in the evening."],
  ["Rosuvastatin", "Crestor, Rosuvas", "Medicine", "Cardiology", "Tablet", "10 mg", "30 tablets", "Sun Pharma", 9800, 210, "Dyslipidaemia and cardiovascular prevention", "5 to 40 mg once daily at any time of day."],
  ["Clopidogrel", "Plavix, Clopilet", "Medicine", "Cardiology", "Tablet", "75 mg", "30 tablets", "Sun Pharma", 7000, 150, "Antiplatelet therapy after stent or stroke", "75 mg once daily, usually long term."],
  ["Enoxaparin", "Lovenox, Clexane", "Injection", "Cardiology", "Prefilled Syringe", "40 mg/0.4 ml", "1 syringe", "Bharat Serums", 12000, 900, "DVT prophylaxis and treatment, ACS", "Subcutaneous injection once or twice daily by weight."],

  // ---------------- Respiratory ----------------
  ["Fluticasone + Salmeterol", "Advair, Seroflo", "Medicine", "Respiratory", "Inhaler", "250 mcg + 25 mcg", "1 inhaler 120 doses", "Cipla", 48000, 1400, "Asthma and COPD maintenance therapy", "Two inhalations twice daily with mouth rinsing after use."],
  ["Budesonide + Formoterol", "Symbicort, Foracort", "Medicine", "Respiratory", "Inhaler", "200 mcg + 6 mcg", "1 inhaler 120 doses", "Cipla", 42000, 1300, "Asthma and COPD control therapy", "One to two inhalations twice daily as prescribed."],
  ["Tiotropium", "Spiriva, Tiova", "Medicine", "Respiratory", "Inhaler", "18 mcg", "30 capsules", "Cipla", 52000, 1500, "COPD long acting bronchodilator", "One inhalation capsule once daily at the same time."],
  ["Salbutamol", "Ventolin, Asthalin", "Medicine", "Respiratory", "Inhaler", "100 mcg", "1 inhaler 200 doses", "Cipla", 6500, 180, "Rescue bronchodilator for asthma and COPD", "Two puffs as needed for breathlessness, up to prescribed limit."],
  ["Omalizumab", "Xolair, Omalizumab biosimilar", "Life Saving Drug", "Respiratory", "Injection", "150 mg", "1 vial", "Torrent", 185000, 42000, "Severe allergic asthma and chronic urticaria", "Subcutaneous injection every 2 or 4 weeks by weight and IgE."],

  // ---------------- Infectious disease / HIV / TB ----------------
  ["Tenofovir + Lamivudine + Dolutegravir", "TLD, Tafnat", "Life Saving Drug", "Infectious Disease", "Tablet", "300 + 300 + 50 mg", "30 tablets", "Hetero / Cipla", 180000, 900, "First line HIV antiretroviral therapy", "One tablet once daily at the same time every day."],
  ["Dolutegravir", "Tivicay, Dolutegravir generic", "Life Saving Drug", "Infectious Disease", "Tablet", "50 mg", "30 tablets", "Cipla", 165000, 800, "HIV integrase inhibitor therapy", "50 mg once daily, dose adjusted with certain interactions."],
  ["Emtricitabine + Tenofovir", "Truvada, Tavin-EM", "Life Saving Drug", "Infectious Disease", "Tablet", "200 mg + 300 mg", "30 tablets", "Emcure", 190000, 1200, "HIV treatment and pre-exposure prophylaxis", "One tablet once daily with regular renal monitoring."],
  ["Bedaquiline", "Sirturo", "Life Saving Drug", "Infectious Disease", "Tablet", "100 mg", "24 tablets", "Janssen India", 300000, 26000, "Multidrug resistant tuberculosis regimens", "Loading then thrice weekly dosing under DOTS supervision."],
  ["Meropenem", "Merrem, Meronem", "Injection", "Infectious Disease", "Vial", "1 g", "1 vial", "Cipla", 12000, 700, "Severe hospital acquired bacterial infections", "1 g IV every 8 hours, adjusted for renal function."],
  ["Linezolid", "Zyvox, Linospan", "Medicine", "Infectious Disease", "Tablet", "600 mg", "10 tablets", "Cipla", 88000, 1400, "Resistant gram positive infections including MRSA", "600 mg twice daily for the prescribed duration."],
  ["Colistin", "Coly-Mycin, Colistimethate", "Injection", "Infectious Disease", "Vial", "1 MIU", "1 vial", "Cipla", 14000, 800, "Carbapenem resistant gram negative infections", "IV dosing by weight and renal function in hospital settings."],
  ["Liposomal Amphotericin B", "AmBisome, Fungisome", "Life Saving Drug", "Infectious Disease", "Injection", "50 mg", "1 vial", "Bharat Serums", 42000, 8500, "Severe systemic fungal infection, mucormycosis", "IV infusion by weight under specialist supervision."],
  ["Voriconazole", "Vfend, Vozole", "Medicine", "Infectious Disease", "Tablet", "200 mg", "10 tablets", "Cipla", 62000, 2200, "Invasive aspergillosis and serious fungal infection", "Loading dose then 200 mg twice daily before or after food."],
  ["Valganciclovir", "Valcyte, Valcept", "Life Saving Drug", "Infectious Disease", "Tablet", "450 mg", "60 tablets", "Cipla", 320000, 22000, "CMV retinitis and transplant CMV prophylaxis", "900 mg once or twice daily with food as prescribed."],
  ["Artemether + Lumefantrine", "Coartem, Lumether", "Medicine", "Infectious Disease", "Tablet", "80 mg + 480 mg", "6 tablets", "Ipca", 18000, 350, "Uncomplicated falciparum malaria", "Six dose regimen over three days taken with fatty food."],

  // ---------------- Transplant / nephrology ----------------
  ["Tacrolimus", "Prograf, Pangraf", "Life Saving Drug", "Transplant", "Capsule", "1 mg", "60 capsules", "Panacea", 145000, 3200, "Prevention of organ transplant rejection", "Twice daily dosing adjusted to blood trough levels."],
  ["Mycophenolate Mofetil", "CellCept, Mycept", "Life Saving Drug", "Transplant", "Tablet", "500 mg", "60 tablets", "Panacea", 98000, 2400, "Transplant immunosuppression and lupus nephritis", "500 to 1000 mg twice daily on an empty stomach."],
  ["Cyclosporine", "Neoral, Panimun Bioral", "Life Saving Drug", "Transplant", "Capsule", "100 mg", "50 capsules", "Panacea", 88000, 2800, "Transplant rejection prophylaxis, severe autoimmune disease", "Divided twice daily dosing with therapeutic drug monitoring."],
  ["Erythropoietin", "Epogen, Eprex, Hemax", "Life Saving Drug", "Nephrology", "Injection", "4000 IU", "1 prefilled syringe", "Intas Biopharma", 34000, 3200, "Anaemia in chronic kidney disease and oncology", "Subcutaneous injection two to three times weekly by response."],
  ["Darbepoetin Alfa", "Aranesp, Cresp", "Life Saving Drug", "Nephrology", "Injection", "40 mcg", "1 prefilled syringe", "Dr. Reddy's", 52000, 4200, "Anaemia management in chronic kidney disease", "Weekly or fortnightly subcutaneous injection."],
  ["Ferric Carboxymaltose", "Injectafer, Encicarb", "Injection", "Nephrology", "Injection", "500 mg", "1 vial", "Emcure", 96000, 4800, "Iron deficiency anaemia requiring IV iron", "Single or split IV infusion under medical supervision."],
  ["Sevelamer", "Renagel, Renvela", "Medicine", "Nephrology", "Tablet", "800 mg", "30 tablets", "Sun Pharma", 42000, 1600, "Hyperphosphataemia in dialysis patients", "One to two tablets with each meal as prescribed."],

  // ---------------- Haematology / rare disease ----------------
  ["Deferasirox", "Exjade, Desirox", "Life Saving Drug", "Haematology", "Tablet", "500 mg", "30 tablets", "Cipla", 420000, 6800, "Chronic iron overload from repeated transfusions", "Once daily dose by body weight, taken on an empty stomach."],
  ["Eltrombopag", "Promacta, Revolade, Eltrocip", "Life Saving Drug", "Haematology", "Tablet", "50 mg", "28 tablets", "Cipla", 920000, 28000, "Chronic immune thrombocytopenia, aplastic anaemia", "50 mg once daily away from dairy and antacids."],
  ["Emicizumab", "Hemlibra", "Life Saving Drug", "Haematology", "Injection", "105 mg", "1 vial", "Roche India", 1450000, 480000, "Haemophilia A prophylaxis", "Weekly to monthly subcutaneous dosing by weight."],
  ["Human Albumin", "Albumin 20%", "Injection", "Critical Care", "Infusion", "20% 100 ml", "1 bottle", "Reliance Life Sciences", 48000, 5200, "Hypoalbuminaemia and critical care volume support", "IV infusion rate and volume decided by the treating team."],
  ["Immunoglobulin IVIG", "Gamunex, Intacept IG", "Life Saving Drug", "Immunology", "Infusion", "5 g", "1 vial", "Intas", 145000, 42000, "Immunodeficiency, GBS, ITP and autoimmune neurology", "IV infusion by weight over several hours under supervision."],

  // ---------------- Ophthalmology ----------------
  ["Ranibizumab", "Lucentis, Razumab", "Life Saving Drug", "Ophthalmology", "Injection", "0.5 mg", "1 vial", "Intas", 190000, 12000, "Wet age related macular degeneration, diabetic macular oedema", "Intravitreal injection monthly or as per treat and extend plan."],
  ["Aflibercept", "Eylea, Aflibercept biosimilar", "Life Saving Drug", "Ophthalmology", "Injection", "2 mg", "1 vial", "Cipla", 210000, 36000, "Macular degeneration and retinal vein occlusion", "Intravitreal injection every 4 to 8 weeks by a retina specialist."],
  ["Latanoprost", "Xalatan, Latoprost", "Medicine", "Ophthalmology", "Eye Drops", "0.005% 2.5 ml", "1 bottle", "Sun Pharma", 8500, 220, "Open angle glaucoma and ocular hypertension", "One drop in the affected eye each evening."],

  // ---------------- Psychiatry ----------------
  ["Lurasidone", "Latuda, Lurace", "Medicine", "Psychiatry", "Tablet", "40 mg", "30 tablets", "Sun Pharma", 138000, 1800, "Schizophrenia and bipolar depression", "40 mg once daily with a meal of at least 350 calories."],
  ["Aripiprazole", "Abilify, Arip MT", "Medicine", "Psychiatry", "Tablet", "10 mg", "30 tablets", "Intas", 82000, 420, "Schizophrenia, bipolar disorder, adjunct depression", "10 to 15 mg once daily, with or without food."],
  ["Quetiapine", "Seroquel, Qutipin", "Medicine", "Psychiatry", "Tablet", "100 mg", "30 tablets", "Sun Pharma", 46000, 260, "Schizophrenia, bipolar disorder, adjunct therapy", "Titrated dosing usually at bedtime due to sedation."],
  ["Escitalopram", "Lexapro, Nexito", "Medicine", "Psychiatry", "Tablet", "10 mg", "30 tablets", "Sun Pharma", 22000, 190, "Depression and generalised anxiety disorder", "10 mg once daily, adjusted after clinical review."],
  ["Duloxetine", "Cymbalta, Duzela", "Medicine", "Psychiatry", "Capsule", "30 mg", "30 capsules", "Sun Pharma", 38000, 320, "Depression, anxiety, diabetic neuropathic pain", "30 to 60 mg once daily, swallowed whole."],

  // ---------------- Bone / endocrine ----------------
  ["Teriparatide", "Forteo, Bonista", "Life Saving Drug", "Endocrinology", "Injection", "250 mcg/ml pen", "1 pen", "Sun Pharma", 380000, 18000, "Severe osteoporosis with high fracture risk", "20 mcg subcutaneous injection once daily for up to 24 months."],
  ["Denosumab", "Prolia, Xgeva, Densmab", "Life Saving Drug", "Endocrinology", "Injection", "60 mg", "1 prefilled syringe", "Intas", 165000, 22000, "Osteoporosis and bone metastasis prevention", "60 mg subcutaneously every 6 months with calcium and vitamin D."],
  ["Alendronate", "Fosamax, Osteofos", "Medicine", "Endocrinology", "Tablet", "70 mg", "4 tablets", "Cipla", 9500, 220, "Osteoporosis treatment and prevention", "One tablet weekly on an empty stomach with plain water, stay upright 30 minutes."],

  // ---------------- Emergency / critical care ----------------
  ["Adrenaline Auto-Injector", "EpiPen, Adrenaline ampoule", "Life Saving Drug", "Emergency", "Auto-Injector", "0.3 mg", "1 device", "Cipla", 65000, 4500, "Emergency treatment of anaphylaxis", "Inject into outer thigh immediately at first sign of anaphylaxis, then call emergency services."],
  ["Naloxone", "Narcan, Nalox", "Life Saving Drug", "Emergency", "Injection", "0.4 mg/ml", "1 ampoule", "Rusan Pharma", 12000, 180, "Reversal of opioid overdose", "IV, IM or intranasal dosing repeated as needed until response."],
  ["Tranexamic Acid", "Cyklokapron, Texakind", "Injection", "Emergency", "Injection", "500 mg/5 ml", "1 ampoule", "Macleods", 4200, 90, "Major bleeding, trauma and surgical haemorrhage", "IV dosing per protocol, ideally within 3 hours of trauma."],
  ["Noradrenaline", "Levophed, Adrenor", "Injection", "Critical Care", "Injection", "2 mg/2 ml", "1 ampoule", "Neon Labs", 3800, 110, "Septic shock and severe hypotension", "Continuous IV infusion titrated to blood pressure in ICU."],

  // ---------------- Gastro / urology / common ----------------
  ["Mesalamine", "Asacol, Mesacol", "Medicine", "Gastroenterology", "Tablet", "800 mg", "30 tablets", "Sun Pharma", 42000, 1200, "Ulcerative colitis and Crohn's maintenance", "Divided daily dosing, swallowed whole without crushing."],
  ["Ursodeoxycholic Acid", "Actigall, Udiliv", "Medicine", "Gastroenterology", "Tablet", "300 mg", "30 tablets", "Abbott India", 38000, 900, "Cholestatic liver disease and gallstone dissolution", "Dose by body weight, usually divided twice or thrice daily."],
  ["Pantoprazole", "Protonix, Pantocid", "Medicine", "Gastroenterology", "Tablet", "40 mg", "30 tablets", "Sun Pharma", 6300, 150, "Acid reflux, ulcer treatment and prophylaxis", "40 mg once daily before breakfast."],
  ["Tamsulosin", "Flomax, Urimax", "Medicine", "Urology", "Capsule", "0.4 mg", "30 capsules", "Cipla", 9200, 190, "Benign prostatic hyperplasia symptoms", "0.4 mg once daily 30 minutes after the same meal."],
  ["Tadalafil", "Cialis, Tadact", "Medicine", "Urology", "Tablet", "10 mg", "10 tablets", "Cipla", 32000, 280, "Erectile dysfunction, BPH, pulmonary hypertension", "Dose and frequency depend on the indication."],
  ["Sildenafil", "Viagra, Revatio, Penegra", "Medicine", "Urology", "Tablet", "50 mg", "10 tablets", "Zydus", 38000, 240, "Erectile dysfunction and pulmonary arterial hypertension", "50 mg about one hour before activity, or three times daily for PAH."],

  // ---------------- Equipment ----------------
  ["Glucometer Kit", "AccuSure, Accu-Chek", "Equipment", "Home Monitoring", "Device", "Standard kit", "1 kit with 10 strips", "AccuSure", 6500, 850, "Home blood glucose self monitoring", "Follow the device manual; use a fresh lancet for each test."],
  ["Digital BP Monitor", "Omron, HealthSense", "Equipment", "Home Monitoring", "Device", "Upper arm cuff", "1 device", "Omron India", 9200, 1600, "Home blood pressure monitoring", "Measure seated after 5 minutes rest, arm supported at heart level."],
  ["Pulse Oximeter", "Dr Trust, BPL", "Equipment", "Home Monitoring", "Device", "Fingertip", "1 device", "Dr Trust", 4800, 550, "Oxygen saturation and pulse rate monitoring", "Place on a warm, still finger and read after the value stabilises."],
  ["Nebulizer Compressor", "Omron NE-C101, Philips", "Equipment", "Respiratory", "Device", "Compressor unit", "1 device", "Omron India", 12500, 1900, "Home delivery of nebulised respiratory medication", "Clean the mask and chamber after every use to prevent infection."],
  ["Oxygen Concentrator", "Philips EverFlo, BPL", "Equipment", "Respiratory", "Device", "5 litres per minute", "1 unit", "BPL Medical", 145000, 42000, "Home oxygen therapy for chronic hypoxaemia", "Use only at the flow rate prescribed by your physician."],
  ["CPAP Machine", "ResMed AirSense, Philips", "Equipment", "Respiratory", "Device", "Auto CPAP", "1 unit", "ResMed India", 98000, 32000, "Obstructive sleep apnoea therapy", "Nightly use with pressure settings from your sleep study."],
  ["Wheelchair", "Karma, Vissco", "Equipment", "Mobility", "Device", "Foldable steel", "1 unit", "Vissco", 32000, 8500, "Mobility support for limited ambulation", "Check brakes and tyre pressure before every use."],
  ["Infusion Pump", "B Braun, Nidus", "Equipment", "Critical Care", "Device", "Volumetric", "1 unit", "Nidus Medical", 185000, 62000, "Controlled IV fluid and drug delivery", "Operated only by trained clinical staff."],
];
