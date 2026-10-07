import type { Metadata } from "next";
import Link from "next/link";
import { ShieldArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Corrections and Price Questions — Jivan",
    description: "How to report a possible error, a stale price reference, or a broken source link on Jivan.",
    alternates: localizedAlternates(locale, "corrections"),
    robots: localizedRobots(locale),
  };
}

export default async function CorrectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <ShieldArt className="anim-drift absolute -right-4 top-10 w-36 opacity-20" />
        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Transparency</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Corrections and price questions
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Found a broken source, a possible factual error, or a price that needs checking? Here is how to send the details.
          </p>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">What to include</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-600">
                Email the page URL, identify the specific statement or price, and include a public reference that supports the correction when possible. For a price comparison, note the country, currency, unit or pack size, date, and what the quoted price includes.
              </p>
              <p className="mt-3 text-[15px] leading-7 text-ink-600">
                A message is a report, not a guarantee that a figure will be changed. We cannot promise a response time or a public correction log. If a page is materially changed, check its visible update information and source notes.
              </p>
              <a href="mailto:catalog@jivan.health?subject=Jivan%20correction%20or%20price%20report" className="btn-primary mt-5 inline-flex">
                Email a correction report
              </a>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">Understanding medicine price labels</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-600">
                Labels describe the catalogue record’s status; they are not a live supplier offer, regulatory endorsement, or independent certification. The present medicine dataset does not include a public source URL for every anchor, and derived entries are calculations rather than separately observed pharmacy prices. See the <Link href={`/${locale}/methodology/`} className="font-semibold text-mint-700 underline underline-offset-2">methodology and limits</Link> before relying on any figure.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink-100 p-4">
                  <span className="inline-flex rounded-lg bg-mint-500/10 px-2.5 py-1 text-xs font-bold text-mint-700">Market checked anchor</span>
                  <p className="mt-2 text-sm leading-6 text-ink-600">The row is marked as a curated price reference in the data. The label does not itself provide a source URL, quote date, or guarantee of current availability.</p>
                </div>
                <div className="rounded-2xl border border-ink-100 p-4">
                  <span className="inline-flex rounded-lg bg-royal-500/10 px-2.5 py-1 text-xs font-bold text-royal-700">Derived</span>
                  <p className="mt-2 text-sm leading-6 text-ink-600">A catalogue calculation based on a reference row. It is not a separately checked product listing or a price offered by the named manufacturer.</p>
                </div>
              </div>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">Procedure price references</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-600">
                Procedure pages link to the publisher’s own range or benchmark and show market, currency, and source notes where available. Those figures may differ in inclusions and are not like-for-like quotes. Contact the provider for a written, patient-specific estimate and verify what is included.
              </p>
              <Link href={`/${locale}/surgeries/`} className="mt-4 inline-flex font-semibold text-mint-700 underline underline-offset-2">Browse all 25 operations and procedures →</Link>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="panel rounded-3xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Related information</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["Editorial policy", `/${locale}/editorial-policy/`],
                  ["Price methodology", `/${locale}/methodology/`],
                  ["Medical disclaimer", `/${locale}/medical-disclaimer/`],
                  ["Contact Jivan", `/${locale}/contact/`],
                  ["Search medicines", `/${locale}/search/`],
                ].map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-mint-700 hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
