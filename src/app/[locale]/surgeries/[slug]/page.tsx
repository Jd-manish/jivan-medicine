import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { surgeries, getSurgerBySlug, surgerySavingsPercent, formatRange } from "@/lib/surgeries";
import { isValidLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  return surgeries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const surgery = getSurgerBySlug(slug);
  if (!surgery) return {};

  const indiaAvg = (surgery.prices.india.low + surgery.prices.india.high) / 2;
  const usAvg = (surgery.prices.us.low + surgery.prices.us.high) / 2;
  const savings = surgerySavingsPercent(usAvg, indiaAvg);

  return {
    title: `${surgery.name} Cost — India vs US, Europe & Australia | Save ${savings}%`,
    description: `${surgery.name} costs ${formatRange(surgery.prices.india.low, surgery.prices.india.high)} in India vs ${formatRange(surgery.prices.us.low, surgery.prices.us.high)} in the US. Same quality, ${savings}% less. Compare prices, recovery time, and what to ask.`,
    keywords: [
      `${surgery.name.toLowerCase()} cost India`,
      `${surgery.name.toLowerCase()} cost comparison`,
      `${surgery.name.toLowerCase()} medical tourism`,
      `affordable ${surgery.name.toLowerCase()} India`,
    ],
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

  const usAvg = (surgery.prices.us.low + surgery.prices.us.high) / 2;
  const euAvg = (surgery.prices.eu.low + surgery.prices.eu.high) / 2;
  const auAvg = (surgery.prices.australia.low + surgery.prices.australia.high) / 2;
  const indiaAvg = (surgery.prices.india.low + surgery.prices.india.high) / 2;
  const savings = surgerySavingsPercent(usAvg, indiaAvg);
  const multiple = (usAvg / indiaAvg).toFixed(1);

  return (
    <>
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
            <div className="panel rounded-3xl p-6 space-y-4">
              <PriceRow flag="🇺🇸" label="United States" range={formatRange(surgery.prices.us.low, surgery.prices.us.high)} percent={100} color="bg-ink-300" />
              <PriceRow flag="🇪🇺" label="Europe" range={formatRange(surgery.prices.eu.low, surgery.prices.eu.high)} percent={Math.round((euAvg / usAvg) * 100)} color="bg-ink-200" />
              <PriceRow flag="🇦🇺" label="Australia" range={formatRange(surgery.prices.australia.low, surgery.prices.australia.high)} percent={Math.round((auAvg / usAvg) * 100)} color="bg-ink-200" />
              <PriceRow flag="🇮🇳" label="India" range={formatRange(surgery.prices.india.low, surgery.prices.india.high)} percent={Math.round((indiaAvg / usAvg) * 100)} color="bg-mint-500" highlight />
            </div>

            {/* Savings highlight */}
            <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-center text-white">
              <p className="text-5xl font-black">{savings}%</p>
              <p className="mt-2 text-sm text-white/60">savings compared to US pricing</p>
              <p className="mt-1 text-xs text-white/40">{multiple}× cheaper</p>
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

            {/* Why cheaper */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">Why is it cheaper in India?</h3>
              <ul className="mt-4 space-y-3">
                {surgery.whyCheaper.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <span className="mt-0.5 text-mint-500">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quality */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">Quality & safety</h3>
              <p className="mt-3 text-sm leading-7 text-ink-600">{surgery.quality}</p>
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

            {/* Share */}
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Share this comparison</h3>
              <div className="mt-3 flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just found out ${surgery.name} costs ${formatRange(surgery.prices.india.low, surgery.prices.india.high)} in India vs ${formatRange(surgery.prices.us.low, surgery.prices.us.high)} in the US. That's ${savings}% less!`)}&url=${encodeURIComponent(`https://jivan.health/${locale}/surgeries/${surgery.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-ink-900 px-3 py-2 text-xs font-semibold text-white hover:bg-ink-800"
                >
                  Share on X
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${surgery.name}: ${formatRange(surgery.prices.india.low, surgery.prices.india.high)} in India vs ${formatRange(surgery.prices.us.low, surgery.prices.us.high)} in US. ${savings}% less! https://jivan.health/${locale}/surgeries/${surgery.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
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
            <strong>Medical Disclaimer:</strong> All prices are approximate ranges based on publicly
            available hospital pricing (2024–2026). Actual costs vary by hospital, city,
            patient condition, and insurance coverage. Jivan is an informational platform
            and does not provide medical advice or arrange treatments. Always consult a
            qualified medical professional before making treatment decisions.
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
  percent: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-mint-50 border border-mint-200" : "bg-ink-50"}`}>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${highlight ? "text-mint-700" : "text-ink-700"}`}>
          {flag} {label}
        </span>
        <span className={`font-bold ${highlight ? "text-mint-700" : "text-ink-400"}`}>{range}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(percent, 3)}%` }} />
      </div>
    </div>
  );
}