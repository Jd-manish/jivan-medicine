import type { Metadata } from "next";
import Link from "next/link";
import { GlobeArt, MoleculeArt, ShieldArt, WalletArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "About Jivan — Medicine Price Information and Health Guides",
    description: "Learn what Jivan’s medicine price comparisons and health guides cover, how to interpret their limits, and how to contact the site.",
    alternates: localizedAlternates(locale, "about"),
    robots: localizedRobots(locale),
  };
}

const roles = [
  {
    t: "Pricing references",
    d: "The site displays medicine price comparisons and procedure ranges. Use the source notes and methodology links on each page to understand the basis and limits of a figure.",
  },
  {
    t: "Safety information",
    d: "Articles link to public-health and regulator information where cited. Educational content cannot assess an individual’s condition or replace advice from a qualified clinician.",
  },
  {
    t: "Plain-language guides",
    d: "The article library covers affordability, product checks, treatment-abroad planning, and questions readers can take to a clinician or provider.",
  },
  {
    t: "Static catalog and search",
    d: "Jivan is a static information site. Search results can include calculated catalogue entries; not every result has its own detail page or a separately linked source.",
  },
];

const commitments = [
  { icon: <WalletArt className="h-9 w-9" />, t: "No medicine sales", d: "Jivan is not a pharmacy and does not sell medicine or take a cut of a purchase through this site." },
  { icon: <ShieldArt className="h-9 w-9" />, t: "Limits stated", d: "A displayed comparison is a reference, not a live quote or a recommendation to buy, import, start, stop, or change treatment." },
  { icon: <GlobeArt className="h-9 w-9" />, t: "Clinician-first", d: "Ask a qualified clinician or pharmacist before changing a medicine, dose, brand, or formulation—especially for high-risk treatment." },
  { icon: <MoleculeArt className="h-9 w-9" />, t: "Corrections welcome", d: "Readers can report a broken source or possible error through the contact details on our corrections page." },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">About us</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">
            Jivan — medicine information and price comparisons
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            Jivan is an informational website for comparing medicine prices and reading practical health-affordability guides. It is not a pharmacy, medical provider, or source of individual treatment advice.
          </p>
        </div>
      </section>

      <div className="shell py-12">
        <section className="panel rounded-3xl p-6 sm:p-9">
          <h2 className="text-2xl font-bold text-ink-900">Why Jivan exists</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-8 text-ink-600">
            <p>
              Medicine prices can vary between markets and products. Jivan brings selected reference figures and practical questions together so readers can check what a comparison covers before speaking with a clinician, pharmacist, or provider.
            </p>
            <p>
              The site includes a medicine catalogue, an operations-and-procedures cost section, and articles on affordability, product safety, and treatment planning. Some medicine results are derived catalogue entries; they are not live supplier quotes and may not have a dedicated detail page.
            </p>
            <p>
              Jivan does not process medicine orders. The site is available without an account. For the scope of a particular number, follow that page’s references and methodology notes; for an error, use the corrections contact route.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/search/`} className="btn-primary">Search medicines</Link>
            <Link href={`/${locale}/surgeries/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Operations &amp; procedures</Link>
            <Link href={`/${locale}/articles/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Read the guides</Link>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => (
            <article key={item.t} className="panel panel-hover rounded-3xl p-6">
              {item.icon}
              <h2 className="mt-4 text-base font-bold text-ink-900">{item.t}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{item.d}</p>
            </article>
          ))}
        </section>

        <section className="panel mt-8 rounded-3xl p-6 sm:p-9">
          <h2 className="text-2xl font-bold text-ink-900">How the site is organized</h2>
          <p className="mt-3 text-[15px] leading-8 text-ink-600">
            The labels below describe the topics covered by Jivan; they are not biographies or credentials for named people and do not claim that every page received independent clinical review. Article pages link to their references and show an update date where available.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role.t} className="rounded-2xl border border-ink-100 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-mint-600">{role.t}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-600">{role.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel mt-8 rounded-3xl p-6 sm:p-9">
          <h2 className="text-2xl font-bold text-ink-900">Contact and corrections</h2>
          <p className="mt-3 text-[15px] leading-7 text-ink-600">
            Send the page URL and, when possible, a public source that supports your correction. Contact routes and the limits of the published information are explained in our policy pages.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact/`} className="btn-primary">Contact Jivan</Link>
            <Link href={`/${locale}/corrections/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Corrections policy</Link>
            <Link href={`/${locale}/methodology/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Price methodology</Link>
            <Link href={`/${locale}/medical-disclaimer/`} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-mint-500">Medical disclaimer</Link>
          </div>
        </section>
      </div>
    </>
  );
}
