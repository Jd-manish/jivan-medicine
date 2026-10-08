import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { authorRoles, getAuthorBySlug } from "@/lib/authors";
import { isValidLocale, primaryLocales } from "@/lib/i18n";
import { localizedAlternates, localizedRobots, SITE_URL } from "@/lib/seo";

type PageParams = { locale: string; role: string };

export function generateStaticParams() {
  return primaryLocales.flatMap((locale) => authorRoles.map((role) => ({ locale, role: role.slug })));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, role } = await params;
  if (!isValidLocale(locale)) return {};

  const editorialRole = getAuthorBySlug(role);
  if (!editorialRole) return {};

  return {
    title: `${editorialRole.title} — Jivan Editorial Team`,
    description: editorialRole.expertise,
    alternates: localizedAlternates(locale, `authors/${editorialRole.slug}`),
    robots: localizedRobots(locale),
  };
}

export default async function AuthorPage({ params }: { params: Promise<PageParams> }) {
  const { locale, role } = await params;
  const editorialRole = getAuthorBySlug(role)!;
  const groupedArticles = articles.filter((article) => editorialRole.categories.includes(article.category));
  const articleList = groupedArticles.slice(0, 20);

  const roleSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jivan Editorial Team",
    department: editorialRole.title,
    description: `${editorialRole.expertise} This topic-based role label does not identify a named individual or certify independent clinical review.`,
    url: `${SITE_URL}/${locale}/authors/${editorialRole.slug}/`,
    parentOrganization: { "@type": "Organization", name: "Jivan", url: `${SITE_URL}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roleSchema) }} />

      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href={`/${locale}/`} className="hover:text-mint-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href={`/${locale}/editorial-policy/`} className="hover:text-mint-600">Editorial policy</Link>
          </nav>

          <div className="mt-6 flex items-start gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-mint-300 to-mint-500 text-2xl font-black text-[#04150f]" aria-hidden="true">
              {editorialRole.title.split(" ").map((word) => word[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-600">Editorial topic label</p>
              <h1 className="mt-1.5 text-3xl font-black text-ink-900 sm:text-4xl">{editorialRole.title}</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-600">{editorialRole.expertise}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-400">
            These role-based labels group articles by topic; they do not identify named individual authors, claim a clinician wrote an article, or certify independent medical review. Check each article’s linked sources, scope notes, and update information.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Topics in this collection</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {editorialRole.categories.map((category) => (
                <span key={category} className="rounded-lg bg-mint-500/10 px-3 py-1.5 text-xs font-bold text-mint-700">
                  {category}
                </span>
              ))}
            </div>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">
              Articles in this topic group ({groupedArticles.length})
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {articleList.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${locale}/articles/${article.slug}/`}
                  className="group rounded-2xl border border-ink-100 p-4 transition hover:border-mint-500/40 hover:bg-mint-500/5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-mint-600">{article.category}</span>
                  <h3 className="mt-1.5 text-sm font-bold leading-snug text-ink-900 group-hover:text-mint-600">
                    {article.h1}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel sticky top-32 rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">This label covers</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {editorialRole.categories.map((category) => (
                <span key={category} className="rounded-lg bg-mint-500/10 px-3 py-1.5 text-xs font-bold text-mint-600">
                  {category} articles
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-ink-100 pt-4 text-xs leading-6 text-ink-400">
              For sourcing, corrections, and the limits of our content, see the{" "}
              <Link href={`/${locale}/editorial-policy/`} className="font-semibold text-mint-600">editorial policy</Link>.
            </p>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold text-ink-900">Other editorial topic labels</h2>
            <ul className="mt-3 space-y-2.5">
              {authorRoles
                .filter((candidate) => candidate.slug !== editorialRole.slug)
                .map((candidate) => (
                  <li key={candidate.slug}>
                    <Link
                      href={`/${locale}/authors/${candidate.slug}/`}
                      className="text-sm font-semibold text-ink-700 hover:text-mint-600"
                    >
                      {candidate.title} →
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
