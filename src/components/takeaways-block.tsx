import Link from "next/link";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";

export function TakeawaysBlock({ locale, items }: { locale: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl border border-mint-500/30 bg-mint-500/5 p-6 sm:p-7" aria-label="Key takeaways">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-600">{ui(locale, P.artTakeaways)}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-[15px] leading-7 text-ink-800">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-500/15 text-[11px] font-black text-mint-600">
              {index + 1}
            </span>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/${locale}/articles`}
        className="mt-5 inline-block text-sm font-semibold text-mint-600 hover:text-mint-500"
      >
        Browse all 30 guides and case studies →
      </Link>
    </section>
  );
}
