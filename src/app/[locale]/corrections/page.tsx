import type { Metadata } from "next";
import Link from "next/link";
import { CapsuleArt, ShieldArt } from "@/components/medical-art";
import { isValidLocale, t } from "@/lib/i18n";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";



export const metadata: Metadata = {
  title: "Corrections & Retractions — Jivan",
  description:
    "How Jivan handles errors, corrections, and price updates. We correct mistakes transparently and quickly.",
};

export default async function CorrectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <ShieldArt className="anim-drift absolute -right-4 top-10 w-36 opacity-20" />

        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Transparency</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Corrections &amp; Retractions
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Accuracy matters, especially when lives depend on the information.
            Here is how we handle errors and corrections on Jivan.
          </p>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">Our corrections policy</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-ink-600">
                <p>
                  Jivan is a medicine price transparency platform. We take accuracy seriously because incorrect pricing
                  or clinical information can affect real healthcare decisions.
                </p>
                <p>
                  When we identify an error or receive a credible correction request, we follow a clear process:
                </p>
                <ol className="ml-4 list-decimal space-y-2">
                  <li>
                    <strong>Review within 24 hours.</strong> Every correction request is reviewed by a team member
                    against primary sources (manufacturer data, government price databases, verified pharmacy
                    quotations).
                  </li>
                  <li>
                    <strong>Transparent label.</strong> If a price or clinical entry is corrected, the entry is
                    updated with a &ldquo;Corrected&rdquo; label and a note explaining what changed and when.
                  </li>
                  <li>
                    <strong>No silent edits.</strong> We do not silently alter published data. All corrections are
                    logged and visible in the entry&rsquo;s price notes field.
                  </li>
                  <li>
                    <strong>Retraction if needed.</strong> If an entire entry is found to be based on unreliable
                    data, we retract it rather than leaving a misleading listing live.
                  </li>
                </ol>
              </div>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">Price status labels</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-600">
                Every medicine entry carries a price status label so you know the confidence level:
              </p>
              <div className="mt-5 space-y-3">
                {[
                  {
                    label: "Market checked",
                    desc: "Price sourced from a verified market quotation, government database, or direct pharmacy survey. Highest confidence.",
                    color: "bg-mint-500/10 text-mint-600",
                  },
                  {
                    label: "Derived from referenced",
                    desc: "Price calculated from a market-checked anchor for the same molecule in a different pack size or strength.",
                    color: "bg-royal-500/10 text-royal-600",
                  },
                  {
                    label: "Sourced from public database",
                    desc: "Price retrieved from a public medical or pharmaceutical database. Medium confidence.",
                    color: "bg-royal-500/10 text-royal-600",
                  },
                  {
                    label: "Estimated",
                    desc: "Based on typical market patterns. Lower confidence — use as a rough guide, not a commitment.",
                    color: "bg-amber-500/10 text-amber-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-ink-100 p-4"
                  >
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 ${item.color} ring-current/20`}>
                      {item.label}
                    </span>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900">How to report an error</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-ink-600">
                <p>
                  If you spot an incorrect price, wrong clinical information, or any other error on Jivan,
                  please report it. We want to know.
                </p>
                <p>
                  <strong>Fastest way:</strong> Use the feedback form on any medicine page. Click the &ldquo;Report
                  an error&rdquo; link and describe the issue. Include a source URL if possible.
                </p>
                <p>
                  <strong>Email:</strong> Send details to{" "}
                  <a href="mailto:corrections@jivan.health" className="text-mint-600 underline">
                    corrections@jivan.health
                  </a>
                  . We respond to every report within 48 hours.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                Related policies
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href={`/${locale}/editorial-policy`} className="text-mint-600 hover:underline">
                    Editorial Policy
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/methodology`} className="text-mint-600 hover:underline">
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/medical-disclaimer`} className="text-mint-600 hover:underline">
                    Medical Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/privacy`} className="text-mint-600 hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                Quick links
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href={`/${locale}/contact`} className="text-mint-600 hover:underline">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/support`} className="text-mint-600 hover:underline">
                    Support Jivan
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/search`} className="text-mint-600 hover:underline">
                    Search medicines
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
