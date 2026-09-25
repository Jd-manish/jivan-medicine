import type { Metadata } from "next";
import Link from "next/link";
import { CapsuleArt, MoleculeArt } from "@/components/medical-art";
import { formatUsd, PriceCompare, PriceStatusBadge, savingsPercent } from "@/components/price-block";
import { ShareSavings, QuickShareButton } from "@/components/share-savings";
import { isValidLocale, t } from "@/lib/i18n";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { ensureMedicineSeeded, getAlternatives, getMedicineBySlug } from "@/lib/medicines";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { getMedicineCatalog } = await import("@/lib/medicines");
  const locales = ["en", "de", "fr", "es", "it"] as const;
  const { rows } = await getMedicineCatalog({ verifiedOnly: true, pageSize: 500, sort: "savings" });
  const params: PageParams[] = [];
  for (const locale of locales) {
    for (const m of rows) {
      params.push({ locale, slug: m.slug });
    }
  }
  return params;
}

type PageParams = { locale: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  await ensureMedicineSeeded();

  const medicine = (await getMedicineBySlug(slug))!;
  if (!medicine) return {};

  const savings = savingsPercent(medicine.usEuPrice, medicine.indiaPrice);

  /**
   * Search-quality control, two layers:
   * 1) Only hand-researched anchor entries are indexable. Derived variants
   *    are excluded to prevent the mass-produced thin/duplicate signal.
   * 2) Indexation only in curated locales   secondary locales share the same
   *    English content and would appear as 24-way duplicate medicine pages.
   */
  const isResearchAnchor = medicine.priceStatus === "market_checked";
  const CURATED_LOCALES = ["en", "de", "fr", "es", "it"] as const;
  const isCuratedLocale = (CURATED_LOCALES as readonly string[]).includes(locale);
  const indexable = isResearchAnchor && isCuratedLocale;

  return {
    title: `${medicine.name}   Indian alternative price, uses and dosage`,
    description: `${medicine.name} (${medicine.genericSalt}) costs ${formatUsd(medicine.usEuPrice, "en")} in the US/EU versus ${formatUsd(medicine.indiaPrice, "en")} in India   about ${savings}% lower. Uses, dosage, side effects and manufacturer details.`,
    alternates: { canonical: `/${locale}/medicine/${slug}` },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } }
      : { index: false, follow: true },
    openGraph: { title: `${medicine.name}   Indian alternative`, type: "article" },
  };
}

export default async function MedicineDetailPage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;
  
  await ensureMedicineSeeded();

  const medicine = (await getMedicineBySlug(slug))!;
  

  const copy = t(locale as any);
  const alternatives = await getAlternatives(medicine.genericSalt, medicine.id, 6);
  const savings = savingsPercent(medicine.usEuPrice, medicine.indiaPrice);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: medicine.name,
    activeIngredient: medicine.genericSalt,
    manufacturer: { "@type": "Organization", name: medicine.company },
    dosageForm: medicine.form,
    description: medicine.description,
    prescriptionStatus: medicine.prescriptionRequired ? "PrescriptionOnly" : "OTC",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.round(medicine.indiaPrice / 100),
      highPrice: Math.round(medicine.usEuPrice / 100),
      priceCurrency: "USD",
      offerCount: alternatives.length + 1,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://jivan.health/${locale}` },
      { "@type": "ListItem", position: 2, name: "Medicines", item: `https://jivan.health/${locale}/search` },
      { "@type": "ListItem", position: 3, name: medicine.name },
    ],
  };

  const facts = [
    { label: copy.tableSalt, value: medicine.genericSalt },
    { label: ui(locale, P.medFactsBrands), value: medicine.brandNames || " " },
    { label: ui(locale, P.medFactsStrength), value: medicine.strength },
    { label: ui(locale, P.medFactsForm), value: medicine.form },
    { label: ui(locale, P.medFactsPack), value: medicine.packSize },
    { label: copy.tableCompany, value: medicine.company },
    { label: ui(locale, P.medFactsArea), value: medicine.therapyArea },
    { label: ui(locale, P.medFactsRx), value: medicine.prescriptionRequired ? ui(locale, P.medRxYes) : ui(locale, P.medRxNo) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <CapsuleArt className="anim-drift absolute -right-4 top-10 w-36 opacity-30" />
        <MoleculeArt className="anim-float absolute left-[42%] top-4 hidden w-24 opacity-20 lg:block" />

        <div className="shell relative py-10 sm:py-14">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href={`/${locale}`} className="hover:text-mint-300">{ui(locale, P.artBreadcrumbHome)}</Link>
            <span>/</span>
            <Link href={`/${locale}#catalog`} className="hover:text-mint-300">{ui(locale, P.searchLiveLookup) ? "Catalog" : "Catalog"}</Link>
            <span>/</span>
            <span className="text-ink-200">{medicine.genericSalt}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="chip">{medicine.category}</span>
            <span className="chip">{medicine.therapyArea}</span>
            {medicine.highSaving ? <span className="chip">High savings</span> : null}
          </div>

          <h1 className="anim-rise mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
            {medicine.name}
          </h1>
          <p className="anim-rise delay-2 mt-3 max-w-2xl text-base leading-7 text-ink-200">
            Indian alternative containing the same active salt   <span className="font-bold text-mint-300">{savings}% lower</span> than the typical US/EU price.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.medPriceCompare)}</h2>
              <PriceStatusBadge status={medicine.priceStatus} />
            </div>
            <div className="mt-5">
              <PriceCompare
                usEuPrice={medicine.usEuPrice}
                indiaPrice={medicine.indiaPrice}
                locale={locale}
                packSize={medicine.packSize}
              />
            </div>
            <div className="mt-5 rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{ui(locale, P.medHowDetermined)}</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">{medicine.priceNotes}</p>
              {medicine.priceSource ? (
                <p className="mt-2 text-xs text-ink-400">{ui(locale, P.medSourceBasis)}: {medicine.priceSource}</p>
              ) : null}
              <p className="mt-2 text-xs text-ink-400">
                {ui(locale, P.medMktNote)}
              </p>
            </div>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.medAbout)}</h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-600">{medicine.description}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-ink-100 p-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.medUsesDosage)}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">{ui(locale, P.medIndications)}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-600">{medicine.useCases}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">{ui(locale, P.medTypicalDosage)}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-600">{medicine.dosage}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">{ui(locale, P.medStorage)}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-600">{medicine.storage}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="panel rounded-3xl border-l-4 border-l-mint-500 p-6">
              <h2 className="text-base font-bold text-ink-900">{ui(locale, P.medAdvantages)}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{medicine.pros}</p>
            </section>
            <section className="panel rounded-3xl border-l-4 border-l-amber-500 p-6">
              <h2 className="text-base font-bold text-ink-900">{ui(locale, P.medCautions)}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{medicine.cons}</p>
            </section>
          </div>

          {/* Share this saving — viral component */}
          <ShareSavings
            medicineName={medicine.name}
            usPrice={formatUsd(medicine.usEuPrice, locale)}
            indiaPrice={formatUsd(medicine.indiaPrice, locale)}
            savingsPercent={savings}
            locale={locale}
          />

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.medSideEffects)}</h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-600">{medicine.sideEffects}</p>
          </section>

          {alternatives.length > 0 ? (
            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">{ui(locale, P.medAlternatives)}</h2>
              <p className="mt-2 text-sm text-ink-600">
                {ui(locale, P.medAltIntro)} <span className="font-semibold text-ink-900">{medicine.genericSalt}</span>. {ui(locale, P.medSortedNote)}
              </p>
              <div className="mt-5 space-y-3">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    href={`/${locale}/medicine/${alt.slug}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 p-4 transition hover:border-mint-500/40 hover:bg-mint-500/5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{alt.name}</p>
                      <p className="text-xs text-ink-400">{alt.company}   {alt.strength}   {alt.packSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-mint-600">{formatUsd(alt.indiaPrice, locale)}</p>
                      <p className="text-xs text-ink-400 line-through">{formatUsd(alt.usEuPrice, locale)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Indian alternative price</p>
            <p className="mt-1 text-3xl font-black text-mint-600">{formatUsd(medicine.indiaPrice, locale)}</p>
            <p className="mt-1 text-sm text-ink-400">
              instead of <span className="line-through">{formatUsd(medicine.usEuPrice, locale)}</span>
            </p>
            <Link href={`/${locale}#savings`} className="btn-primary mt-5 w-full">
              Calculate Potential Savings
            </Link>
            <Link href={`/${locale}/search?q=${encodeURIComponent(medicine.genericSalt)}`} className="mt-3 block rounded-xl border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-600 transition hover:border-ink-400">
              {ui(locale, P.medCompareAll)} {medicine.genericSalt} {ui(locale, P.medOptions)}
            </Link>
            <div className="mt-4">
              <QuickShareButton
                medicineName={medicine.name}
                usPrice={formatUsd(medicine.usEuPrice, locale)}
                indiaPrice={formatUsd(medicine.indiaPrice, locale)}
                savingsPercent={savings}
              />
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-800">
                {ui(locale, medicine.prescriptionRequired ? P.medRxWarn : P.medOtcWarn)}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}