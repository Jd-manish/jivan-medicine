import type { Metadata } from "next";
import Link from "next/link";
import { surgeries, surgerySavingsPercent, formatRange, getSurgerCategories } from "@/lib/surgeries";
import { isValidLocale } from "@/lib/i18n";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";

export const metadata: Metadata = {
  title: "Surgery Cost Comparison — India vs US, Europe & Australia | Jivan",
  description:
    "Compare surgery costs: cataract, knee replacement, heart valve, bypass, transplant and more. India offers the same procedures at 70-95% lower cost with internationally accredited hospitals.",
  keywords: [
    "surgery cost India",
    "knee replacement cost comparison",
    "heart surgery India vs US",
    "medical tourism India",
    "affordable surgery abroad",
    "cataract surgery cost comparison",
    "hip replacement India",
    "liver transplant cost India",
    "coronary bypass cost comparison",
  ],
};

export default async function SurgeriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;

  const categories = getSurgerCategories();

  return (
    <>
      {/* Hero */}
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <div className="shell relative py-14 sm:py-20">
          <span className="chip">Medical Procedures</span>
          <h1 className="anim-rise mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Surgery costs: India vs US, Europe & Australia
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200">
            The same surgeon training. The same equipment. The same implants.
            The difference? Up to 95% lower cost. India performs over 30 million surgeries
            annually with outcomes matching global benchmarks — here are the real numbers.
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-4">
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">42+</p>
            <p className="mt-1 text-xs font-medium text-ink-400">JCI-accredited hospitals in India</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">30M+</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Surgeries performed annually in India</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">70–95%</p>
            <p className="mt-1 text-xs font-medium text-ink-400">Typical cost savings vs US</p>
          </div>
          <div className="panel rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-mint-600">2M+</p>
            <p className="mt-1 text-xs font-medium text-ink-400">International patients treated in India per year</p>
          </div>
        </div>
      </section>

      {/* Surgery listings by category */}
      <section className="shell pb-16">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-black text-ink-900 mb-6">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {surgeries
                .filter((s) => s.category === category)
                .map((surgery) => {
                  const usAvg = (surgery.prices.us.low + surgery.prices.us.high) / 2;
                  const indiaAvg = (surgery.prices.india.low + surgery.prices.india.high) / 2;
                  const savings = surgerySavingsPercent(usAvg, indiaAvg);

                  return (
                    <Link
                      key={surgery.slug}
                      href={`/${locale}/surgeries/${surgery.slug}`}
                      className="panel panel-hover group rounded-3xl p-6 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-ink-900 group-hover:text-mint-700 transition">
                            {surgery.name}
                          </h3>
                          <p className="mt-1 text-xs text-ink-400">{surgery.category}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-mint-500/10 px-3 py-1 text-sm font-bold text-mint-600">
                          Save {savings}%
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-ink-600 line-clamp-2">
                        {surgery.description}
                      </p>

                      {/* Price comparison bar */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇺🇸 United States</span>
                          <span className="font-semibold text-ink-400 line-through">
                            {formatRange(surgery.prices.us.low, surgery.prices.us.high)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇪🇺 Europe</span>
                          <span className="font-semibold text-ink-400">
                            {formatRange(surgery.prices.eu.low, surgery.prices.eu.high)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">🇦🇺 Australia</span>
                          <span className="font-semibold text-ink-400">
                            {formatRange(surgery.prices.australia.low, surgery.prices.australia.high)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-mint-50 px-3 py-2 text-xs">
                          <span className="font-semibold text-mint-700">🇮🇳 India</span>
                          <span className="font-bold text-mint-700">
                            {formatRange(surgery.prices.india.low, surgery.prices.india.high)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                        <span>⏱ {surgery.duration}</span>
                        <span>·</span>
                        <span>🏥 {surgery.hospitalStay}</span>
                        <span>·</span>
                        <span>🔄 {surgery.recovery}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </section>

      {/* Trust section */}
      <section className="shell pb-16">
        <div className="panel rounded-3xl p-8 sm:p-12">
          <h2 className="text-2xl font-black text-ink-900">Why Indian surgical costs are lower — and quality isn&apos;t compromised</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-bold text-ink-900">Same Surgeons, Same Training</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Many Indian surgeons trained at Cleveland Clinic, Mayo Clinic, Johns Hopkins,
                and leading UK/EU centres. India&apos;s medical education system produces 80,000+
                doctors per year — the largest output globally.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">Same Equipment & Implants</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Indian hospitals use the same da Vinci robots, Zeiss microscopes, Stryker
                navigation systems, and Zimmer Biomet implants. Indian-made alternatives
                (Meril, Sahajanand) are CE-marked and increasingly exported globally.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">Government Price Regulation</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                India&apos;s NPPA (National Pharmaceutical Pricing Authority) caps prices
                on cardiac stents, knee implants, and essential medicines. This eliminates
                the markup inflation seen in US hospital billing.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">High Volume = Lower Per-Case Cost</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                AIIMS performs 200,000+ surgeries per year. Aravind Eye Hospital does 500+
                cataract surgeries per day. This volume drives fixed costs per case to
                among the lowest globally.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">JCI & NABH Accreditation</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                India has 42+ JCI-accredited hospitals and 600+ NABH-accredited facilities.
                These accreditations require the same quality standards as US Joint Commission
                accreditation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">Outcomes Match Global Benchmarks</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Published outcome data from Indian centres (infection rates, mortality,
                graft survival) consistently matches or exceeds benchmarks from US STS
                database and EU registries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="shell pb-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs leading-6 text-amber-800">
            <strong>Medical Disclaimer:</strong> All prices are approximate ranges based on publicly
            available hospital pricing (2024–2026). Actual costs vary by hospital, city,
            patient condition, and insurance coverage. Jivan is an informational platform
            and does not provide medical advice or arrange treatments. Always consult a
            qualified medical professional before making treatment decisions.
          </p>
        </div>
      </section>
    </>
  );
}