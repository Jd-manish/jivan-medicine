import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";
import {
  CapsuleArt,
  EcgLine,
  GlobeArt,
  HeroArtCluster,
  MoleculeArt,
  ShieldArt,
  SyringeArt,
  TabletArt,
  VialArt,
  WalletArt,
} from "@/components/medical-art";
import { MedicineSearch } from "@/components/medicine-search";
import { formatUsd } from "@/components/price-block";
import { AnimatedCounter } from "@/components/animated-counter";
import { PriceShockCard } from "@/components/price-shock";
import { SavingsCalculator } from "@/components/savings-calculator";
import { WhyCheaper } from "@/components/why-cheaper";
import { AdSlot } from "@/components/ad-slot";
import { TopSearch } from "@/components/top-search";
import { articles } from "@/lib/articles";
import {
  ensureMedicineSeeded,
  getInventoryStats,
  getMedicineCatalog,
  getTopSavings,
  medicineCategories,
} from "@/lib/medicines";
import { isValidLocale, supportedLocales, t } from "@/lib/i18n";
import { U, ui } from "@/lib/ui-core";
import { P } from "@/lib/ui-panels";

// Fully static — no DB, no server runtime needed.
export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const copy = t(locale as any);

  return {
    title: "Compare Medicine Prices & Indian Generic Alternatives",
    description: copy.heroSubtitle,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries([
        ...supportedLocales.map((alt) => [alt, `/${alt}`] as const),
        ["x-default", "/en"] as const,
      ]),
    },
    openGraph: {
      title: "Jivan — Medicine Access for Everyone",
      description: copy.heroSubtitle,
      url: `/${locale}`,
      type: "website",
      siteName: "Jivan",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Jivan — Compare Medicine Prices & Indian Generic Alternatives" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Jivan — Compare Medicine Prices & Indian Generic Alternatives",
      description: copy.heroSubtitle,
      images: ["/og-image.svg"],
    },
  };
}

const faqs: FaqItem[] = [
  {
    q: "How can the same active salt cost up to 90% less?",
    a: "Large-scale generic manufacturing, lower production and distribution overheads, and intense competition between certified suppliers create very different retail prices for an identical active pharmaceutical ingredient.",
  },
  {
    q: "Is the quality of a generic the same as the original brand?",
    a: "A quality generic contains the same active ingredient at the same strength and is expected to deliver the same therapeutic effect. Quality depends on the manufacturer, so we always show company, salt, strength, and form so you can verify with your physician or pharmacist.",
  },
  {
    q: "Are all the prices on Jivan verified?",
    a: "No — and we say so clearly. Every listing carries a price status label. Entries we have cross-checked show 'Market checked'. Where reliable data is unavailable, the entry is explicitly labelled 'Guessing (estimated)' with a note explaining the basis.",
  },
  {
    q: "Can I stop my current medicine and switch on my own?",
    a: "Never. Jivan is an educational price-transparency platform. Any change of medicine, dose, brand or formulation must be approved by a licensed physician, especially for cardiac, oncology, transplant, psychiatric and anticoagulant therapy.",
  },
  {
    q: "Do you support patients across the whole EU and the US?",
    a: "Yes. The site auto-detects your browser language and routes you to a localized version, covering 24 European locales plus English for US and international visitors.",
  },
  {
    q: "How do I get a personalized price comparison?",
    a: "Use the free price-check form on this page. Send your medicine list and country, and we will map same-salt alternatives with indicative pricing and clear status labels.",
  },
];

const steps = [
  { n: "01", title: "howStep1T", body: "howStep1B" },
  { n: "02", title: "howStep2T", body: "howStep2B" },
  { n: "03", title: "howStep3T", body: "howStep3B" },
  { n: "04", title: "howStep4T", body: "howStep4B" },
];

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await ensureMedicineSeeded();
  const [initialCatalog, topSavings, stats] = await Promise.all([
    getMedicineCatalog({ page: 1, pageSize: 24 }),
    getTopSavings(6),
    getInventoryStats(),
  ]);
  const adsEnabled = false;
  const copy = t(locale as any);
  const featuredArticles = articles.slice(0, 6);
  const filterCategories = medicineCategories.filter((item) => item !== "All");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jivan",
    description: copy.heroSubtitle,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health"}/${locale}`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jivan — Medicine Access for Everyone",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health"}/${locale}`,
    description: copy.heroSubtitle,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health"}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="hero-aurora relative">
        <div className="grid-lines absolute inset-0" />
        <HeroArtCluster />

        <div className="shell relative py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <span className="chip anim-rise">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
              {copy.heroBadge}
            </span>

            <h1 className="anim-rise delay-1 mt-6 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl">
              {copy.heroHeadlineA}{" "}
              <span className="text-gradient">{copy.heroHeadlineB}</span>
            </h1>

            <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200 sm:text-lg">
              {copy.heroSubtitle}
            </p>

            <div className="anim-rise delay-3 mt-8 max-w-xl">
              <TopSearch locale={locale} placeholder={copy.searchPlaceholder} size="hero" />
              <p className="mt-2 text-xs text-ink-400">
                {ui(locale, P.heroNoteUnderSearch)}
              </p>
            </div>

            <div className="anim-rise delay-4 mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}#catalog`} className="btn-primary">
                {copy.ctaPrimary}
                <span aria-hidden>→</span>
              </Link>
              <Link href={`/${locale}#quote`} className="btn-ghost">
                {ui(locale, P.heroCtaQuote)}
              </Link>
            </div>

            <dl className="anim-rise delay-5 mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {[
                { k: stats.total, v: copy.statCatalogEntries, prefix: "" },
                { k: stats.salts, v: copy.statActiveMolecules, prefix: "" },
                { k: stats.highSaving, v: copy.statHighSaving, prefix: "" },
                { k: 24, v: copy.statEUUSLocales, prefix: "" },
              ].map((stat) => (
                <div key={stat.v}>
                  <dt className="text-2xl font-black text-white sm:text-3xl">
                    <AnimatedCounter end={stat.k} duration={2200} prefix={stat.prefix} className="tabular-nums" />
                  </dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative -mb-px opacity-70">
          <EcgLine className="h-14 w-full" />
        </div>
      </section>

      {/* ---------------- PRICE SHOCK — INTERACTIVE FLIP CARDS ---------------- */}
      {topSavings.length > 0 && (
        <section className="relative overflow-hidden bg-ink-900 py-12 sm:py-16">
          <div className="shell relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-300">
                  💊 Interactive price comparison
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Hover to reveal the India price
                </h2>
                <p className="mt-2 text-sm text-ink-400">
                  Same active ingredient. Same therapeutic effect. Dramatically different prices.
                </p>
              </div>
              <Link
                href={`/${locale}/search?q=`}
                className="btn-ghost hidden sm:inline-flex"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topSavings.slice(0, 6).map((item) => (
                <PriceShockCard
                  key={item.id}
                  name={item.name}
                  genericSalt={item.genericSalt}
                  usEuPrice={item.usEuPrice}
                  indiaPrice={item.indiaPrice}
                  locale={locale}
                  slug={item.slug}
                  packSize={item.packSize}
                  company={item.company}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- TRUST MARQUEE ---------------- */}
      <section className="border-y border-ink-100 bg-white/70 py-5">
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-10 pr-10">
                {[
                  "Same active pharmaceutical ingredient",
                  "Salt · strength · form disclosed",
                  "Price status labelled on every entry",
                  "Physician-first guidance",
                  "24 European locales",
                  "Transparent manufacturer data",
                ].map((label) => (
                  <span key={label} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-ink-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MISSION ---------------- */}
      <section className="shell py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">{ui(locale, U.missionKicker)}</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {ui(locale, U.missionTitle)}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-ink-600">
              <p>{ui(locale, U.missionP1)}</p>
              <p>{ui(locale, U.missionP2)}</p>
              <p className="font-semibold text-ink-900">{ui(locale, U.missionBold)}</p>
            </div>
            <Link href={`/${locale}/mission`} className="btn-primary mt-6">
              {ui(locale, U.missionCta)}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [U.missionCardFreeT, U.missionCardFreeD],
              [U.missionCardHonestT, U.missionCardHonestD],
              [U.missionCardPhysT, U.missionCardPhysD],
              [U.missionCardOpenT, U.missionCardOpenD],
            ].map(([title, desc]) => (
              <div key={title.en} className="panel panel-hover rounded-3xl p-5">
                <ShieldArt className="h-9 w-9" />
                <h3 className="mt-4 text-base font-bold text-ink-900">{ui(locale, title)}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-600">{ui(locale, desc)}</p>
              </div>
            ))}
          </div>

          {/* Editorial-trust strip — surfaced hand review and public standards */}
          <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">{ui(locale, U.editStripKicker)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                [ui(locale, U.editStripPolicy), `/${locale}/editorial-policy`],
                [ui(locale, U.editStripMethod), `/${locale}/methodology`],
                [ui(locale, U.editStripGuides), `/${locale}/articles`],
                [ui(locale, U.editStripDisclaimer), `/${locale}/medical-disclaimer`],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg bg-ink-50 px-3.5 py-2 text-xs font-semibold text-ink-700 transition hover:bg-mint-500/10 hover:text-mint-600"
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- REAL PRICE GAPS ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-20">
        <VialArt className="anim-drift absolute -left-6 top-12 w-24 opacity-20" />
        <CapsuleArt className="anim-float delay-3 absolute -right-6 bottom-10 w-40 opacity-20" />

        <div className="shell relative">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-300">{ui(locale, U.gapsKicker)}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {ui(locale, U.gapsTitle)}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-200">
              {ui(locale, U.gapsBody)}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topSavings.map((item) => {
              const multiple = (item.usEuPrice / Math.max(item.indiaPrice, 1)).toFixed(0);
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/medicine/${item.slug}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-mint-300/40 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-white group-hover:text-mint-300">{item.genericSalt}</h3>
                      <p className="mt-1 truncate text-xs text-ink-400">{item.brandNames || item.name}</p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-mint-500 px-2.5 py-1 text-xs font-black text-ink-900">
                      {multiple}×
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-ink-400">{ui(locale, U.gapUsEu)}</p>
                      <p className="text-lg font-bold text-white/50 line-through">{formatUsd(item.usEuPrice, locale)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wide text-mint-300">{ui(locale, U.gapIndia)}</p>
                      <p className="text-2xl font-black text-mint-300">{formatUsd(item.indiaPrice, locale)}</p>
                    </div>
                  </div>

                  <p className="mt-3 border-t border-white/10 pt-3 text-xs text-ink-400">{item.packSize} · {item.form}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href={`/${locale}/search?q=`} className="btn-ghost">
              {ui(locale, U.gapsCta)} →
            </Link>
          </div>
        </div>
      </section>

      <WhyCheaper locale={locale} />

      <AdSlot
        enabled={adsEnabled}
        clientId={""}
        slotId={""}
        placement="home-mid"
        className="pb-6"
      />

      {/* ---------------- VALUE PILLARS ---------------- */}
      <section className="shell py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Why the gap exists</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{copy.whyTitle}</h2>
          <p className="mt-4 text-base leading-7 text-ink-600">
            The molecule does not change at a border. Manufacturing scale, cost base and market competition do — and that is where the
            difference in your monthly bill comes from.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: <WalletArt className="h-11 w-11" />, title: copy.why1, body: "High-volume generic plants spread fixed costs across enormous production runs, lowering unit economics dramatically.", art: <TabletArt className="anim-float w-14 opacity-70" /> },
            { icon: <GlobeArt className="h-11 w-11" />, title: copy.why2, body: "Lower operational, labour and distribution overheads translate directly into a lower shelf price for the same molecule.", art: <CapsuleArt className="anim-float delay-2 w-20 opacity-70" /> },
            { icon: <ShieldArt className="h-11 w-11" />, title: copy.why3, body: "Dozens of certified manufacturers compete for the same salt, compressing margins in favour of the patient.", art: <VialArt className="anim-float delay-4 w-10 opacity-70" /> },
          ].map((card) => (
            <article key={card.title} className="panel panel-hover relative overflow-hidden rounded-3xl p-6">
              <div className="absolute -right-2 -top-2 opacity-60">{card.art}</div>
              {card.icon}
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-20">
        <MoleculeArt className="anim-drift absolute -right-8 top-10 w-52 opacity-20" />
        <SyringeArt className="anim-float delay-3 absolute -left-10 bottom-8 w-52 opacity-20" />

        <div className="shell relative">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-300">{ui(locale, P.howKicker)}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {ui(locale, P.howTitle)}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-mint-300/40 hover:bg-white/10">
                <span className="text-sm font-black tracking-widest text-mint-300">{step.n}</span>
                <h3 className="mt-3 text-base font-bold leading-snug text-white">
                  {ui(locale, P[step.title as keyof typeof P])}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-200/80">{ui(locale, P[step.body as keyof typeof P])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SAVINGS CALCULATOR ---------------- */}
      <section id="savings" className="shell scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <SavingsCalculator locale={locale} />
        </div>
      </section>

      {/* ---------------- CATALOG ---------------- */}
      <MedicineSearch
        initialData={initialCatalog}
        categories={filterCategories}
        locale={locale}
        copy={{
          searchTitle: copy.searchTitle,
          searchPlaceholder: copy.searchPlaceholder,
          allCategories: copy.allCategories,
          tableMedicine: copy.tableMedicine,
          tableCategory: copy.tableCategory,
          tableUses: copy.tableUses,
          tableCompany: copy.tableCompany,
          tableSalt: copy.tableSalt,
          tableUsEuPrice: copy.tableUsEuPrice,
          tableIndiaPrice: copy.tableIndiaPrice,
          tableSavings: copy.tableSavings,
          tablePriceStatus: copy.tablePriceStatus,
          tablePriceNotes: copy.tablePriceNotes,
          noResults: copy.noResults,
          resultsLabel: copy.resultsLabel,
          pricingReal: copy.pricingReal,
          pricingEstimated: copy.pricingEstimated,
        }}
      />

      {/* ---------------- ARTICLES ---------------- */}
      <section className="shell py-4 sm:py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Knowledge center</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{copy.articleHubTitle}</h2>
            <p className="mt-3 text-base leading-7 text-ink-600">{copy.articleHubSubtitle}</p>
          </div>
          <Link href={`/${locale}/articles`} className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800">
            {copy.navArticles}
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/${locale}/articles/${article.slug}`}
              className="panel panel-hover group flex flex-col rounded-3xl p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-mint-500/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-mint-600">
                  {article.category}
                </span>
                <span className="text-[11px] text-ink-400">{article.readingMinutes} min read</span>
              </div>
              <h3 className="mt-4 text-base font-bold leading-snug text-ink-900 group-hover:text-mint-600">{article.h1}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-600">{article.summary}</p>
              <span className="mt-4 text-sm font-semibold text-mint-600">{copy.articleReadMore} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="shell py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{copy.faqSectionTitle}</h2>
            <p className="mt-4 text-base leading-7 text-ink-600">
              Transparency is the product. If something is estimated, we label it. If something needs a doctor, we say so.
            </p>
            <CapsuleArt className="anim-float mt-8 hidden w-40 opacity-80 lg:block" />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <AdSlot
        enabled={adsEnabled}
        clientId={""}
        slotId={""}
        placement="home-footer"
        className="pb-10"
      />

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="shell pb-20">
        <div className="hero-aurora relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12">
          <div className="grid-lines absolute inset-0" />
          <TabletArt className="anim-float absolute left-6 top-8 w-14 opacity-50" />
          <CapsuleArt className="anim-drift absolute right-6 bottom-8 w-24 opacity-50" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              {ui(locale, P.finalCtaTitle)}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-200">
              {ui(locale, P.finalCtaBody)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}#catalog`} className="btn-primary">
                {copy.ctaPrimary}
              </Link>
              <Link href={`/${locale}/articles`} className="btn-ghost">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-sm font-bold text-amber-900">{copy.safetyNoteTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-amber-800">{copy.safetyNoteBody}</p>
        </div>
      </section>
    </>
  );
}
