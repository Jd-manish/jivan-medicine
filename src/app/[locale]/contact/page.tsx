import type { Metadata } from "next";
import Link from "next/link";
import { MoleculeArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact — Jivan",
  description:
    "Contact the Jivan team about medicine prices, corrections, or partnerships. We respond within 2 working days.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-6 top-6 w-40 opacity-20" />

        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Contact</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Get in touch
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Questions, corrections, partnerships — we read every message and respond within 2 working days.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Email us</h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-600">
              The fastest way to reach us is by email. We read every message personally.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "General enquiries", email: "support@jivan.health", desc: "Questions about the platform, how to use it, or general feedback." },
                { label: "Catalog corrections", email: "catalog@jivan.health", desc: "Report an incorrect price, wrong clinical data, or suggest a medicine to add." },
                { label: "Partnerships", email: "partnerships@jivan.health", desc: "NGOs, healthcare providers, or researchers interested in collaboration." },
                { label: "Press & media", email: "press@jivan.health", desc: "Journalists and media enquiries about medicine pricing transparency." },
              ].map((item) => (
                <div key={item.email} className="rounded-2xl border border-ink-100 p-4">
                  <p className="text-sm font-bold text-ink-900">{item.label}</p>
                  <p className="mt-1 text-sm text-ink-600">{item.desc}</p>
                  <a
                    href={`mailto:${item.email}`}
                    className="mt-2 inline-block rounded-lg bg-mint-500/10 px-3 py-1.5 text-sm font-semibold text-mint-600 hover:bg-mint-500/20"
                  >
                    {item.email}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Response times</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />General: within 2 working days</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />Price corrections: within 1 working day</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />Privacy and legal: within 1 working day</li>
            </ul>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Quick links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href={`/${locale}/corrections`} className="text-mint-600 hover:underline">Report a correction</Link></li>
              <li><Link href={`/${locale}/editorial-policy`} className="text-mint-600 hover:underline">Editorial policy</Link></li>
              <li><Link href={`/${locale}/support`} className="text-mint-600 hover:underline">Support Jivan</Link></li>
            </ul>
          </div>

          <div className="rounded-3xl border-l-4 border-l-amber-500 bg-amber-50 p-6">
            <h2 className="text-sm font-bold text-amber-900">Medical emergencies</h2>
            <p className="mt-2 text-sm leading-7 text-amber-800">
              Jivan cannot provide emergency or diagnostic care. For urgent symptoms contact your local emergency services immediately.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
