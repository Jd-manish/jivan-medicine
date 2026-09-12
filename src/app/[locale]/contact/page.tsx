import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoleculeArt } from "@/components/medical-art";
import { QuestionForm } from "@/components/question-form";
import { isValidLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact and Ask a Question",
  description:
    "Ask the Jivan team a private question about a medicine, a price you have been quoted, or the platform. Questions are private and never published.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-6 top-6 w-40 opacity-20" />

        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Contact</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Ask us anything about medicine costs
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            Questions you send here are private. Only the administrator can read them, and they are never displayed on
            the website.
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <QuestionForm locale={locale} />

        <aside className="space-y-5">
          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Response times</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />Questions: within 2 working days</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />Price corrections: within 1 working day</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />Privacy and legal: within 1 working day</li>
            </ul>
            <p className="mt-4 border-t border-ink-100 pt-4 text-xs leading-6 text-ink-400">
              We are a small volunteer-backed team. Weekdays (Mon–Fri, IST) are covered first; complex pricing checks
              can take longer because we verify against the actual market before answering.
            </p>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Direct email</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-700">
              <li>General: support@jivan.health</li>
              <li>Catalog corrections: catalog@jivan.health</li>
              <li>Partnerships: partnerships@jivan.health</li>
            </ul>
          </div>

          <div className="panel rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Want to share publicly?</h2>
            <p className="mt-2 text-sm leading-7 text-ink-600">
              Questions stay private. If you would like to share your experience publicly instead, leave feedback — it
              appears on the site after review.
            </p>
            <Link
              href={`/${locale}#feedback`}
              className="mt-4 block rounded-xl border border-ink-200 px-4 py-2.5 text-center text-sm font-semibold text-ink-600 transition hover:border-mint-500/50 hover:text-mint-600"
            >
              Leave public feedback
            </Link>
          </div>

          <div className="rounded-3xl border-l-4 border-l-amber-500 bg-amber-50 p-6">
            <h2 className="text-sm font-bold text-amber-900">Medical emergencies</h2>
            <p className="mt-2 text-sm leading-7 text-amber-800">
              Jivan cannot provide emergency or diagnostic care. For urgent symptoms contact your local emergency
              services immediately.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
