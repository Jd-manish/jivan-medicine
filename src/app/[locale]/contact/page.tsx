import type { Metadata } from "next";
import Link from "next/link";
import { MoleculeArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Contact Jivan — Price Questions and Corrections",
    description: "Find Jivan’s contact routes for medicine price questions, possible corrections, and general enquiries.",
    alternates: localizedAlternates(locale, "contact"),
    robots: localizedRobots(locale),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-6 top-6 w-40 opacity-20" />
        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Contact</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">Get in touch</h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Use the email links below for general questions, price reports, or partnership enquiries. Response times are not guaranteed.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Email contacts</h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-600">
              For a price or content report, include the page URL, the specific figure or sentence, and a public reference if available. Do not email personal health details or medical records.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "General enquiries", email: "support@jivan.health", desc: "Questions about the site or general feedback." },
                { label: "Catalog corrections", email: "catalog@jivan.health", desc: "Report a possible price or content error, or suggest a medicine to add." },
                { label: "Partnerships", email: "partnerships@jivan.health", desc: "NGO, provider, or research collaboration enquiries." },
                { label: "Press and media", email: "press@jivan.health", desc: "Media enquiries about medicine price information." },
              ].map((item) => (
                <div key={item.email} className="rounded-2xl border border-ink-100 p-4">
                  <p className="text-sm font-bold text-ink-900">{item.label}</p>
                  <p className="mt-1 text-sm text-ink-600">{item.desc}</p>
                  <a href={`mailto:${item.email}`} className="mt-2 inline-block rounded-lg bg-mint-500/10 px-3 py-1.5 text-sm font-semibold text-mint-700 hover:bg-mint-500/20">{item.email}</a>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Before sending</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-700">
              <li>Include the exact page URL.</li>
              <li>For prices, specify country, currency, pack, and date.</li>
              <li>Link to a public reference where possible.</li>
              <li>Do not use email for urgent medical help.</li>
            </ul>
          </div>
          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Quick links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href={`/${locale}/corrections/`} className="text-mint-700 hover:underline">Corrections information</Link></li>
              <li><Link href={`/${locale}/editorial-policy/`} className="text-mint-700 hover:underline">Editorial policy</Link></li>
              <li><Link href={`/${locale}/support/`} className="text-mint-700 hover:underline">Support Jivan</Link></li>
            </ul>
          </div>
          <div className="rounded-3xl border-l-4 border-l-amber-500 bg-amber-50 p-6">
            <h2 className="text-sm font-bold text-amber-900">Medical emergencies</h2>
            <p className="mt-2 text-sm leading-7 text-amber-800">Jivan cannot provide emergency or diagnostic care. For urgent symptoms, contact your local emergency services immediately.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
