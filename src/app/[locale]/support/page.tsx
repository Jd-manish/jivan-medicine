import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobeArt, MoleculeArt, ShieldArt, WalletArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support Jivan — help keep medicine pricing free",
  description:
    "Jivan is a free, non-commercial medicine price transparency platform. Voluntary contributions cover servers, database and research costs so the service stays free for every patient.",
};

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const s = await getSettings();

  const payments: { label: string; value: string }[] = [
    { label: "UPI ID", value: s.support_upi },
    { label: "PayPal", value: s.support_paypal },
    { label: "Bank name", value: s.support_bank_name },
    { label: "Account holder", value: s.support_account_name },
    { label: "Account number", value: s.support_account_number },
    { label: "IFSC code", value: s.support_ifsc },
    { label: "SWIFT / BIC", value: s.support_swift },
    { label: "Crypto wallet", value: s.support_crypto },
  ].filter((item) => item.value.trim().length > 0);

  const costs = [
    { icon: <GlobeArt className="h-9 w-9" />, t: P.supCosts1T, d: P.supCosts1D },
    { icon: <ShieldArt className="h-9 w-9" />, t: P.supCosts2T, d: P.supCosts2D },
    { icon: <WalletArt className="h-9 w-9" />, t: P.supCosts3T, d: P.supCosts3D },
  ];

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-8 top-8 w-44 opacity-20" />

        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Support the project</span>
          <h1 className="anim-rise mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            {s.support_headline}
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">{s.support_message}</p>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        <section className="grid gap-5 md:grid-cols-3">
          {costs.map((item) => (
            <article key={item.t.en} className="panel panel-hover rounded-3xl p-6">
              {item.icon}
              <h2 className="mt-4 text-base font-bold text-ink-900">{ui(locale, item.t)}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{ui(locale, item.d)}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink-900">{ui(locale, P.supDetailsTitle)}</h2>

            {payments.length === 0 && !s.support_qr_url ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-5">
                <p className="text-sm leading-6 text-amber-800">
                  {ui(locale, P.supEmpty)}
                </p>
                <Link href={`/${locale}/contact`} className="btn-primary mt-4">
                  {ui(locale, P.supContact)}
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {payments.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{item.label}</span>
                    <span className="font-mono text-sm font-semibold break-all text-ink-900">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {s.support_note ? (
              <p className="mt-6 rounded-2xl border border-ink-100 p-4 text-xs leading-6 text-ink-400">{s.support_note}</p>
            ) : null}
          </div>

          <aside className="space-y-5">
            {s.support_qr_url ? (
              <div className="panel rounded-3xl p-6 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">{ui(locale, P.supQrTitle)}</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.support_qr_url}
                  alt={ui(locale, P.supQrAlt)}
                  className="mx-auto mt-4 h-48 w-48 rounded-2xl border border-ink-100 object-contain"
                />
              </div>
            ) : null}

            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">{ui(locale, P.supOtherTitle)}</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-ink-600">
                <li>{ui(locale, P.supOther1)}</li>
                <li>{ui(locale, P.supOther2)}</li>
                <li>{ui(locale, P.supOther3)}</li>
              </ul>
              <Link href={`/${locale}/contact`} className="mt-4 block rounded-xl border border-ink-200 px-4 py-2.5 text-center text-sm font-semibold text-ink-600 hover:border-ink-400">
                {ui(locale, P.supFeedback)}
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
