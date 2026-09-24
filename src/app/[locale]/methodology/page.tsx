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
    title: "How We Verify Medicine Prices — Jivan Methodology",
    description:
      "The exact process behind Jivan price entries: where anchor prices come from, how derived prices are calculated with a stated formula, what each label means, and our known limitations.",
    alternates: {
      canonical: `/${locale}/methodology`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/methodology`])),
    },
  };
}

const steps = [
  {
    n: "1",
    t: "Anchor collection",
    body: "For each molecule we establish anchor prices as reference ranges, not single points: a typical US/EU retail price band for the pack described, and a typical Indian retail market price actually paid at a pharmacy — not the printed MRP on the box. Both are normalized to USD cents for comparison.",
  },
  {
    n: "2",
    t: "Labelling",
    body: "Every entry then gets a status label that never changes silently: “Market checked” means cross-checked against documented reference ranges. “Derived” means it was computed from a same-molecule anchor using the formula below. We do not publish invented numbers marked as verified.",
  },
  {
    n: "3",
    t: "Derived price computation",
    body: "Derived entries scale from their molecule's documented anchor: multiply the anchor price by the strength factor and pack-size factor of the variant, with a small deterministic range to reflect manufacturer spread. The exact anchor each entry was derived from is named on the page.",
    formula: "derived = anchor × strengthFactor × packFactor( × manufacturerJitter )",
  },
  {
    n: "4",
    t: "Indexation separation",
    body: "Only market-checked anchors — hand-reviewed entries with unique molecule-specific content — are submitted to search engines. Derived variants remain accessible to users through search and links but are excluded from the index to keep the public corpus high-value.",
  },
  {
    n: "5",
    t: "Review and correction",
    body: "Anchors are re-reviewed on a rolling basis. Readers can report any figure that looks wrong through the contact page; verified errors are corrected promptly and visibly.",
  },
];

const labels = [
  { k: "Market checked", v: "Cross-checked against documented reference ranges for the exact molecule, strength and pack shown. This is our strongest label.", c: "text-mint-600 bg-mint-500/10" },
  { k: "Derived", v: "Computed from a named market-checked anchor of the same molecule using the scaling formula. Reliable for planning; confirm before purchase.", c: "text-royal-600 bg-royal-500/10" },
  { k: "Estimated", v: "Therapy-class baseline where no anchor exists yet. Shown rarely, labelled clearly, and we offer a manual price-check instead of pretending confidence.", c: "text-amber-600 bg-amber-500/10" },
];

const limits = [
  "Prices are reference points for decision-making, not live quotations; availability and final price always rest with the actual supplier.",
  "Indian figures reflect typical retail market pricing and intentionally exclude printed MRP where MRP does not reflect what patients pay street-side.",
  "Currency conversion uses recent observed rates and is not tick-by-tick.",
  "Insurance, copay structure, tax and customs change what an individual actually pays; our figures are out-of-pocket reference ranges.",
  "During active conflict, shortages or currency shocks, local prices can move faster than our re-review cycle — treat stale-seeming figures as flags to verify.",
];

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Data · Methodology</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">
            How we verify medicine prices
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            The full process behind every figure on Jivan: where anchor prices come from, how derived prices are
            calculated, what each label means, and the limitations we will not pretend away.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">The five-step process</h2>
            <div className="mt-5 space-y-5">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-900 text-sm font-black text-white">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink-900">{step.t}</h3>
                    <p className="mt-1 text-sm leading-7 text-ink-600">{step.body}</p>
                    {step.formula ? (
                      <code className="mt-2 block rounded-xl bg-ink-900 px-4 py-3 font-mono text-sm text-mint-300">
                        {step.formula}
                      </code>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">What the labels mean</h2>
            <div className="mt-4 space-y-3">
              {labels.map((label) => (
                <div key={label.k} className="rounded-2xl border border-ink-100 p-4">
                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${label.c}`}>{label.k}</span>
                  <p className="mt-2 text-sm leading-7 text-ink-600">{label.v}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rounded-3xl border-l-4 border-l-amber-500 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Known limitations</h2>
            <ul className="mt-3 space-y-2.5">
              {limits.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-7 text-ink-600">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Related</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Editorial policy", `/${locale}/editorial-policy`],
                ["Report a price issue", `/${locale}/contact`],
                ["Search the catalog", `/${locale}/search`],
                ["About Jivan", `/${locale}/about`],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="font-semibold text-ink-700 hover:text-mint-600">
                    {label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold text-ink-900">See a price that looks wrong?</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Send the page URL and the correct figure (with a reference if possible) via the contact page. Verified
              errors are corrected promptly and visibly.
            </p>
            <Link href={`/${locale}/contact`} className="btn-primary mt-4 w-full">
              Report it
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
