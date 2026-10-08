import Link from "next/link";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";

export function ArticleReviewBox({
  locale,
  author,
  authorSlug,
  note,
  updated,
  sourceCount,
}: {
  locale: string;
  author: string;
  authorSlug: string;
  note: string;
  updated: Date;
  sourceCount: number;
}) {
  return (
    <section className="panel mt-8 rounded-3xl p-6 sm:p-7" aria-label="Article attribution and sources">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">{ui(locale, P.artMadeTitle)}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint-500/10 text-base font-black text-mint-600" aria-hidden="true">
            ✎
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">{ui(locale, P.artMadeWritten)}</p>
            <Link
              href={`/${locale}/authors/${authorSlug}`}
              className="mt-0.5 block text-sm font-semibold text-ink-700 underline decoration-mint-500/40 underline-offset-4 hover:text-mint-600"
            >
              {author}
            </Link>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-royal-500/10 text-base font-black text-royal-600" aria-hidden="true">
            ↗
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">Source transparency</p>
            <Link href="#references" className="mt-0.5 block text-sm font-semibold text-ink-700 underline decoration-mint-500/40 underline-offset-4 hover:text-mint-600">
              {sourceCount} linked references — inspect each source and its scope
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-ink-50 px-4 py-3 text-xs leading-6 text-ink-500">{note}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-ink-100 pt-4 text-xs text-ink-400">
        <span>Updated {updated.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</span>
        <span aria-hidden>·</span>
        <Link href={`/${locale}/editorial-policy`} className="font-semibold text-mint-600 hover:text-mint-500">
          Editorial policy →
        </Link>
        <Link href={`/${locale}/methodology`} className="font-semibold text-mint-600 hover:text-mint-500">
          Price methodology →
        </Link>
      </div>
    </section>
  );
}
