import { CapsuleArt, GlobeArt, MoleculeArt, ShieldArt, TabletArt, WalletArt } from "@/components/medical-art";
import { U, ui } from "@/lib/ui-core";
import type { Entry } from "@/lib/ui-core";

const reasons: { icon: React.ReactNode; title: Entry; body: Entry; highlight: Entry }[] = [
  { icon: <ShieldArt className="h-10 w-10" />, title: U.why1T, body: U.why1B, highlight: U.why1H },
  { icon: <WalletArt className="h-10 w-10" />, title: U.why2T, body: U.why2B, highlight: U.why2H },
  { icon: <MoleculeArt className="h-10 w-10" />, title: U.why3T, body: U.why3B, highlight: U.why3H },
  { icon: <GlobeArt className="h-10 w-10" />, title: U.why4T, body: U.why4B, highlight: U.why4H },
  { icon: <TabletArt className="h-10 w-10" />, title: U.why5T, body: U.why5B, highlight: U.why5H },
  { icon: <CapsuleArt className="h-10 w-10" />, title: U.why6T, body: U.why6B, highlight: U.why6H },
];

export function WhyCheaper({ locale }: { locale: string }) {
  return (
    <section className="shell py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">{ui(locale, U.whyKicker)}</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          {ui(locale, U.whyCheaperTitle)}
        </h2>
        <p className="mt-4 text-base leading-7 text-ink-600">{ui(locale, U.whyCheaperBody)}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {reasons.map((reason, index) => (
          <article key={reason.title.en} className="panel panel-hover relative overflow-hidden rounded-3xl p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              {reason.icon}
              <span className="text-2xl font-black text-ink-100">{String(index + 1).padStart(2, "0")}</span>
            </div>

            <h3 className="mt-4 text-lg font-bold leading-snug text-ink-900">{ui(locale, reason.title)}</h3>
            <p className="mt-2.5 text-sm leading-7 text-ink-600">{ui(locale, reason.body)}</p>

            <p className="mt-4 border-l-2 border-mint-500 pl-3 text-sm font-semibold italic text-mint-600">
              {ui(locale, reason.highlight)}
            </p>
          </article>
        ))}
      </div>

      <div className="panel mt-6 rounded-3xl border-l-4 border-l-amber-500 p-6 sm:p-7">
        <h3 className="text-base font-bold text-ink-900">{ui(locale, U.whyCheaperCautionTitle)}</h3>
        <p className="mt-2 text-sm leading-7 text-ink-600">{ui(locale, U.whyCheaperCautionBody)}</p>
      </div>
    </section>
  );
}
