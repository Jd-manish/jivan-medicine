import type { Metadata } from "next";
import Link from "next/link";
import { surgeries, surgerySavingsPercent, formatPrice, getSurgerCategories, priceReferencePoint, priceComparisonBasis } from "@/lib/surgeries";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Operation & Procedure Costs — India vs US, Europe & Australia | Jivan",
    description: "Compare 25 operation and treatment pages using clickable hospital and medical-tourism price sources. Review market, currency, package scope, recovery, and questions to ask.",
    keywords: [
      "surgery cost India",
      "procedure cost comparison",
      "medical tourism India",
      "knee replacement cost comparison",
      "cataract surgery cost comparison",
      "heart surgery cost comparison",
      "IVF cost comparison",
    ],
    alternates: localizedAlternates(locale, "surgeries"),
    robots: localizedRobots(locale),
  };
}

export default async function SurgeriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;

  const categories = getSurgerCategories();
  const referenceSavings = surgeries.map((surgery) =>
    surgerySavingsPercent(priceReferencePoint(surgery.prices.us), priceReferencePoint(surgery.prices.india)),
  );
  const minSavings = Math.min(...referenceSavings);
  const maxSavings = Math.max(...referenceSavings);
  const procedureListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Operations and procedure cost guides",
    url: `${SITE_URL}/${locale}/surgeries/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: surgeries.length,
      itemListElement: surgeries.map((surgery, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: surgery.name,
        url: `${SITE_URL}/${locale}/surgeries/${surgery.slug}/`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureListSchema) }} />
      {/* Hero */}
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Operations & procedures</span>
          <h1 className="anim-rise mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Procedure costs: India vs US, Europe & Australia
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Compare source-linked price references and package notes for operations and treatments. Procedure scope, currency, hospital stay, and follow-up differ between publishers—use these as starting points for written quotes, not promises.
          </p>
        </div>
      </section>

      {/* Verified scope summary */}
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-4">
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">{surgeries.length}</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Procedure comparison pages</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">4</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Markets referenced where comparable sources exist</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">{minSavings}–{maxSavings}%</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Indicative India/US price-reference difference</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">Linked</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Source and scope note on every page</p>
          </div>
        </div>
      </section>

      {/* Surgery listings by category */}
      <section className="shell pb-16">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-black text-ink-900 mb-6">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {surgeries
                .filter((s) => s.category === category)
                .map((surgery) => {
                  const usReference = priceReferencePoint(surgery.prices.us);
                  const indiaReference = priceReferencePoint(surgery.prices.india);
                  const savings = surgerySavingsPercent(usReference, indiaReference);
                  const comparisonBasis = priceComparisonBasis(surgery.prices.india, surgery.prices.us);

                  return (
                    <Link
                      key={surgery.slug}
                      href={`/${locale}/surgeries/${surgery.slug}`}
                      className="panel panel-hover group rounded-3xl p-6 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-ink-900 group-hover:text-mint-700 transition">
                            {surgery.name}
                          </h3>
                          <p className="mt-1 text-xs text-ink-400">{surgery.category}</p>
                        </div>
                        <span title={`Arithmetic comparison using ${comparisonBasis.toLowerCase()}; not a guaranteed saving or like-for-like quote.`} className="shrink-0 rounded-full bg-mint-500/10 px-3 py-1 text-sm font-bold text-mint-600">
                          {savings >= 0 ? `${savings}% lower*` : `${Math.abs(savings)}% higher*`}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-ink-600 line-clamp-2">
                        {surgery.description}
                      </p>

                      {/* Price comparison bar */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇺🇸 United States</span>
                          <span className="font-semibold text-ink-400 line-through">
                            {formatPrice(surgery.prices.us)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇪🇺 Europe</span>
                          <span className="font-semibold text-ink-400">
                            {formatPrice(surgery.prices.eu)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇦🇺 Australia</span>
                          <span className="font-semibold text-ink-400">
                            {formatPrice(surgery.prices.australia, "Australia")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-mint-50 px-3 py-2 text-xs">
                          <span className="font-semibold text-mint-700">🇮🇳 India</span>
                          <span className="font-bold text-mint-700">
                            {formatPrice(surgery.prices.india)}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-[11px] leading-5 text-ink-400">* Arithmetic at source reference points; procedure scope, inclusions, and price basis differ.</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                        <span>⏱ {surgery.duration}</span>
                        <span>·</span>
                        <span>🏥 {surgery.hospitalStay}</span>
                        <span>·</span>
                        <span>🔄 {surgery.recovery}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </section>

      {/* Price-comparison and patient-safety guidance */}
      <section className="shell pb-16">
        <div className="panel rounded-3xl p-8 sm:p-12">
          <h2 className="text-2xl font-black text-ink-900">How to compare treatment costs and plan safely</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-600">
            A country-level range is a research starting point, not an individual quote or a measure of clinical quality. Compare the same treatment plan and include the full episode of care.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Match the procedure", body: "Confirm diagnosis, technique, laterality, device or implant, and whether the estimate is elective, emergency, primary, or revision surgery." },
              { title: "Itemize the quote", body: "Ask what is included for the surgeon, anesthetist, hospital, tests, device, medicines, hospital nights, rehabilitation, and follow-up." },
              { title: "Check the price basis", body: "A clinic estimate, self-pay package, insured-member claim, public tariff, and billed charge are different measures. Keep the source currency and caveats visible." },
              { title: "Verify the provider", body: "Confirm the exact facility, current licence or accreditation status, scope, and treating clinician directly with the relevant institution or regulator." },
              { title: "Plan continuity of care", body: "Arrange a clinician at home, secure transfer of records, written discharge instructions, and a named contact for complications before travelling." },
              { title: "Budget the whole trip", body: "Include travel, accommodation, a companion, extra recovery days, local follow-up, cancellation terms, and insurance exclusions—not just the procedure fee." },
            ].map((item) => (
              <article key={item.title}>
                <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-ink-100 pt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Independent patient guidance</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href="https://wwwnc.cdc.gov/travel/page/medical-tourism" target="_blank" rel="noopener noreferrer" className="font-semibold text-mint-700 underline underline-offset-2">CDC: Medical tourism ↗</a>
              <a href="https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-mint-700 underline underline-offset-2">CDC Yellow Book: Medical tourism ↗</a>
              <a href="https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/" target="_blank" rel="noopener noreferrer" className="font-semibold text-mint-700 underline underline-offset-2">NHS: Planned treatment abroad ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="shell pb-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs leading-6 text-amber-800">
            <strong>Medical and price disclaimer:</strong> Each procedure page links to publisher-reported prices and explains notable scope limits. Currencies, procedure variants, package inclusions, and insurance/claims basis differ; prices are not guaranteed quotes or like-for-like comparisons. Obtain a dated itemised quote and consult a qualified clinician. Jivan does not provide medical advice or arrange treatment.
          </p>
        </div>
      </section>
    </>
  );
}