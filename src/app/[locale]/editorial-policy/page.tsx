import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale, supportedLocales } from "@/lib/i18n";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Editorial Policy — How Jivan Content Is Written, Reviewed and Corrected",
    description:
      "How Jivan sources, writes, fact-checks and reviews medicine pricing content: source hierarchy, editorial process, human review and our corrections policy.",
    alternates: {
      canonical: `/${locale}/editorial-policy`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/editorial-policy`])),
    },
  };
}

const sections = [
  {
    h: "1. Our editorial standard",
    body: [
      "Jivan publishes medicine pricing information and health-affordability education. Because this content is classified as YMYL (Your Money or Your Life) — it can influence decisions about health and finances — we hold it to a standard above typical commercial content.",
      "Every article must answer a real question a patient would reasonably ask, must be readable by a non-specialist, and must leave the reader better able to act: what to check, what to ask their doctor, and what to avoid. Content that merely fills space or repeats generic advice is not published.",
    ],
  },
  {
    h: "2. Source hierarchy",
    body: [
      "We rank source quality explicitly and do not treat all sources equally:",
      "Tier 1 — primary regulators and public-health bodies: US FDA (including the Orange Book and drug labels), European Medicines Agency, World Health Organization, UK MHRA, India's CDSCO and NPPA.",
      "Tier 2 — institutional data and official programmes: UNAIDS, The Global Fund, Medicines Patent Pool, WHO Prequalification register, national NHS records.",
      "Tier 3 — reference databases: RxNorm (US National Library of Medicine), MedlinePlus, openFDA API, Wikipedia for orientation only.",
      "Commercial retailers, reseller sites and marketplace listings are never cited as sources for clinical claims, and we do not quote prices from sellers whose supply chain we cannot verify.",
    ],
    notes: [
      "Every article lists its sources inline at the bottom under “Sources and further reading.”",
      "Case studies are composite profiles built from documented price patterns — they are labelled as composite and never presented as named real individuals.",
    ],
  },
  {
    h: "3. How content is produced and reviewed",
    body: [
      "Drafting: topics are selected from real patient search questions, then researched against Tier 1/Tier 2 sources before any drafting begins.",
      "Human review: every published article passes an editorial review for clinical accuracy, plain-language clarity, policy compliance and internal duplication. Articles that read as mechanical or interchangeable are rewritten or removed.",
      "Pricing review: catalog price entries carry an explicit status label — market-checked or derived — and market-checked entries are anchored to documented reference ranges rather than invented figures.",
      "Re-review: pricing-sensitive pages are re-reviewed on a rolling basis, and any article shown to be out of date is updated with a new review date.",
    ],
    notes: [
      "We use tooling, including automated drafting assistance, in the research and editing workflow. Final published content is reviewed, edited and approved by the editorial team; content is never published raw from any automated system.",
      "Because our articles are news/information articles rather than personal medical advice, clinical review is performed at the editorial level using regulator-approved label information.",
    ],
  },
  {
    h: "4. Independence and conflicts",
    body: [
      "Jivan does not sell medicine, does not run a pharmacy, does not take commission on any purchase, and does not accept payment from manufacturers or sellers to feature, rank or promote a product.",
      "Our income is limited to voluntary reader contributions and, where enabled, display advertising. Advertising never influences which medicines are listed, how prices are labelled, or what any article concludes.",
      "If we ever have a relationship that could be perceived as a conflict in a specific piece of content, that relationship is disclosed on the content itself.",
    ],
  },
  {
    h: "5. Accuracy limitations — stated honestly",
    body: [
      "Prices change with market conditions, exchange rates and pack sizes. Our entries are reference points for decision-making, not live quotations; always confirm the current price with the actual supplier before purchasing.",
      "Derived entries are computed from documented anchors with a stated formula (strength and pack-size scaling). They are labelled derived for exactly that reason and must never be treated as quotations.",
      "Clinical guidance in articles is general education. It cannot account for an individual's history, and it never substitutes for consultation with a licensed clinician.",
    ],
  },
  {
    h: "6. Corrections policy",
    body: [
      "If we publish something wrong, we fix it and we say so. Prices, factual claims, source links and wording errors can all be reported through our contact page or catalog@jivan.health.",
      "Material corrections are made promptly and the review date on the page is updated. If an error is significant enough to mislead a decision, the correction is noted on the page rather than made silently.",
    ],
    notes: [
      "Send reports with the page URL and, where possible, the correct figure with a reference link.",
    ],
  },
  {
    h: "7. Comment and feedback moderation",
    body: [
      "Visitor feedback shown on the site is reviewed before publication and is not edited into endorsements. Negative but constructive feedback is published; spam, fabrications and promotional content are not.",
      "Questions submitted through the contact form are private by design and are never published.",
    ],
  },
];

export default async function EditorialPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Trust · Transparency</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">
            Editorial Policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            How Jivan content is researched, written, reviewed and corrected — and the standards we hold it to as a
            health and pricing information publisher.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-400">
            <span className="rounded-lg bg-ink-50 px-3 py-1.5">Version 1.0</span>
            <span className="rounded-lg bg-ink-50 px-3 py-1.5">Applies to all articles, catalog entries and case studies</span>
            <span className="rounded-lg bg-ink-50 px-3 py-1.5">Last updated February 2026</span>
          </div>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.h} className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">{section.h}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((p) => (
                  <p key={p} className="text-[15px] leading-8 text-ink-600">
                    {p}
                  </p>
                ))}
              </div>
              {section.notes ? (
                <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                  {section.notes.map((note) => (
                    <li key={note} className="flex gap-2.5 text-sm leading-6 text-ink-500">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                      {note}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Related</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["How we verify prices", `/${locale}/methodology`],
                ["About Jivan", `/${locale}/about`],
                ["Medical disclaimer", `/${locale}/medical-disclaimer`],
                ["Privacy policy", `/${locale}/privacy`],
                ["Contact the editors", `/${locale}/contact`],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="font-semibold text-ink-700 hover:text-mint-600">
                    {label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel rounded-3xl border-l-4 border-l-mint-500 p-6">
            <h2 className="text-sm font-bold text-ink-900">Report an issue</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Wrong price, broken claim, outdated guidance — the fastest way to reach the editorial team is the contact
              page or catalog@jivan.health.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
