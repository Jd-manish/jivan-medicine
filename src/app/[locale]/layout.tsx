import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { AdsenseLoader } from "@/components/ad-slot";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/site-header";
import { SupportButton } from "@/components/support-button";
import { BackToTop } from "@/components/back-to-top";
import { isValidLocale, supportedLocales, t } from "@/lib/i18n";
import { localeLinkRel, localizedRobots, TRANSLATED_UI_LOCALES } from "@/lib/seo";

// Fully static — no DB, no server runtime needed.

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const copy = t(locale as any);

  return {
    title: {
      default: `${copy.brand} | Same-salt medicines at a fraction of the cost`,
      template: `%s | ${copy.brand}`,
    },
    description: copy.heroSubtitle,
    robots: localizedRobots(locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const copy = t(locale as any);
  // Static deployment — no DB settings needed
  const adsEnabled = false;
  const adsClientId = "";

  const navItems = [
    { href: `/${locale}`, label: copy.navHome },
    { href: `/${locale}/search`, label: copy.navMedicines },
    { href: `/${locale}/surgeries`, label: "Surgeries" },
    { href: `/${locale}#savings`, label: "Savings estimator" },
    { href: `/${locale}/articles`, label: copy.navArticles },
    { href: `/${locale}/mission`, label: "Mission" },
    { href: `/${locale}/about`, label: copy.navAbout },
    { href: `/${locale}/contact`, label: copy.navContact },
    { href: `/${locale}/support`, label: "Support us" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        locale={locale}
        brand={copy.brand}
        items={navItems}
        locales={supportedLocales}
        ctaLabel="Get price check"
      />

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-ink-100 bg-white">
        <div className="shell grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={`/${locale}`} aria-label={`${copy.brand} home`} className="inline-flex rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-mint-500/20">
              <BrandLogo idPrefix="footer-logo" name={copy.brand} tagline="Medicine access for everyone" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink-600">{copy.footerText}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li><Link className="hover:text-mint-600" href={`/${locale}/search`}>{copy.navMedicines}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/medicines`}>All medicines A–Z</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/surgeries`}>Surgeries &amp; procedures</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}#savings`}>Savings estimator</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/articles`}>{copy.navArticles}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/support`}>Support us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li><Link className="hover:text-mint-600" href={`/${locale}/about`}>{copy.navAbout}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/contact`}>{copy.navContact}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/editorial-policy`}>Editorial policy</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/methodology`}>Price methodology</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/privacy`}>{copy.navPrivacy}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/terms`}>{copy.navTerms}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/medical-disclaimer`}>{copy.navDisclaimer}</Link></li>
              <li><Link className="hover:text-mint-600" href={`/${locale}/corrections`}>Corrections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Languages</h4>
            {/*
              Only the translated-UI locales are linked from every page. The
              remaining locales are English fallbacks kept out of the index, so
              they are reachable from the language chooser at "/" (and the
              header switcher) rather than from thousands of footer links.
            */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TRANSLATED_UI_LOCALES.map((code) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  hrefLang={code}
                  rel={localeLinkRel(code)}
                  className="rounded-lg bg-ink-50 px-2 py-1 text-[11px] font-semibold uppercase text-ink-600 transition hover:bg-mint-500/10 hover:text-mint-600"
                >
                  {code}
                </Link>
              ))}
            </div>
            <Link href="/" className="mt-3 inline-block text-xs font-semibold text-ink-600 hover:text-mint-600">
              All {supportedLocales.length} languages →
            </Link>
          </div>
        </div>

        <div className="border-t border-ink-100">
          <div className="shell flex flex-col gap-2 py-5 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {copy.brand}. Educational pricing information only.</p>
            <p>Not a pharmacy. Not medical advice. Consult a licensed physician.</p>
          </div>
        </div>
      </footer>

      <SupportButton locale={locale} />
      <BackToTop />
      <MobileBottomNav locale={locale} />
      <AdsenseLoader enabled={adsEnabled} clientId={adsClientId} />
    </div>
  );
}
