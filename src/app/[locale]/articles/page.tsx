import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { MoleculeArt } from "@/components/medical-art";
import { articleCategories, articles, getArticlesByCategory, type ArticleCategory } from "@/lib/articles";
import { isValidLocale, supportedLocales } from "@/lib/i18n";


const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health";

type SearchParams = Promise<{ category?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Medicine Cost Guides, Safety Checks and Real Case Studies",
    description: `${articles.length} researched guides on getting discounts on medicines, buying safely online, generic drug safety, and documented case studies of patients cutting prescription costs by up to 98%.`,
    keywords: [
      "medicine cost guides",
      "prescription savings articles",
      "generic medicine safety",
      "medication case studies",
    ],
    alternates: {
      canonical: `/${locale}/articles`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/articles`])),
    },
    openGraph: {
      type: "website",
      title: "Medicine Cost Guides and Case Studies | Jivan",
      description: "Researched, source-cited guides on reducing prescription costs safely.",
      url: `${SITE}/${locale}/articles`,
    },
  };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const activeCategory: ArticleCategory = "All";

  const adsEnabled = false;

  const list = getArticlesByCategory(activeCategory);
  const [featured, ...rest] = list;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jivan medicine affordability library",
    numberOfItems: list.length,
    itemListElement: list.slice(0, 30).map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE}/${locale}/articles/${article.slug}`,
      name: article.h1,
    })),
  };

  const counts = articleCategories.map((category) => ({
    category,
    count: getArticlesByCategory(category).length,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-6 top-6 w-44 opacity-20" />

        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Knowledge library</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Medicine cost guides, safety checks and real case studies
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            {articles.length} researched articles on getting discounts, buying safely, verifying generics and understanding
            why the same molecule costs so differently across borders. Every article starts with an original key-takeaways summary,
            cites Tier-1 regulators and public health bodies, and carries an explicit record of who wrote and reviewed it.
          </p>

          <dl className="anim-rise delay-3 mt-10 grid max-w-xl grid-cols-3 gap-6">
            {[
              { k: `${articles.length}`, v: "Articles" },
              { k: `${articles.filter((a) => a.category === "Case Study").length}`, v: "Case studies" },
              { k: "100%", v: "Source cited" },
            ].map((stat) => (
              <div key={stat.v}>
                <dt className="text-2xl font-black text-white sm:text-3xl">{stat.k}</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="shell py-12">
        {/* Category filter */}
        <nav aria-label="Article categories" className="flex flex-wrap gap-2">
          {counts.map(({ category, count }) => (
            <Link
              key={category}
              href={category === "All" ? `/${locale}/articles` : `/${locale}/articles?category=${encodeURIComponent(category)}`}
              className={`pill-tab ${
                activeCategory === category ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-100 hover:bg-ink-50"
              }`}
            >
              {category} <span className="opacity-60">({count})</span>
            </Link>
          ))}
        </nav>

        {/* Featured */}
        {featured ? (
          <Link
            href={`/${locale}/articles/${featured.slug}`}
            className="panel panel-hover group mt-8 grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-mint-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-mint-600">
                  Most read
                </span>
                <span className="text-xs text-ink-400">{featured.readingMinutes} min read</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-snug text-ink-900 group-hover:text-mint-600 sm:text-3xl">
                {featured.h1}
              </h2>
              <p className="mt-3 text-base leading-7 text-ink-600">{featured.summary}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-mint-600">Read the guide →</span>
            </div>
            {featured.heroStat ? (
              <div className="grid place-items-center rounded-2xl bg-ink-50 p-6 text-center">
                <div>
                  <p className="text-4xl font-black text-mint-600">{featured.heroStat.value}</p>
                  <p className="mt-2 text-xs leading-5 text-ink-500">{featured.heroStat.label}</p>
                </div>
              </div>
            ) : null}
          </Link>
        ) : null}

        <AdSlot
          enabled={adsEnabled}
          clientId={""}
          slotId={""}
          placement="articles-top"
          className="!px-0 py-8"
        />

        {/* Grid */}
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => (
            <Link
              key={article.slug}
              href={`/${locale}/articles/${article.slug}`}
              className={`panel panel-hover anim-rise group flex flex-col rounded-3xl p-6 delay-${Math.min((index % 4) + 1, 4)}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-ink-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                  {article.category}
                </span>
                <span className="text-[11px] text-ink-400">{article.readingMinutes} min</span>
              </div>

              <h2 className="mt-3 text-base font-bold leading-snug text-ink-900 group-hover:text-mint-600">
                {article.h1}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-600">{article.summary}</p>

              {article.snapshot ? (
                <p className="mt-3 rounded-lg bg-mint-500/8 px-3 py-2 text-xs font-semibold text-mint-600">
                  {article.snapshot.westernCost} → {article.snapshot.indianCost}
                </p>
              ) : null}

              <span className="mt-4 text-sm font-semibold text-mint-600">Read article →</span>
            </Link>
          ))}
        </div>

        {/* Topic cloud for internal linking */}
        <section className="panel mt-12 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink-900">Popular questions we answer</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {articles.slice(0, 12).flatMap((article) =>
              article.faqs.slice(0, 1).map((faq) => (
                <Link
                  key={`${article.slug}-${faq.q}`}
                  href={`/${locale}/articles/${article.slug}#faq`}
                  className="rounded-xl border border-ink-100 px-4 py-3 text-sm text-ink-600 transition hover:border-mint-500/40 hover:text-mint-600"
                >
                  {faq.q}
                </Link>
              )),
            )}
          </div>
        </section>
      </div>
    </>
  );
}
