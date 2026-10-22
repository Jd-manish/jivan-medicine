import type { Metadata } from "next";
import Link from "next/link";
import { primaryLocales, supportedLocales } from "@/lib/i18n";
import { localeLinkRel, rootAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jivan — Medicine Access for Everyone",
  description: "Compare medicine prices and explore source-linked operation and procedure cost guides.",
  alternates: rootAlternates(),
};

const languageNames: Record<string, string> = {
  en: "English", de: "Deutsch", fr: "Français", es: "Español", it: "Italiano", pt: "Português",
  nl: "Nederlands", pl: "Polski", sv: "Svenska", da: "Dansk", fi: "Suomi", cs: "Čeština",
  ro: "Română", hu: "Magyar", el: "Ελληνικά", sk: "Slovenčina", sl: "Slovenščina", hr: "Hrvatski",
  bg: "Български", et: "Eesti", lv: "Latviešu", lt: "Lietuvių", mt: "Malti", ga: "Gaeilge",
};

const secondaryLocales = supportedLocales.filter(
  (locale) => !(primaryLocales as readonly string[]).includes(locale),
);

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
        <nav aria-label="Choose a language" className="mt-8">
          <div className="flex flex-wrap gap-3">
            {primaryLocales.map((locale) => (
              <Link key={locale} href={`/${locale}`} className="btn-primary" lang={locale} hrefLang={locale} rel={localeLinkRel(locale)}>
                {languageNames[locale] ?? locale.toUpperCase()}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink-300">
            More languages (English content, localized navigation)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {secondaryLocales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                lang={locale}
                hrefLang={locale}
                rel={localeLinkRel(locale)}
                className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-ink-200 transition hover:border-mint-200 hover:text-mint-200"
              >
                {languageNames[locale] ?? locale.toUpperCase()}
              </Link>
            ))}
          </div>
        </nav>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-300">
          <Link href="/en/medicines" className="underline underline-offset-4 hover:text-mint-200">
            Browse all medicines A–Z
          </Link>
          <Link href="/en/surgeries" className="underline underline-offset-4 hover:text-mint-200">
            View operations &amp; procedure costs
          </Link>
          <Link href="/en/articles" className="underline underline-offset-4 hover:text-mint-200">
            Read the cost guides
          </Link>
        </p>
      </div>
    </main>
  );
}
