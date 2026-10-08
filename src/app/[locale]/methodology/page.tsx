import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Medicine and Procedure Price Methodology — Jivan",
    description: "Learn how Jivan labels medicine reference prices and derived estimates, calculates comparisons, and presents procedure price sources and limitations.",
    alternates: localizedAlternates(locale, "methodology"),
    robots: localizedRobots(locale),
  };
}

const steps = [
  {
    n: "1",
    t: "Medicine catalogue records",
    body: "The static catalogue includes curated anchor rows and generated derived rows. Anchor records carry a broad public-reference-basis note, but the current medicine data does not provide an individual public citation URL or dated quotation for every row. The “market checked” label reflects the stored catalogue status; it is not proof of a current pharmacy offer or an independent certification.",
  },
  {
    n: "2",
    t: "Derived catalogue estimates",
    body: "Derived rows are produced from an anchor using preset strength and pack-size factors plus deterministic adjustment values. They are calculations, not separately observed prices, validated manufacturer products, or actual offers from a supplier. Company names in generated rows should not be read as confirmation that the named company sells that exact presentation.",
    formula: "derived reference = anchor value × preset strength factor × preset pack factor × catalogue adjustment",
  },
  {
    n: "3",
    t: "Currency and comparison",
    body: "Medicine values are stored as USD cents and displayed in USD. The catalogue does not expose a live exchange-rate timestamp or calculate an individual’s insurance, tax, import, or delivery costs. Percentages use the displayed reference values: (higher-market reference − India reference) ÷ higher-market reference × 100. Displayed savings are floored to one decimal and capped below 100% to avoid implying a free product.",
  },
  {
    n: "4",
    t: "Procedure price sources",
    body: "Operation pages link to named publishers and describe the market, currency, and source scope supplied in the evidence record. Where a comparison uses range midpoints, the percentage is arithmetic on those published endpoints—not a guaranteed saving and not proof that two estimates include the same services.",
  },
  {
    n: "5",
    t: "Static pages and index coverage",
    body: "The static build generates medicine detail routes from an explicit slug manifest. Search can also show derived catalogue rows that do not have their own detail page; those rows are labelled as estimates and should not be treated as verified product listings. Medicine detail pages are built only for the curated primary locales (English, German, French, Spanish, and Italian).",
  },
];

const limits = [
  "None of the displayed catalogue values is a live checkout price. Confirm current price, stock, exact strength, form, pack size, manufacturer, and legal supply with a licensed supplier.",
  "A catalogue status label cannot replace a source URL, a dated quotation, an invoice, or a regulator’s product record. If a row lacks a public citation, treat its source trail as incomplete.",
  "A derived row may not correspond to a product that is currently manufactured or sold. Do not use generated values for purchasing, import, or treatment decisions.",
  "Insurance, copays, local taxes, customs, hospital fees, patient condition, and complications can materially change actual costs.",
  "Clinical and travel information is general education. Consult a qualified clinician and the applicable regulator before making health or cross-border treatment decisions.",
];

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Data · Methodology</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">Medicine and procedure price methodology</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            What Jivan’s catalogue labels, generated estimates, source-linked procedure ranges, and savings calculations do—and do not—tell you.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">How to read a comparison</h2>
            <div className="mt-5 space-y-5">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-900 text-sm font-black text-white">{step.n}</span>
                  <div>
                    <h3 className="text-base font-bold text-ink-900">{step.t}</h3>
                    <p className="mt-1 text-sm leading-7 text-ink-600">{step.body}</p>
                    {step.formula ? <code className="mt-2 block overflow-x-auto rounded-xl bg-ink-900 px-4 py-3 font-mono text-xs leading-6 text-mint-300">{step.formula}</code> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Known limitations</h2>
            <ul className="mt-3 space-y-2.5">
              {limits.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-7 text-ink-600">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{item}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel rounded-3xl border-l-4 border-l-mint-500 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Need to verify a number?</h2>
            <p className="mt-3 text-sm leading-7 text-ink-600">
              For medicine prices, check with a licensed supplier using the exact product and pack. For a procedure, request written estimates from each provider and compare the included services line by line. Send Jivan a page URL and a public source if you spot a possible error.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/${locale}/search/`} className="btn-primary">Search the medicine catalogue</Link>
              <Link href={`/${locale}/surgeries/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">View procedure guides</Link>
              <Link href={`/${locale}/corrections/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Corrections</Link>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Related</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Editorial policy", `/${locale}/editorial-policy/`],
                ["Corrections", `/${locale}/corrections/`],
                ["About Jivan", `/${locale}/about/`],
                ["Medical disclaimer", `/${locale}/medical-disclaimer/`],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="font-semibold text-ink-700 hover:text-mint-600">{label} →</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
