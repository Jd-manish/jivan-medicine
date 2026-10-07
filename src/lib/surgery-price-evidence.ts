export type SurgeryMarket = "India" | "United States" | "Europe" | "Australia";

export type SurgeryPriceEvidence = {
  market: SurgeryMarket;
  publisher: string;
  label: string;
  url: string;
  /** The figure/range shown by the linked source, in the source's stated scope. */
  reportedPrice: string;
  /** Important limits such as insurance basis, procedure variant, or included items. */
  note: string;
};

const bookimed = (
  market: SurgeryMarket,
  country: string,
  procedure: string,
  label: string,
  reportedPrice: string,
  note = "Medical-tourism directory range/clinic quote; final package depends on diagnosis, hospital, technique, and inclusions.",
): SurgeryPriceEvidence => ({
  market,
  publisher: "Bookimed",
  label,
  url: `https://us-uk.bookimed.com/clinics/country=${country}/procedure=${procedure}/`,
  reportedPrice,
  note,
});

const india = (procedure: string, label: string, price: string, note?: string) =>
  bookimed("India", "india", procedure, label, price, note);
const us = (procedure: string, label: string, price: string, note?: string) =>
  bookimed("United States", "united-states", procedure, label, price, note);
const germany = (procedure: string, label: string, price: string, note?: string) =>
  bookimed("Europe", "germany", procedure, label, price, note);

const australia = (
  url: string,
  publisher: string,
  label: string,
  price: string,
  note: string,
): SurgeryPriceEvidence => ({ market: "Australia", publisher, label, url, reportedPrice: price, note });

/**
 * Price evidence is deliberately kept separate from the educational procedure
 * copy. Each displayed market has a clickable source and a scope note. Sources
 * report different package contents, insurance assumptions, procedure variants,
 * and currencies; they are reference benchmarks, not quotes or promises.
 */
export const surgeryPriceEvidence: Record<string, SurgeryPriceEvidence[]> = {
  "cataract-surgery": [
    { market: "India", publisher: "CureMeAbroad", label: "Cataract surgery cost per eye (2026)", url: "https://curemeabroad.com/blogs/cataract-surgery-cost-in-2026-prices-factors-and-insurance-options-explained", reportedPrice: "$600–$2,000 per eye", note: "The page reports a per-eye estimate; lens type, technique, and premium options can change the final price." },
    { market: "United States", publisher: "CureMeAbroad", label: "Cataract surgery cost per eye (2026)", url: "https://curemeabroad.com/blogs/cataract-surgery-cost-in-2026-prices-factors-and-insurance-options-explained", reportedPrice: "$3,500–$10,000 per eye", note: "The same country-comparison table reports per-eye estimates; lens choice, technique, and insurance affect actual payment." },
    germany("cataract-surgery-with-iol-replacement", "Cataract surgery in Germany", "$2,500–$5,500", "Private clinic price range; confirm whether the quoted figure is per eye and which IOL is included."),
    australia("https://www.comparethemarket.com.au/health-insurance/features/global-surgery-costs/", "Compare the Market Australia", "Global cataract-surgery comparison", "Australia A$4,700; Germany A$14,939; US A$6,186", "Cross-country published comparison, in Australian dollars; procedure and insurance scope differ from the Jivan estimate."),
  ],
  "lasik-eye-surgery": [
    { market: "India", publisher: "MapHospitals", label: "LASIK cost comparison (both eyes)", url: "https://www.maphospitals.com/blog/lasik-eye-surgery-abroad-costs-technology-what-to-expect", reportedPrice: "$500–$1,200 for both eyes", note: "Published medical-tourism comparison; technology, screening, follow-up, and package contents affect quotes." },
    { market: "United States", publisher: "MapHospitals", label: "LASIK cost comparison (both eyes)", url: "https://www.maphospitals.com/blog/lasik-eye-surgery-abroad-costs-technology-what-to-expect", reportedPrice: "$4,000–$6,000 for both eyes", note: "Published medical-tourism comparison; confirm technology, bilateral pricing, and included follow-up." },
    germany("ilasik", "LASIK eye surgery in Germany", "$919–$3,500", "Bookimed's page notes that some offers bundle accommodation or transfers; this range is not a uniform surgical-fee quote."),
    australia("https://www.healthdirect.gov.au/laser-eye-surgery", "Healthdirect Australia", "Laser eye surgery information and provider pathway", "Australian clinics quote individually", "No comparable national self-pay package range is published on this reference page; obtain a written bilateral quote."),
  ],
  "knee-replacement": [
    india("knee-replacement", "Knee-replacement prices in India", "$3,600–$6,600", "Bookimed's published package range; implant, revision status, and robotic assistance change the price."),
    us("knee-replacement", "Knee-replacement prices in the United States", "$30,000–$70,000", "Published private/self-pay estimates; hospital facility and implant costs vary widely."),
    germany("knee-replacement", "Knee-replacement prices in Germany", "$12,000–$23,500", "Published private clinic range; implant and inpatient/rehabilitation inclusions vary."),
    australia("https://www.comparethemarket.com.au/health-insurance/features/global-surgery-costs/", "Compare the Market Australia", "Global knee-replacement cost comparison", "Australia A$23,200; Germany A$29,667; US A$55,612", "Cross-country comparison in Australian dollars; not a guaranteed private-patient package quote."),
  ],
  "hip-replacement": [
    india("hip-replacement", "Hip-replacement prices in India", "$4,350–$8,000", "Bookimed clinic quotes; implant type, revision status, and length of stay affect the total."),
    us("hip-replacement", "Hip-replacement prices in the United States", "$40,000–$80,000", "Bookimed's published US cost comparison; coverage and facility charges can change patient liability."),
    germany("hip-replacement", "Hip-replacement prices in Germany", "$15,000–$35,000", "Published clinic/package ranges; procedure type and implant brand matter."),
    australia("https://www.comparethemarket.com.au/health-insurance/features/global-surgery-costs/", "Compare the Market Australia", "Global hip-replacement cost comparison", "Australia A$25,600; Germany A$12,018; US A$44,755", "Cross-country comparison in Australian dollars; patient charges differ by public/private status."),
  ],
  "acl-reconstruction": [
    india("anterior-cruciate-ligament-reconstruction", "ACL reconstruction in India", "$5,800–$8,650", "Bookimed clinic range; graft choice and whether meniscus repair is included matter."),
    us("anterior-cruciate-ligament-reconstruction", "ACL reconstruction in the United States", "About $27,500 (published average)", "The comparator cited on Bookimed's Germany page; actual US self-pay quotes depend on facility and graft."),
    germany("anterior-cruciate-ligament-reconstruction", "ACL reconstruction in Germany", "$10,000–$14,000", "Published clinic range; graft and inpatient package inclusions vary."),
    australia("https://drsamuelduff.com.au/payments-and-insurance/", "Dr Samuel Duff, orthopaedic surgeon (Australia)", "ACL reconstruction/repair self-pay estimate", "A$8,000–A$15,000", "Surgeon's estimate includes surgeon, anaesthetist, assistant, hospital fees, inpatient radiology and pharmaceuticals; not a national tariff."),
  ],
  "spinal-fusion": [
    india("operative-treatment-of-scoliosis", "Spinal deformity/fusion packages in India", "$18,000–$27,600 (quoted clinic examples)", "Bookimed clinic examples for scoliosis correction/spinal fusion; not a universal quote for every fusion level."),
    us("minimally-invasive-fusion-surgery", "Spinal fusion in the United States", "About $100,000 (published benchmark)", "Bookimed cites a US benchmark; level count, implants, complications, and inpatient stay materially affect price."),
    germany("manimally-invasive-fusion-surgery", "Minimally invasive fusion in Germany", "$40,000–$55,000", "Bookimed package estimates vary by spinal level and implant; the linked page describes package inclusions."),
    australia("https://www.healthdirect.gov.au/spinal-fusion", "Healthdirect Australia", "Spinal fusion information and provider pathway", "Australian hospitals quote individually", "A comparable nationwide uninsured package range is not published on this reference page; request an itemised hospital, surgeon, and anaesthetist estimate."),
  ],
  "heart-valve-replacement": [
    india("heart-valve-replacement", "Heart-valve replacement in India", "$6,000–$12,000", "Bookimed lists a wide range across Indian centres and valve types; open surgery and TAVI are not interchangeable."),
    us("heart-valve-replacement", "Heart-valve replacement in the United States", "$50,000–$150,000", "Published private-care range; valve type, inpatient days, and complications affect the total."),
    germany("heart-valve-replacement", "Heart-valve replacement in Germany", "$25,000–$60,000", "Private clinic estimates; open valve replacement and transcatheter procedures have different prices."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/", "Medibank Australia", "Australian private-hospital procedure-cost guide", "Hospital and doctor components vary by valve procedure", "Claims-based member costs are not equivalent to an uninsured international-patient package; request a procedure-specific written quote."),
  ],
  "coronary-artery-bypass": [
    india("coronary-artery-bypass-grafting", "CABG prices in India", "$5,500–$10,000", "Bookimed partner-clinic offers; number of grafts, ICU days, and case complexity affect total cost."),
    us("coronary-artery-bypass-grafting", "CABG prices in the United States", "$57,000–$150,000", "Indicative private/self-pay range; US bills can include separate surgeon, facility, ICU, and rehabilitation charges."),
    germany("coronary-artery-bypass-grafting", "CABG prices in Germany", "$30,000–$70,000", "Medical-tourism clinic/package range; case complexity and inpatient care drive variation."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/", "Medibank Australia", "Australian private-hospital procedure-cost guide", "CABG quotes are case-specific", "The linked guide explains claims-based cost estimates; it is not a single national uninsured price."),
  ],
  "angioplasty-stent": [
    india("coronary-angioplasty", "Coronary angioplasty/stenting in India", "$5,102 (published average); stent-only offers differ", "Bookimed's displayed average is for its defined procedure record; number and type of stents alter the package."),
    us("coronary-angioplasty", "Coronary angioplasty in the United States", "About $95,000 (published comparator)", "Bookimed Germany comparison cites this US benchmark; a one-stent international package is not directly comparable to a domestic hospital bill."),
    germany("coronary-angioplasty", "Coronary angioplasty in Germany", "$25,000–$45,000", "Bookimed's published range; number of stents and admission length affect total."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/", "Medibank Australia", "Australian private-hospital procedure-cost guide", "Quote depends on angioplasty/stent code and device", "Medibank claims data reflects insured Australian residents, not an international self-pay package."),
  ],
  "kidney-transplant": [
    india("kidney-transplant", "Kidney-transplant prices in India", "$14,000–$19,000", "Bookimed clinic quotes; includes differ by donor evaluation, length of stay, and post-operative care."),
    us("kidney-transplant", "Kidney-transplant US benchmark", "About $400,000 (published total-cost benchmark)", "Bookimed's international comparison; the figure is not a self-pay quote and may represent total episode cost."),
    germany("kidney-transplant", "Kidney-transplant prices in Germany", "$95,000–$140,000", "Bookimed reports a hospital-cost range; transplant eligibility and lawful donor arrangements are country-specific."),
    australia("https://www.healthdirect.gov.au/kidney-transplant", "Healthdirect Australia", "Australian kidney-transplant pathway", "Public-system eligibility and individual hospital costs apply", "There is no comparable lawful medical-tourism package tariff; transplant laws, donor consent, and eligibility must be reviewed by local specialists."),
  ],
  "liver-transplant": [
    india("liver-transplantation", "Liver-transplant prices in India", "$35,000–$55,000", "Bookimed clinic range; living/deceased donor pathway and complications change total cost."),
    us("liver-transplantation", "Liver-transplant US benchmark", "About $750,000 (published total-cost benchmark)", "Published medical-tourism comparison; not an out-of-pocket quote and not directly comparable to a clinic package."),
    germany("liver-transplantation", "Liver-transplant prices in Germany", "$250,000 (published starting benchmark)", "Published international comparison; patient eligibility and transplant-system rules vary by country."),
    australia("https://www.healthdirect.gov.au/liver-transplant", "Healthdirect Australia", "Australian liver-transplant pathway", "Public-system eligibility and individual hospital costs apply", "No comparable lawful self-pay medical-tourism package tariff is published; specialist assessment and donor-law compliance are essential."),
  ],
  "rhinoplasty": [
    india("rhinoplasty", "Rhinoplasty prices in India", "$850–$6,200 (procedure variants differ)", "Bookimed lists primary, tip, and revision rhinoplasty separately; these prices must not be treated as equivalent procedures."),
    us("rhinoplasty", "Rhinoplasty prices in the United States", "$5,000–$15,000", "Indicative private-care range; cosmetic versus functional procedure and surgeon fees change cost."),
    germany("rhinoplasty", "Rhinoplasty prices in Germany", "$4,000–$12,000", "Published clinic estimates; functional and revision procedures may cost more."),
    australia("https://www.comparethemarket.com.au/health-insurance/features/global-surgery-costs/", "Compare the Market Australia", "Global rhinoplasty comparison", "Australia A$10,300; Germany A$9,054; US A$9,525", "Published comparison in Australian dollars; cosmetic package inclusions differ by provider."),
  ],
  "bariatric-surgery": [
    india("bariatric-surgery", "Bariatric surgery in India", "$3,900–$8,000 (procedure-dependent)", "Bookimed clinic examples; sleeve gastrectomy, bypass, and revision surgery have different prices."),
    us("bariatric-surgery", "Bariatric surgery in the United States", "$15,000–$30,000", "Indicative self-pay range; procedure, facility, and insurance coverage differ."),
    germany("bariatric-surgery", "Bariatric surgery in Germany", "$12,000–$25,000", "Published clinic/package estimates; sleeve and bypass are not the same intervention."),
    australia("https://www.comparethemarket.com.au/health-insurance/features/global-surgery-costs/", "Compare the Market Australia", "Global gastric-bypass comparison", "Australia A$14,300; Germany A$13,993; US A$39,723", "Cross-country comparison in Australian dollars; the underlying item is gastric bypass, not every bariatric procedure."),
  ],
  "hernia-repair": [
    india("surgical-correction-of-umbilical-hernias", "Hernia repair in India", "$914–$3,400 (hernia type varies)", "Bookimed lists inguinal, umbilical, and incisional repair separately; the range is not a single procedure quote."),
    us("inguinal-hernia-repair", "Hernia repair in the United States", "$5,000–$15,000", "Indicative private/self-pay range; open/laparoscopic technique and emergency status affect total."),
    germany("inguinal-hernia-repair", "Hernia repair in Germany", "$3,000–$8,000", "Published private clinic range; type of hernia and inpatient stay change cost."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/", "Medibank Australia", "Australian private-hospital procedure-cost guide", "A procedure-specific private quote is required", "Claims-based insured-member cost data is not an uninsured international-patient package quote."),
  ],
  "dental-implant": [
    india("dental-implant", "Single dental-implant prices in India", "$500–$1,100", "Bookimed clinic prices; this is a single implant record and may not include crown, graft, or later visits."),
    us("dental-implant", "Dental implant prices in the United States", "$3,200 (published starting comparison)", "Bookimed comparison; implant, abutment, crown, imaging, and graft may be billed separately."),
    germany("dental-implant", "Dental implant prices in Germany", "$2,000–$4,500", "Indicative private clinic range; confirm implant brand and whether the crown is included."),
    australia("https://www.healthdirect.gov.au/dental-implants", "Healthdirect Australia", "Dental implant information and provider pathway", "Australian clinics quote individually", "There is no single public Australian package price; written quotes should separate implant, abutment, crown, imaging, and grafting."),
  ],
  "mastectomy": [
    india("mastectomy", "Mastectomy prices in India", "$2,650–$4,450", "Bookimed clinic range; reconstruction, pathology, and oncology treatment are not necessarily included."),
    us("mastectomy", "Mastectomy prices in the United States", "$15,000–$50,000", "Indicative private-care range; reconstruction and cancer treatment substantially alter the episode cost."),
    germany("mastectomy", "Mastectomy prices in Germany", "$8,000–$25,000", "Published private-clinic range; reconstruction and pathology inclusion differ."),
    australia("https://www.healthdirect.gov.au/mastectomy", "Healthdirect Australia", "Australian mastectomy pathway", "Public/private costs depend on reconstruction and oncology plan", "A procedure-specific written estimate is required; surgery, pathology, reconstruction, and adjuvant treatment are separate cost items."),
  ],
  "prostate-surgery": [
    india("radical-prostatectomy-via-da-vinci-robotic-surgery", "Prostate surgery prices in India", "$6,100–$14,150 (TURP, laparoscopic, and robotic procedures differ)", "Bookimed lists separate laparoscopic and robotic prostatectomy prices; these should not be compared as one technique."),
    us("radical-prostatectomy-via-da-vinci-robotic-surgery", "Prostate surgery prices in the United States", "$10,000–$40,000 (procedure-dependent estimate)", "Domestic episode costs vary materially between TURP for BPH and radical/robotic prostatectomy for cancer."),
    germany("radical-prostatectomy-via-da-vinci-robotic-surgery", "Prostate surgery prices in Germany", "$17,000–$20,000 (robotic procedure comparison)", "Bookimed's comparison is for robotic prostatectomy; it is not a TURP estimate."),
    australia("https://www.healthdirect.gov.au/prostate-cancer-treatment", "Healthdirect Australia", "Australian prostate-treatment pathway", "Hospital quote depends on TURP versus radical/robotic surgery", "The page describes treatment options rather than a single comparable private package; request itemised surgeon, hospital, device, and follow-up costs."),
  ],
  "appendectomy": [
    india("appendectomy", "Appendectomy prices in India", "$1,600–$2,000 (average $1,800)", "Bookimed's current India page reports this clinic-price range and average; emergency severity, perforation, and inpatient stay can add cost."),
    us("appendectomy", "Appendectomy prices in the United States", "$15,000–$30,000 (published range)", "Bookimed reports a US comparison range; its midpoint is not presented here as a publisher-reported average. Complications can raise an emergency hospital bill."),
    germany("appendectomy", "Appendectomy prices in Germany", "$8,500–$13,500", "Bookimed says the range typically covers surgery, anesthesia, nursing care, and a standard 1–2 day stay; confirm inclusions."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/appendicectomy/", "Medibank Australia", "Appendicectomy hospital-cost estimate", "A$6,235–A$7,747", "Claims-based Australian private-hospital cost estimate; doctors' fees and outpatient appointments are excluded."),
  ],
  "gallbladder-removal": [
    { market: "India", publisher: "Tripoheal", label: "Gallbladder-removal cost comparison", url: "https://www.tripoheal.com/treatments/gall-bladder-surgery-in-india/", reportedPrice: "$1,500–$3,000 (comparison table; page hero says from $2,500)", note: "The source gives conflicting India figures: its hero says treatment starts from $2,500, while the body comparison lists $1,500–$3,000. Treat as a published reference only and request an itemised quote; technique and admission matter." },
    { market: "United States", publisher: "Tripoheal", label: "Gallbladder removal cost comparison", url: "https://www.tripoheal.com/treatments/gall-bladder-surgery-in-india/", reportedPrice: "$12,000–$25,000", note: "Tripoheal publishes the US comparison beside its India figures; verify hospital, surgeon, anesthesia, and package inclusions." },
    germany("resection-of-gallbladder", "Gallbladder removal in Germany", "From $9,300", "Bookimed publishes a starting price, not a complete range; technique and hospital tier affect the quote."),
    australia("https://www.comparingexpert.com.au/the-cost-of-common-surgeries-compared/", "Comparing Expert Australia", "Cholecystectomy private-cost comparison", "A$2,800 specialist fees + A$4,500 hospital fees (reported components)", "The 2024 Australian private-care article reports separate specialist and hospital components, not an all-inclusive package; insurance out-of-pocket cost is different."),
  ],
  "hysterectomy": [
    india("hysterectomy", "Hysterectomy price in India", "From $3,500", "Bookimed reports a starting price, not a general upper bound; approach, diagnosis, hospital tier, and reconstruction/oncology needs change the quote. The page lists higher approach-specific prices, including robotic surgery."),
    us("hysterectomy", "Hysterectomy prices in the United States", "$30,000–$55,000", "Bookimed's published US range; abdominal, vaginal, laparoscopic, and robotic procedures differ."),
    germany("hysterectomy", "Hysterectomy prices in Germany", "$8,500–$9,500", "Bookimed's reported German range; approach, diagnosis, and case complexity affect the quote."),
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/hysterectomy/", "Medibank Australia", "Hysterectomy hospital-cost estimate", "A$11,340–A$16,167", "Claims-based hospital costs for eligible members at a Members' Choice hospital; doctors' fees and outpatient appointments are excluded. This is not a quote."),
  ],
  "ivf-treatment": [
    india("in-vitro-fertilisation-ivf", "IVF-cycle price in India", "From $3,500 per cycle", "Bookimed reports a starting price, not a general clinic range; medicines, ICSI, donor programs, testing, and embryo storage may be extra."),
    us("in-vitro-fertilisation-ivf", "IVF-cycle prices in the United States", "$17,500–$26,000", "Bookimed's current US comparison; medicines and add-on procedures may be excluded."),
    { market: "Europe", publisher: "CureMeAbroad", label: "Standard IVF cycle price in Spain", url: "https://curemeabroad.com/blogs/best-country-for-ivf", reportedPrice: "€5,000–€6,000 per cycle", note: "Spain example from a country comparison; medicines, add-ons, donor treatment, legal eligibility, and clinic protocols change total costs." },
    australia("https://www.mivf.com.au/ivf-costs/costs-of-ivf", "Melbourne IVF", "Published standard IVF-cycle fee", "A$13,340 upfront for an initial cycle; estimated A$7,599 out of pocket after Medicare/Safety Net", "Clinic fees correct as of 1 July 2026. The estimate assumes private insurance and that the Medicare Safety Net threshold has been reached; third-party day-hospital and anaesthetist fees may be additional."),
  ],
  "knee-arthroscopy": [
    { market: "India", publisher: "ClinicSpots", label: "Knee arthroscopy country comparison", url: "https://www.clinicspots.com/cost/knee-arthroscopy/india", reportedPrice: "$975–$3,030; average $2,181 (country-comparison section gives a different range)", note: "The page reports conflicting ranges in different sections and shows city-level variation; use the broad lowest/highest figures only as a reference and request an itemised quote." },
    { market: "United States", publisher: "ClinicSpots", label: "Knee arthroscopy country comparison", url: "https://www.clinicspots.com/cost/knee-arthroscopy/india", reportedPrice: "$3,485 (comparison point)", note: "Country-comparison figure; it is not a universal US hospital package and may exclude professional fees." },
    { market: "Europe", publisher: "Vaidam", label: "Knee arthroscopy cost in Germany", url: "https://www.vaidam.com/cost/knee-arthroscopy/germany", reportedPrice: "$2,500–$22,000 (average $9,000)", note: "Vaidam's broad German estimate spans different diagnoses and procedure complexity; the page reports an approximate 2-day hospital and 10-day outside-hospital stay. It is not a single fixed package." },
    { market: "Australia", publisher: "ClinicSpots", label: "Knee arthroscopy country comparison", url: "https://www.clinicspots.com/cost/knee-arthroscopy/india", reportedPrice: "$4,610 (comparison point, reported in USD)", note: "Country-comparison figure; it is not an Australian hospital package or a Medibank member claim estimate." },
  ],
  "pacemaker-implantation": [
    { market: "India", publisher: "CureIndia", label: "Pacemaker implantation cost comparison", url: "https://www.cureindia.com/en/treatments/cardiac-pacemaker-installation-cost-in-india", reportedPrice: "$5,200–$10,800", note: "The comparison includes a broad device mix; single-, dual-, and biventricular devices are not interchangeable." },
    { market: "United States", publisher: "CureIndia", label: "Pacemaker implantation cost comparison", url: "https://www.cureindia.com/en/treatments/cardiac-pacemaker-installation-cost-in-india", reportedPrice: "$20,000–$100,000", note: "Published country comparison; device model, facility, physician fees, and monitoring change the total." },
    { market: "Europe", publisher: "Bookimed", label: "Pacemaker implantation starting price in Germany", url: "https://us-uk.bookimed.com/clinics/procedure=installing-heart-pacemaker/", reportedPrice: "From $13,000 (starting price; no general upper bound shown)", note: "Bookimed's country comparison lists Germany from $13,000; device type, leads, hospital days, and package inclusions change the quote. This is not a complete range." },
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/pacemaker/", "Medibank Australia", "Pacemaker hospital-cost estimate", "A$15,406–A$23,674", "Claims-based Australian hospital-cost estimate; physician fees and outpatient visits are excluded."),
  ],
  "shoulder-replacement": [
    { market: "India", publisher: "Vaidam", label: "Shoulder replacement cost in India", url: "https://www.vaidam.com/cost/shoulder-replacement-surgery/india", reportedPrice: "$1,500–$7,000 (average $3,500)", note: "Vaidam's current India page reports a broad cost range; implant type, centre, patient condition, and package scope affect the estimate." },
    { market: "United States", publisher: "Vaidam", label: "Shoulder-replacement cost comparison", url: "https://www.vaidam.com/knowledge-center/shoulder-replacement-surgery-affordable-india", reportedPrice: "$10,000–$30,000", note: "Published comparison range; implant type, facility, surgeon, and revision status affect price." },
    { market: "Europe", publisher: "Vaidam", label: "Shoulder replacement cost in Germany", url: "https://www.vaidam.com/cost/shoulder-replacement-surgery/germany", reportedPrice: "$7,000–$25,000 (average $14,000)", note: "Vaidam's current Germany page reports a broad estimate; implant, hospital, and package contents vary." },
    australia("https://www.medibank.com.au/health-support/going-to-hospital/procedure-costs/shoulder-replacement/", "Medibank Australia", "Shoulder replacement hospital-cost estimate", "A$25,189–A$30,383", "Claims-based hospital costs for insured Australian residents; doctors' fees and outpatient costs are excluded."),
  ],
  "tonsillectomy": [
    india("tonsillectomy", "Tonsillectomy prices in India", "$1,500–$3,300 across listed clinic examples; country page starts at $1,500", "Bookimed's country page reports a starting price; the linked page lists individual clinic examples with different prices. Technique, adenoid removal, and admission change the package."),
    us("tonsillectomy", "Tonsillectomy prices in the United States", "$6,500–$9,800", "Bookimed's current US page reports this approximate range; anesthesia, facility fees, and admission scope may vary."),
    germany("tonsillectomy", "Tonsillectomy prices in Germany", "From $3,000; one listed clinic reports $3,000–$6,500", "Bookimed's Germany page publishes a starting price and individual clinic examples, not a single country-wide range; outpatient/inpatient packages differ."),
    australia("https://rapidpathtotreatment.com.au/ent/", "Rapid Path to Treatment", "Self-pay tonsillectomy surgical package", "A$4,810 for tonsil removal", "The advertised self-pay fee includes surgery, anaesthesia, and hospital fees for a same-day admission; specialist consultation and follow-up fees are additional."),
  ],
};
