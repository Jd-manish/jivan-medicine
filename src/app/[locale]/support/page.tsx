import type { Metadata } from "next";
import Link from "next/link";
import { GlobeArt, MoleculeArt, ShieldArt, WalletArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { paymentConfig, getPaymentMethods } from "@/lib/payment-config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Support Jivan — help keep medicine pricing free",
    description: "Jivan is a free, non-commercial medicine price transparency platform. Voluntary contributions cover server and research costs so the service stays free for every patient.",
    alternates: localizedAlternates(locale, "support"),
    robots: localizedRobots(locale),
  };
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const s = paymentConfig;

  const payments = getPaymentMethods();

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
            {s.headline}
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">{s.message}</p>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        <section className="grid gap-5 md:grid-cols-3">
          {costs.map((item) => (
            <article key={item.t.en} className="panel panel-hover rounded-3xl p-6">
              {item.icon}
              <h2 className="mt-4 text-base font-bold text-ink-900">{ui(locale as any, item.t)}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{ui(locale as any, item.d)}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink-900">{ui(locale as any, P.supDetailsTitle)}</h2>

            {payments.length === 0 && !s.qrCodeUrl ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-5">
                <p className="text-sm leading-6 text-amber-800">
                  Payment details are not configured yet. Contact the admin for contribution details.
                </p>
                <Link href={`/${locale}/contact`} className="btn-primary mt-4">
                  Contact us
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

            {s.note ? (
              <p className="mt-6 rounded-2xl border border-ink-100 p-4 text-xs leading-6 text-ink-400">{s.note}</p>
            ) : null}
          </div>

          <aside className="space-y-5">
            {s.qrCodeUrl ? (
              <div className="panel rounded-3xl p-6 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">QR Code</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.qrCodeUrl}
                  alt="Payment QR code"
                  className="mx-auto mt-4 h-48 w-48 rounded-2xl border border-ink-100 object-contain"
                />
              </div>
            ) : null}

            <div className="panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-400">Other ways to help</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-ink-600">
                <li>Share Jivan with someone who needs it</li>
                <li>Report a pricing error</li>
                <li>Suggest a medicine to add</li>
              </ul>
              <Link href={`/${locale}/contact`} className="mt-4 block rounded-xl border border-ink-200 px-4 py-2.5 text-center text-sm font-semibold text-ink-600 hover:border-ink-400">
                Get in touch
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
