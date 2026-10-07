import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { ArticleBody } from "@/components/article-body";
import { ArticleDataInsight } from "@/components/article-data-insight";
import { ArticleReviewBox } from "@/components/article-review-box";
import { FaqAccordion } from "@/components/faq-accordion";
import { CapsuleArt, MoleculeArt } from "@/components/medical-art";
import { TakeawaysBlock } from "@/components/takeaways-block";
import { buildInsightText, getInsightSpec } from "@/lib/article-data-insights";
import { getRolesFor, getTakeawaysFor } from "@/lib/article-takeaways";
import { articles, getArticleBySlug, getRelatedArticles, resolveLegacySlug } from "@/lib/articles";
import { isValidLocale, primaryLocales, t } from "@/lib/i18n";
import { isSeoLocale, localizedAlternates, localizedRobots, SITE_URL } from "@/lib/seo";
import { getCatalogInsight } from "@/lib/medicines";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";


type PageParams = { locale: string; slug: string };
const SITE = SITE_URL;

/** Pre-render the full library for the primary locales; others render on demand. */
export function generateStaticParams() {
  return primaryLocales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE}/${locale}/articles/${slug}`;

  /**
   * Indexation mirrors the editorial-coverage reality: only the curated
   * primary locales carry complete translated editorial content. Secondary
   * locales fall back to English prose, which Google would read as
   * 24-way duplicate pages. Keep them accessible to users and linked,
   * but exclude them from the index.
   */
  const isCuratedLocale = isSeoLocale(locale);

  return {
    title: article.title,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: localizedAlternates(locale, `articles/${slug}`),
    robots: isCuratedLocale ? localizedRobots(locale) : { index: false, follow: true },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.metaDescription,
      url,
      siteName: "Jivan",
      modifiedTime: article.updatedAt,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;
  

  // Preserve link equity from the previous article library.
  const legacyTarget = resolveLegacySlug(slug);
  

  const article = getArticleBySlug(slug)!;
  

  const copy = t(locale as any);
  
  const adsEnabled = false;
  const related = getRelatedArticles(article, 3);
  const updated = new Date(article.updatedAt);
  const roles = getRolesFor(article.category);
  const takeaways = getTakeawaysFor(article.slug);

  // Original information-gain: computed from our referenced dataset.
  const insightSpec = getInsightSpec(article.slug);
  const insight = await getCatalogInsight(insightSpec.therapyArea);
  const insightText = buildInsightText(insightSpec, insight);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": article.category === "Case Study" ? "Article" : "TechArticle",
    headline: article.h1,
    name: article.title,
    description: article.metaDescription,
    inLanguage: locale,
    dateModified: article.updatedAt,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    wordCount: article.sections.reduce((sum, s) => sum + s.paragraphs.join(" ").split(/\s+/).length, 0),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/${locale}/articles/${article.slug}/` },
    author: { "@type": "Organization", name: "Jivan Editorial Team", department: roles.author.replace(", Jivan Editorial Team", ""), url: `${SITE}/${locale}/authors/${roles.authorSlug}/` },
    publisher: { "@type": "Organization", name: "Jivan", url: SITE },
    citation: article.references.map((ref) => ({
      "@type": "CreativeWork",
      name: ref.label,
      publisher: ref.publisher,
      url: ref.url,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE}/${locale}/articles` },
      { "@type": "ListItem", position: 3, name: article.h1, item: `${SITE}/${locale}/articles/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <CapsuleArt className="anim-drift absolute -right-6 bottom-4 w-36 opacity-25" />
        <MoleculeArt className="anim-float absolute left-[45%] top-2 hidden w-20 opacity-15 lg:block" />

        <div className="shell relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href={`/${locale}`} className="hover:text-mint-300">{ui(locale, P.artBreadcrumbHome)}</Link>
            <span aria-hidden>/</span>
            <Link href={`/${locale}/articles`} className="hover:text-mint-300">{ui(locale, P.artBreadcrumbArticles)}</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-200">{article.category}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="chip">{article.category}</span>
            <span className="chip">{article.readingMinutes} {ui(locale, P.artMinRead)}</span>
          </div>

          <h1 className="anim-rise mt-4 max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {article.h1}
          </h1>
          <p className="anim-rise delay-2 mt-4 max-w-2xl text-base leading-7 text-ink-200">{article.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-ink-400">
            <span>
              By{" "}
              <Link
                href={`/${locale}/authors/${roles.authorSlug}`}
                className="font-semibold text-mint-300 hover:text-mint-200"
              >
                {roles.author.replace(", Jivan Editorial Team", "")}
              </Link>
            </span>
            <span aria-hidden> </span>
            {article.publishedAt ? (
              <time dateTime={article.publishedAt}>Published {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
            ) : null}
            <time dateTime={article.updatedAt}>Updated {updated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
            <span aria-hidden> </span>
            <span>{article.references.length} cited sources</span>
          </div>

          {article.heroStat ? (
            <div className="anim-rise delay-3 mt-8 inline-flex items-baseline gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4">
              <span className="text-3xl font-black text-mint-300">{article.heroStat.value}</span>
              <span className="max-w-xs text-xs leading-5 text-ink-300">{article.heroStat.label}</span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          {/* Original editorial summary   unique value at the top */}
          <div className="mb-8">
            <TakeawaysBlock locale={locale} items={takeaways} />
          </div>

          {/* Case snapshot */}
          {article.snapshot ? (
            <div className="panel mb-8 overflow-hidden rounded-3xl">
              <div className="border-b border-ink-100 bg-ink-50 px-6 py-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{ui(locale, P.artSnapshot)}</h2>
              </div>
              <dl className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
                {[
                  [ui(locale, P.artSnapshotPatient), article.snapshot.patient],
                  [ui(locale, P.artSnapshotCountry), article.snapshot.country],
                  [ui(locale, P.artSnapshotCondition), article.snapshot.condition],
                  [ui(locale, P.artSnapshotMedicine), article.snapshot.medicine],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid gap-px border-t border-ink-100 bg-ink-100 sm:grid-cols-3">
                <div className="bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{ui(locale, P.artSnapshotWest)}</p>
                  <p className="mt-1 text-lg font-bold text-ink-400 line-through">{article.snapshot.westernCost}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-600">{ui(locale, P.artSnapshotRef)}</p>
                  <p className="mt-1 text-lg font-bold text-mint-600">{article.snapshot.indianCost}</p>
                </div>
                <div className="bg-gradient-to-br from-ink-900 to-ink-800 p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">{ui(locale, P.artSnapshotImpact)}</p>
                  <p className="mt-1 text-sm font-bold leading-snug">{article.snapshot.saving}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Mobile TOC */}
          <details className="panel mb-8 rounded-2xl p-5 lg:hidden">
            <summary className="cursor-pointer text-sm font-bold text-ink-900">{ui(locale, P.artToc)}</summary>
            <ol className="mt-3 space-y-2">
              {article.sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-sm text-ink-600 hover:text-mint-600">
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <ArticleBody sections={article.sections} />

          <ArticleDataInsight
            locale={locale}
            insight={insight}
            text={insightText}
            searchQuery={insightSpec.searchQuery}
          />

          <AdSlot
            enabled={adsEnabled}
            clientId={""}
            slotId={""}
            placement="article-mid"
            className="!px-0 py-10"
          />

          {/* FAQs */}
          {article.faqs.length > 0 ? (
            <section id="faq" className="mt-12 scroll-mt-32">
              <h2 className="text-2xl font-bold text-ink-900">{ui(locale, P.artFaq)}</h2>
              <div className="mt-5">
                <FaqAccordion items={article.faqs} />
              </div>
            </section>
          ) : null}

          {/* References */}
          <section id="references" className="mt-12 scroll-mt-32">
            <h2 className="text-2xl font-bold text-ink-900">{ui(locale, P.artSources2)}</h2>
            <p className="mt-2 text-sm text-ink-600">
              {ui(locale, P.artSourcesNote)}
            </p>
            <ol className="mt-5 space-y-3">
              {article.references.map((ref, i) => (
                <li key={ref.url} className="flex gap-3 rounded-2xl border border-ink-100 p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-100 text-[11px] font-bold text-ink-600">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-ink-900 underline decoration-mint-500/40 underline-offset-4 hover:text-mint-600"
                    >
                      {ref.label}
                    </a>
                    <span className="mt-0.5 block text-xs text-ink-400">{ref.publisher}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Human oversight signal   review and attribution block */}
          <ArticleReviewBox
            locale={locale}
            author={roles.author}
            authorSlug={roles.authorSlug}
            note={roles.note}
            updated={updated}
            sourceCount={article.references.length}
          />

          {/* Safety */}
          <section className="mt-10 rounded-3xl border-l-4 border-l-amber-500 bg-amber-50 p-6">
            <h2 className="text-sm font-bold text-amber-900">{copy.safetyNoteTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-amber-800">{copy.safetyNoteBody}</p>
          </section>

          {/* Related */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-ink-900">{ui(locale, P.artContinue)}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/articles/${item.slug}`}
                  className="panel panel-hover group flex flex-col rounded-2xl p-5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-mint-600">{item.category}</span>
                  <h3 className="mt-2 flex-1 text-sm font-bold leading-snug text-ink-900 group-hover:text-mint-600">
                    {item.h1}
                  </h3>
                  <span className="mt-3 text-xs text-ink-400">{item.readingMinutes} min read</span>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-5">
          <AdSlot
            enabled={adsEnabled}
            clientId={""}
            slotId={""}
            placement="article-side"
            format="rectangle"
            className="!px-0"
          />

          <div className="sticky top-28 space-y-5">
            <nav className="panel rounded-2xl p-5" aria-label="Table of contents">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">On this page</h2>
              <ol className="mt-3 space-y-2 border-l border-ink-100">
                {article.sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent pl-3 text-sm leading-6 text-ink-600 transition hover:border-mint-500 hover:text-mint-600"
                    >
                      {i + 1}. {section.heading}
                    </a>
                  </li>
                ))}
                {article.faqs.length > 0 ? (
                  <li>
                    <a href="#faq" className="-ml-px block border-l-2 border-transparent pl-3 text-sm leading-6 text-ink-600 hover:border-mint-500 hover:text-mint-600">
                      FAQs
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href="#references" className="-ml-px block border-l-2 border-transparent pl-3 text-sm leading-6 text-ink-600 hover:border-mint-500 hover:text-mint-600">
                    Sources
                  </a>
                </li>
              </ol>
            </nav>

            <div className="panel rounded-2xl p-5">
              <h2 className="text-sm font-bold text-ink-900">Check your own medicine</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Search the catalog to see the same-salt alternative and its reference price.
              </p>
              <Link href={`/${locale}/search`} className="btn-primary mt-4 w-full">
                Search medicines
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}