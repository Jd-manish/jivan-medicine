import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { authorRoles, getAuthorBySlug } from "@/lib/authors";
import { isValidLocale, t } from "@/lib/i18n";


type PageParams = { locale: string; role: string };

const PRIMARY = ["en", "de", "fr", "es", "it"] as const;

export function generateStaticParams() {
  return PRIMARY.flatMap((locale) => authorRoles.map((role) => ({ locale, role: role.slug })));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, role } = await params;
  if (!isValidLocale(locale)) return {};

  const author = getAuthorBySlug(role);
  if (!author) return {};

  return {
    title: `${author.title} — Jivan Editorial Team`,
    description: author.expertise,
    alternates: {
      canonical: `/${locale}/authors/${author.slug}`,
      languages: Object.fromEntries(PRIMARY.map((alt) => [alt, `/${alt}/authors/${author.slug}`])),
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<PageParams> }) {
  const { locale, role } = await params;
  

  const author = getAuthorBySlug(role)!;
  

  const copy = t(locale as any);
  const authored = articles.filter((article) => author.categories.includes(article.category));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.title,
    jobTitle: author.title,
    description: author.expertise,
    worksFor: { "@type": "Organization", name: "Jivan", url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health"}` },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health"}/${locale}/authors/${author.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href={`/${locale}`} className="hover:text-mint-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href={`/${locale}/editorial-policy`} className="hover:text-mint-600">Editorial team</Link>
          </nav>

          <div className="mt-6 flex items-start gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-mint-400 to-mint-600 text-2xl font-black text-white">
              {author.title.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-600">Editorial team member</p>
              <h1 className="mt-1.5 text-3xl font-black text-ink-900 sm:text-4xl">{author.title}</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-600">{author.expertise}</p>
          <p className="mt-3 text-sm text-ink-400">
            Role-based attribution: Jivan publishes organizational-role bylines rather than invented personal profiles.
            See our <Link href={`/${locale}/editorial-policy`} className="font-semibold text-mint-600 hover:text-mint-500">editorial policy</Link> for how this works.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Scope of responsibility</h2>
            <ul className="mt-4 space-y-3">
              {author.scope.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-ink-600">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Review duties before publication</h2>
            <ol className="mt-4 space-y-3">
              {author.reviewDuties.map((duty, index) => (
                <li key={duty} className="flex gap-3 text-sm leading-7 text-ink-600">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-900 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  {duty}
                </li>
              ))}
            </ol>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">
              Articles reviewed or written by this role ({authored.length})
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {authored.slice(0, 10).map((article) => (
                <Link
                  key={article.slug}
                  href={`/${locale}/articles/${article.slug}`}
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
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">This role covers</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {author.categories.map((category) => (
                <span key={category} className="rounded-lg bg-mint-500/10 px-3 py-1.5 text-xs font-bold text-mint-600">
                  {category} articles
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-ink-100 pt-4 text-xs leading-6 text-ink-400">
              This page is part of our published editorial structure. Content is reviewed through the workflow defined in the{" "}
              <Link href={`/${locale}/editorial-policy`} className="font-semibold text-mint-600">editorial policy</Link>.
            </p>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold text-ink-900">Other editorial roles</h2>
            <ul className="mt-3 space-y-2.5">
              {authorRoles
                .filter((role) => role.slug !== author.slug)
                .map((role) => (
                  <li key={role.slug}>
                    <Link
                      href={`/${locale}/authors/${role.slug}`}
                      className="text-sm font-semibold text-ink-700 hover:text-mint-600"
                    >
                      {role.title} →
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
