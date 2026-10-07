import type { Metadata } from "next";
import Link from "next/link";
import { primaryLocales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jivan — Medicine Access for Everyone",
  description: "Compare medicine prices and explore source-linked operation and procedure cost guides.",
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      ...Object.fromEntries(primaryLocales.map((locale) => [locale, `${SITE_URL}/${locale}/`])),
      "x-default": `${SITE_URL}/`,
    },
  },
};

/** A static language landing page: no user-agent or browser-language redirects. */
export default function RootPage() {
  return (
    <main className="hero-aurora relative flex min-h-screen items-center overflow-hidden">
      <div className="grid-lines absolute inset-0" />
      <div className="shell relative w-full py-16 sm:py-24">
        <span className="chip">Jivan · Medicine access for everyone</span>
        <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          Compare prices. Make informed health decisions.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-200 sm:text-lg">
          Choose a language to explore medicine comparisons, operation and procedure costs, and practical health guides. Jivan provides educational information—not medical advice.
        </p>
        <nav aria-label="Choose a language" className="mt-8 flex flex-wrap gap-3">
          {primaryLocales.map((locale) => (
            <Link key={locale} href={`/${locale}`} className="btn-primary uppercase">
              {locale}
            </Link>
          ))}
        </nav>
        <p className="mt-10 text-sm text-ink-300">
          <Link href="/en/surgeries" className="underline underline-offset-4 hover:text-mint-200">
            View operations &amp; procedure costs
          </Link>
        </p>
      </div>
    </main>
  );
}
