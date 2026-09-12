import Link from "next/link";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { MoleculeArt } from "@/components/medical-art";
import type { CatalogInsight } from "@/lib/medicines";

/**
 * "What the Jivan dataset shows" — original information-gain block.
 * Renders computed statistics from our referenced-price dataset beside an
 * editorial observation written for this specific article. This content
 * cannot be found in summarised public sources because it derives from
 * our own aggregation.
 */
export function ArticleDataInsight({
  locale,
  insight,
  text,
  searchQuery,
}: {
  locale: string;
  insight: CatalogInsight;
  text: string;
  searchQuery: string;
}) {
  const searchHref = searchQuery
    ? `/${locale}/search?q=${encodeURIComponent(searchQuery)}`
    : `/${locale}/search`;

  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl bg-ink-900 p-6 text-white sm:p-8" aria-label="What the Jivan dataset shows">
      <MoleculeArt className="anim-drift pointer-events-none absolute -right-6 -top-6 w-32 opacity-15" />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-300">{ui(locale, P.artDatasetTitle)}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
          <div>
            <dt className="text-2xl font-black text-mint-300 sm:text-3xl">{insight.avgMultiple}×</dt>
            <dd className="mt-1 text-[11px] leading-4 text-ink-300">{ui(locale, P.artDatasetAvg)}{insight.scope !== "the full catalog" ? ` ${insight.scope}` : ""}</dd>
          </div>
          <div>
            <dt className="text-2xl font-black text-white sm:text-3xl">{insight.over10xPct}%</dt>
            <dd className="mt-1 text-[11px] leading-4 text-ink-300">{ui(locale, P.artDatasetOver)}</dd>
          </div>
          <div>
            <dt className="text-2xl font-black text-white sm:text-3xl">{insight.maxMultiple}×</dt>
            <dd className="mt-1 text-[11px] leading-4 text-ink-300">{ui(locale, P.artDatasetWidest)}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm leading-7 text-ink-200">{text}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={searchHref}
            className="rounded-xl bg-mint-500 px-4 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-mint-400"
          >
            Explore this data in the catalog →
          </Link>
          <p className="text-xs text-ink-400">{ui(locale, P.artDatasetLive)} {insight.total} anchors</p>
        </div>
      </div>
    </section>
  );
}
