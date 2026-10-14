import type { Metadata } from "next";
import Link from "next/link";
import { formatUsd, savingsLabel } from "@/components/price-block";
import { isValidLocale } from "@/lib/i18n";
import { ensureMedicineSeeded, getVerifiedMedicines, type Medicine } from "@/lib/medicines";
import { localizedAlternates, localizedRobots, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  await ensureMedicineSeeded();
  const count = (await getVerifiedMedicines()).length;

  return {
    title: `All ${count} medicines A–Z — India vs US/EU price comparison`,
    description: `Browse every researched medicine on Jivan by therapy area: ${count} same-salt Indian alternatives with referenced US/EU and Indian market prices, strength, form and manufacturer.`,
    alternates: localizedAlternates(locale, "medicines"),
    robots: localizedRobots(locale),
    openGraph: {
      title: `All ${count} medicines A–Z | Jivan`,
      description: "Every researched medicine on Jivan, grouped by therapy area with referenced India vs US/EU prices.",
      type: "website",
      url: `/${locale}/medicines/`,
      siteName: "Jivan",
    },
  };
}

function groupByTherapyArea(rows: Medicine[]) {
  const groups = new Map<string, Medicine[]>();
  for (const row of rows) {
    const list = groups.get(row.therapyArea) ?? [];
    list.push(row);
    groups.set(row.therapyArea, list);
  }
  for (const list of groups.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

function anchorId(area: string) {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default async function MedicinesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await ensureMedicineSeeded();
  const verified = await getVerifiedMedicines();
  const groups = groupByTherapyArea(verified);
  const salts = new Set(verified.map((m) => m.genericSalt)).size;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All medicines A–Z",
    url: `${SITE_URL}/${locale}/medicines/`,
    description: `${verified.length} researched medicines with referenced India vs US/EU prices.`,
    isPartOf: { "@type": "WebSite", name: "Jivan", url: `${SITE_URL}/${locale}/` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: verified.length,
      itemListElement: verified.slice(0, 50).map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: m.name,
        url: `${SITE_URL}/${locale}/medicine/${m.slug}/`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${locale}/` },
      { "@type": "ListItem", position: 2, name: "All medicines" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <div className="shell relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href={`/${locale}`} className="hover:text-mint-300">Home</Link>
            <span>/</span>
            <span className="text-ink-200">All medicines</span>
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-mint-300">Medicine directory</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
            All {verified.length} researched medicines, A–Z by therapy area
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-200 sm:text-base">
            Every entry below is a hand-researched comparison of the same active salt: {salts} molecules across{" "}
            {groups.length} therapy areas, each with a referenced US/EU price and the typical Indian market price.
            Derived pack and strength variants are searchable but are not listed here.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href={`/${locale}/search`} className="btn-primary">Search the full catalog</Link>
            <Link href={`/${locale}/methodology`} className="rounded-xl border border-white/20 px-4 py-2.5 font-semibold text-white transition hover:border-mint-200 hover:text-mint-200">
              How prices are verified
            </Link>
          </div>
        </div>
      </section>

      <div className="shell py-10 sm:py-14">
        <nav aria-label="Therapy areas" className="panel rounded-3xl p-5 sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Jump to a therapy area</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {groups.map(([area, rows]) => (
              <li key={area}>
                <a href={`#${anchorId(area)}`} className="inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-mint-500/10 hover:text-mint-600">
                  {area}
                  <span className="text-ink-400">{rows.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-12">
          {groups.map(([area, rows]) => (
            <section key={area} id={anchorId(area)} className="scroll-mt-28">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-black tracking-tight text-ink-900">{area}</h2>
                <p className="text-sm text-ink-400">{rows.length} medicines</p>
              </div>
              <ul className="dir-grid">
                {rows.map((m) => (
                  <li key={m.id}>
                    <Link href={`/${locale}/medicine/${m.slug}`} className="dir-item">
                      <span className="dir-name">{m.name}</span>
                      <span className="dir-meta">{m.genericSalt} · {m.form} · {m.company}</span>
                      <span className="dir-price">
                        <s>{formatUsd(m.usEuPrice, locale)}</s>
                        <b>{formatUsd(m.indiaPrice, locale)}</b>
                        {" "}in India · {savingsLabel(m.usEuPrice, m.indiaPrice)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-800">
          Prices are catalogue references converted to US dollars, not live pharmacy offers. Jivan does not sell medicines.
          Always confirm the product, pack and a current quotation, and discuss any change with your prescribing physician.{" "}
          <Link href={`/${locale}/medical-disclaimer`} className="font-semibold underline underline-offset-2">Medical disclaimer</Link>
        </p>
      </div>
    </>
  );
}
