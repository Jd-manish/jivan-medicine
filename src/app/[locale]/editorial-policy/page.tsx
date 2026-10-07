import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Editorial Policy and Content Limits — Jivan",
    description: "How to interpret Jivan’s editorial role labels, source links, medicine price references, and health information limits.",
    alternates: localizedAlternates(locale, "editorial-policy"),
    robots: localizedRobots(locale),
  };
}

const sections = [
  {
    h: "1. What Jivan publishes",
    body: [
      "Jivan publishes medicine-price comparisons, operation and procedure cost references, and general educational articles. The site does not diagnose, prescribe, sell medicine, or provide an individual treatment plan.",
      "Pages can differ in the depth and type of sourcing. An article’s references appear in its source section. Procedure pages identify the publisher, market, currency, and scope notes where the cited source provides them. A source link lets readers inspect the publisher’s own material; it does not mean Jivan independently verified every statement on that site.",
    ],
  },
  {
    h: "2. Role labels and medical review",
    body: [
      "Bylines such as “Health Safety Editor” are topic labels used by Jivan. They do not identify a named individual, establish professional credentials, or prove that a clinician wrote or independently reviewed a particular page.",
      "The site does not claim that every article or catalogue entry has undergone independent clinical review. Readers should follow the cited regulator or public-health source and discuss personal decisions with a qualified clinician or pharmacist.",
    ],
  },
  {
    h: "3. Medicine-price references and limitations",
    body: [
      "The medicine catalogue contains curated anchor rows and calculated derived rows. The current data file does not provide a public source URL and dated quotation for every anchor. A “market checked” status is a catalogue label, not a live offer, regulatory endorsement, or guarantee that a particular supplier has stock.",
      "Derived rows are generated calculations based on an anchor and preset strength, pack-size, and price-adjustment factors. They are not independently observed prices, confirmed products, or offers from the manufacturer named in a generated row. Treat them only as rough comparisons and confirm the exact product and price directly with a licensed supplier.",
      "The site formats the stored medicine-price values in USD for comparison. It does not provide a live currency conversion, insurance calculation, or patient-specific landed cost. Pack sizes, exchange rates, taxes, coverage, and local availability can change the amount a person actually pays.",
    ],
  },
  {
    h: "4. Procedure-price comparisons",
    body: [
      "Procedure pages present ranges reported by linked publishers and benchmarks. Publishers may describe different procedures, patient groups, facilities, currencies, or inclusions. A midpoint comparison is arithmetic on the displayed figures; it is not a guaranteed saving and does not establish that two offers are equivalent.",
      "Ask each provider for a written estimate for the exact procedure and clinical circumstances. Check whether surgeon, hospital, anaesthesia, tests, implant, medicines, complications, aftercare, travel, and accommodation are included. Do not use a cost comparison to decide whether to have treatment or where to receive it.",
    ],
  },
  {
    h: "5. Dates, updates, and corrections",
    body: [
      "Article pages display a publication date only when one is recorded in the source data; an update date is shown separately. An update date is not evidence that every linked source or every clinical statement was rechecked on that date.",
      "Readers can report a possible factual error, stale price, or broken citation through the contact details on the corrections page. Please include the page URL and a public source when possible. Jivan does not promise a response time or maintain a complete public correction log on this page.",
    ],
  },
  {
    h: "6. Independence and use of the site",
    body: [
      "Jivan is not a pharmacy and does not process medicine orders through this site. A displayed comparison is for general information; it is not an endorsement of a supplier, a recommendation to import, or a substitute for local regulatory advice.",
      "If information may affect a medical decision, confirm it with the clinician responsible for care and consult the applicable regulator or public-health guidance for the relevant country.",
    ],
  },
];

const references = [
  { label: "CDC — Medical tourism", url: "https://wwwnc.cdc.gov/travel/page/medical-tourism" },
  { label: "CDC Yellow Book 2026 — Medical tourism", url: "https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html" },
  { label: "NHS — Going abroad for treatment", url: "https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/" },
];

export default async function EditorialPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Trust · Transparency</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">Editorial policy and content limits</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            What Jivan’s labels and citations mean, what they do not mean, and how to report a possible error.
          </p>
          <p className="mt-5 text-xs text-ink-400">Updated 7 October 2026 · Applies to Jivan’s informational pages</p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.h} className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">{section.h}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-ink-600">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Public-health and treatment-abroad sources</h2>
            <p className="mt-3 text-sm leading-7 text-ink-600">These sources provide general safety context for the medical-tourism guidance linked from Jivan’s procedure articles:</p>
            <ul className="mt-4 space-y-2">
              {references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-mint-700 underline underline-offset-2">{reference.label} ↗</a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Related pages</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Price methodology", `/${locale}/methodology/`],
                ["Corrections", `/${locale}/corrections/`],
                ["About Jivan", `/${locale}/about/`],
                ["Medical disclaimer", `/${locale}/medical-disclaimer/`],
                ["Contact", `/${locale}/contact/`],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="font-semibold text-ink-700 hover:text-mint-600">{label} →</Link></li>
              ))}
            </ul>
          </div>
          <div className="panel rounded-3xl border-l-4 border-l-mint-500 p-6">
            <h2 className="text-sm font-bold text-ink-900">Report a concern</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">Send the page URL and a public source, if available, through the contact details listed on the corrections page.</p>
            <Link href={`/${locale}/corrections/`} className="btn-primary mt-4 w-full">Corrections information</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
