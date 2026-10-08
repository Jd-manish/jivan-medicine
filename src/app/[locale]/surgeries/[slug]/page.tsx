import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { surgeries, getSurgerBySlug, surgerySavingsPercent, formatPrice, priceMidpoint, priceReferencePoint, priceComparisonBasis } from "@/lib/surgeries";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  return surgeries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const surgery = getSurgerBySlug(slug);
  if (!surgery) return {};

  const indiaReference = priceReferencePoint(surgery.prices.india);
  const usReference = priceReferencePoint(surgery.prices.us);
  const savings = surgerySavingsPercent(usReference, indiaReference);
  const comparisonBasis = priceComparisonBasis(surgery.prices.india, surgery.prices.us);
  const relativeCost = savings >= 0
    ? `${savings}% lower using ${comparisonBasis.toLowerCase()}`
    : `${Math.abs(savings)}% higher using ${comparisonBasis.toLowerCase()}`;

  return {
    title: `${surgery.name} Cost — India vs US, Europe & Australia | Jivan`,
    description: `Compare source-linked ${surgery.name.toLowerCase()} prices: ${formatPrice(surgery.prices.india)} in India versus ${formatPrice(surgery.prices.us)} in the US (${relativeCost}). Review market sources, procedure scope, recovery, and questions for hospitals.`,
    keywords: [
      `${surgery.name.toLowerCase()} cost India`,
      `${surgery.name.toLowerCase()} cost comparison`,
      `${surgery.name.toLowerCase()} medical tourism`,
      `affordable ${surgery.name.toLowerCase()} India`,
    ],
    alternates: localizedAlternates(locale, `surgeries/${slug}`),
    robots: localizedRobots(locale),
    openGraph: {
      title: `${surgery.name} cost comparison | Jivan`,
      description: `Source-linked price references and procedure information for ${surgery.name}.`,
      url: `${SITE_URL}/${locale}/surgeries/${slug}/`,
      type: "article",
    },
  };
}

export default async function SurgeryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return null;

  const surgery = getSurgerBySlug(slug);
  if (!surgery) return notFound();

  const usAvg = priceReferencePoint(surgery.prices.us);
  const euAvg = priceMidpoint(surgery.prices.eu);
  const australia = surgery.prices.australia;
  const indiaAvg = priceReferencePoint(surgery.prices.india);
  const savings = surgerySavingsPercent(usAvg, indiaAvg);
  const comparisonBasis = priceComparisonBasis(surgery.prices.india, surgery.prices.us);
  const comparisonMultiple = (Math.max(usAvg, indiaAvg) / Math.min(usAvg, indiaAvg)).toFixed(1);
  const pageUrl = `${SITE_URL}/${locale}/surgeries/${surgery.slug}/`;
  const procedureSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${surgery.name} cost comparison`,
    url: pageUrl,
    description: `${surgery.description} Source-linked price references are shown with publisher and scope notes; they are not provider quotes.`,
    about: {
      "@type": "MedicalProcedure",
      name: surgery.name,
      description: surgery.description,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${locale}/` },
      { "@type": "ListItem", position: 2, name: "Operations & procedures", item: `${SITE_URL}/${locale}/surgeries/` },
      { "@type": "ListItem", position: 3, name: surgery.name, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <div className="shell relative py-14 sm:py-20">
          <Link href={`/${locale}/surgeries`} className="chip mb-4 inline-block">
            ← All surgeries
          </Link>
          <span className="chip block w-fit">{surgery.category}</span>
          <h1 className="anim-rise mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            {surgery.name}
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            {surgery.description}
          </p>
        </div>
      </section>

      {/* Price comparison */}
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-ink-900">Cost comparison</h2>

            {/* Price bars */}
            <div className="panel space-y-4 rounded-3xl p-6">
              <PriceRow flag="🇺🇸" label="United States" range={formatPrice(surgery.prices.us)} percent={100} color="bg-ink-300" />
              <PriceRow flag="🇪🇺" label="Europe" range={formatPrice(surgery.prices.eu)} percent={surgery.prices.eu.currency === "USD" ? Math.round((euAvg / usAvg) * 100) : null} color="bg-ink-200" />
              <PriceRow
                flag="🇦🇺"
                label="Australia"
                range={formatPrice(australia, "Australia")}
                percent={australia?.currency === "USD" ? Math.round((priceMidpoint(australia) / usAvg) * 100) : null}
                color="bg-ink-200"
              />
              <PriceRow flag="🇮🇳" label="India" range={formatPrice(surgery.prices.india)} percent={Math.round((indiaAvg / usAvg) * 100)} color="bg-mint-500" highlight />
              <p className="text-xs leading-5 text-ink-500">
                Source currencies are retained: most India, US, and Europe figures are in USD, some Europe sources report EUR, and Australia references may be in AUD or publisher-reported USD. Each evidence note names the source scope and currency. Bars compare only USD values; a missing Australian range means the linked source does not publish a comparable self-pay price.
              </p>
            </div>

            {/* Source-reference comparison; not a guarantee of an individual quote. */}
            <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-center text-white">
              <p className="text-5xl font-black">{Math.abs(savings)}%</p>
              <p className="mt-2 text-sm text-white/70">
                {savings >= 0 ? `lower using ${comparisonBasis.toLowerCase()}` : `higher using ${comparisonBasis.toLowerCase()}`}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {comparisonMultiple}× reference-price ratio · arithmetic only, not a guaranteed saving or like-for-like quote
              </p>
            </div>

            {/* Procedure details */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">Procedure details</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-400">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{surgery.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-400">Hospital stay</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{surgery.hospitalStay}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-400">Recovery</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{surgery.recovery}</p>
                </div>
              </div>
            </div>

            {/* Indications */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">When is this surgery needed?</h3>
              <ul className="mt-4 space-y-2">
                {surgery.indications.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price-scope interpretation */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">How to interpret the price difference</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Publishers may report clinic estimates, hospital charges, claims data, or medical-tourism packages; these measures are not interchangeable.",
                  "The sources do not establish that the compared prices cover identical procedures, devices, hospital stays, or follow-up.",
                  "A lower published price is not evidence of equivalent quality or outcomes. Verify the specific clinician, facility, treatment plan, and exclusions with your own care team.",
                ].map((reason) => (
                  <li key={reason} className="flex items-start gap-2 text-sm leading-6 text-ink-600">
                    <span className="mt-0.5 text-mint-500" aria-hidden="true">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quality */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">Quality &amp; safety checks</h3>
              <p className="mt-3 text-sm leading-7 text-ink-600">Country and price alone cannot establish the quality of a specific hospital or clinician. Before deciding, verify the exact facility and treating clinician, ask about procedure-specific experience and complication pathways, and arrange follow-up with a clinician at home.</p>
              <p className="mt-3 text-sm leading-7 text-ink-600">The CDC advises medical travellers to research providers, plan continuity of care, and understand risks including infection, complications, and travel after treatment. Accreditation is one research signal, not a guarantee of an outcome.</p>
              <a href="https://wwwnc.cdc.gov/travel/page/medical-tourism" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-mint-700 underline underline-offset-2">CDC medical tourism guidance ↗</a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Quick facts */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Risks to know</h3>
              <ul className="mt-3 space-y-2">
                {surgery.risks.map((risk, i) => (
                  <li key={i} className="text-xs leading-5 text-ink-600">• {risk}</li>
                ))}
              </ul>
            </div>

            {/* Questions to ask */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Questions to ask the hospital</h3>
              <ul className="mt-3 space-y-2">
                {surgery.questionsToAsk.map((q, i) => (
                  <li key={i} className="text-xs leading-5 text-ink-600">❓ {q}</li>
                ))}
              </ul>
            </div>

            {/* Clickable, market-specific price references */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">Price sources by market</h3>
              <ul className="mt-4 space-y-4">
                {surgery.priceEvidence.map((source) => (
                  <li key={`${source.market}-${source.url}`} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-mint-700 underline decoration-mint-300 underline-offset-2 hover:text-mint-800"
                    >
                      {source.market}: {source.label} — {source.publisher} ↗
                    </a>
                    <p className="mt-1 text-xs font-semibold text-ink-700">{source.reportedPrice}</p>
                    <p className="mt-1 text-[11px] leading-5 text-ink-500">{source.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] leading-4 text-ink-400">The linked publishers report the figures above; this page does not imply that providers have re-quoted or independently confirmed them on a particular date. Price scope, package contents, eligibility, and procedure variants differ. Check the source page and request a current dated, itemised quote directly from a provider. Jivan does not arrange treatment.</p>
            </div>

            {/* Share */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Share this comparison</h3>
              <div className="mt-3 flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${surgery.name}: ${formatPrice(surgery.prices.india)} in India vs ${formatPrice(surgery.prices.us)} in the US; ${Math.abs(savings)}% ${savings >= 0 ? "lower" : "higher"} using ${comparisonBasis.toLowerCase()}. This is arithmetic only, not a like-for-like quote.`)}&url=${encodeURIComponent(`${SITE_URL}/${locale}/surgeries/${surgery.slug}/`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-ink-900 px-3 py-2 text-xs font-semibold text-white hover:bg-ink-800"
                >
                  Share on X
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${surgery.name}: ${formatPrice(surgery.prices.india)} in India vs ${formatPrice(surgery.prices.us)} in the US; ${Math.abs(savings)}% ${savings >= 0 ? "lower" : "higher"} using ${comparisonBasis.toLowerCase()} (arithmetic only, not like-for-like). ${SITE_URL}/${locale}/surgeries/${surgery.slug}/`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-800"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="shell pb-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs leading-6 text-amber-800">
            <strong>Medical and price disclaimer:</strong> Source-linked prices are reference figures, not personalised quotes. Procedure variants, currencies, insurance/claims basis, package inclusions, and dates differ by source, so comparisons are not like-for-like. Do not delay urgent care or travel for treatment based on price alone. Jivan is informational only and does not provide medical advice or arrange treatment; consult a qualified clinician.
          </p>
        </div>
      </section>
    </>
  );
}

function PriceRow({
  flag,
  label,
  range,
  percent,
  color,
  highlight,
}: {
  flag: string;
  label: string;
  range: string;
  percent: number | null;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-mint-50 border border-mint-200" : "bg-ink-50"}`}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={`font-semibold ${highlight ? "text-mint-700" : "text-ink-700"}`}>
          {flag} {label}
        </span>
        <span className={`text-right font-bold ${highlight ? "text-mint-700" : "text-ink-400"}`}>{range}</span>
      </div>
      {percent !== null && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(percent, 3))}%` }} />
        </div>
      )}
    </div>
  );
}