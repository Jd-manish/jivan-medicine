import type { Metadata } from "next";
import Link from "next/link";
import { GlobeArt, MoleculeArt, ShieldArt, WalletArt } from "@/components/medical-art";
import { isValidLocale, supportedLocales } from "@/lib/i18n";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "About Jivan — Who We Are and Why This Platform Exists",
    description:
      "Jivan is an independent, non-commercial medicine price-transparency project. Learn about our mission, our working model, how our content is made, and how to reach the team.",
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/about`])),
    },
  };
}

const roles = [
  {
    t: "Pricing research",
    d: "Collecting and cross-checking reference price ranges across markets, maintaining the anchor dataset, and running the re-review cycle on existing figures.",
  },
  {
    t: "Clinical content review",
    d: "Checking every guide against regulator-approved label information (FDA labels, EMA product information, WHO guidance) so clinical statements stay within what the evidence supports.",
  },
  {
    t: "Editorial and plain language",
    d: "Turning source material into articles a stressed, non-specialist reader can actually use: clear next steps, explicit limitations, and no padding.",
  },
  {
    t: "Engineering and data integrity",
    d: "Keeping the catalog fast and searchable across 24 locales, and maintaining the labeling system that keeps estimates visibly separate from verified data.",
  },
];

const commitments = [
  { icon: <WalletArt className="h-9 w-9" />, t: "No selling, no commission", d: "We do not sell medicine, run a pharmacy, or take a cut of any purchase. There is no checkout on this site by design." },
  { icon: <ShieldArt className="h-9 w-9" />, t: "Labels over promises", d: "Verified data is marked as verified. Estimates are marked as estimates. Unavailable data is stated as unavailable — never dressed up." },
  { icon: <GlobeArt className="h-9 w-9" />, t: "Physician-first", d: "Every pricing page pushes toward clinician involvement, and our safety guidance errs on the side of caution, especially for high-risk therapy." },
  { icon: <MoleculeArt className="h-9 w-9" />, t: "Corrections in public", d: "Errors are fixed visibly with updated review dates rather than edited silently." },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">About us</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-ink-900 sm:text-4xl">
            Jivan — medicine access for everyone
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            An independent, non-commercial price-transparency project built so that no family abandons treatment
            because nobody told them an affordable same-salt equivalent existed.
          </p>
        </div>
      </section>

      <div className="shell py-12">
        <section className="panel rounded-3xl p-6 sm:p-9">
          <h2 className="text-2xl font-bold text-ink-900">Why Jivan exists</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-8 text-ink-600">
            <p>
              The active ingredient in a medicine does not change at a border. Its price does — sometimes by a factor
              of ten, sometimes by a factor of a hundred. Families in the United States and Europe routinely discover
              this only after months of rationing doses, skipping refills, or stopping treatment they could never
              afford in the first place.
            </p>
            <p>
              Jivan was built to close that information gap. We are not a pharmacy and we do not sell anything. We
              maintain an open catalog of medicine pricing with explicit honesty labels, background lookups for
              medicines we don't yet list, and a research library that teaches people how to verify products, talk to
              their doctors about cost, and buy safely.
            </p>
            <p>
              The platform is free to use, with no account requirement and no paywall, and is sustained by voluntary
              reader contributions plus clearly labelled display advertising where enabled.
            </p>
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
          <h2 className="text-2xl font-bold text-ink-900">How the work is organized</h2>
          <p className="mt-3 text-[15px] leading-8 text-ink-600">
            Jivan is run by a small team organized around four functions. We deliberately publish role descriptions
            rather than personal biographies for staff privacy — accountability lives at the organization level, and
            every piece of content passes the same review workflow regardless of who drafted it.
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
          <h2 className="text-2xl font-bold text-ink-900">Reach the team</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ["General and support", "support@jivan.health", `/${locale}/contact`],
              ["Catalog errors and price reports", "catalog@jivan.health", `/${locale}/contact`],
              ["Partnerships and media", "partnerships@jivan.health", `/${locale}/contact`],
            ].map(([label, email, href]) => (
              <div key={email} className="rounded-2xl bg-ink-50 p-5">
                <h3 className="text-sm font-bold text-ink-900">{label}</h3>
                <p className="mt-1.5 break-all text-sm text-ink-600">{email}</p>
                <Link href={href} className="mt-3 inline-block text-sm font-semibold text-mint-600 hover:text-mint-500">
                  Open contact page →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border-l-4 border-l-mint-500 bg-mint-500/5 p-6 sm:p-9">
          <h2 className="text-lg font-bold text-ink-900">Our published standards</h2>
          <p className="mt-2 text-sm leading-7 text-ink-600">
            We hold ourselves to written, public standards. If we fall short of them, readers should be able to
            point at them and say so.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              ["Editorial policy", `/${locale}/editorial-policy`],
              ["Price methodology", `/${locale}/methodology`],
              ["Medical disclaimer", `/${locale}/medical-disclaimer`],
              ["Privacy policy", `/${locale}/privacy`],
              ["Terms of use", `/${locale}/terms`],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-100 transition hover:text-mint-600"
              >
                {label} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
