import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { CapsuleArt, MoleculeArt } from "@/components/medical-art";
import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { getPreferredLocale } from "@/lib/i18n";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = await headers();
  const locale = getPreferredLocale(headersList.get("accept-language"));

  return (
    <main className="hero-aurora grid min-h-screen place-items-center overflow-hidden px-4 py-12 text-center">
      <div className="grid-lines absolute inset-0" />
      <MoleculeArt className="anim-drift absolute -right-10 top-10 w-52 opacity-20" />
      <CapsuleArt className="anim-float absolute -left-8 bottom-12 w-40 opacity-20" />

      <section className="relative max-w-xl">
        <Link href={`/${locale}`} className="inline-flex rounded-xl">
          <BrandLogo inverse tagline="Medicine access for everyone" />
        </Link>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-mint-300">{ui(locale, P.notFoundCode)}</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">{ui(locale, P.notFoundTitle)}</h1>
        <p className="mt-4 text-base leading-7 text-ink-200">{ui(locale, P.notFoundBody)}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}/search`} className="btn-primary">{ui(locale, P.notFoundSearch)}</Link>
          <Link href={`/${locale}`} className="btn-ghost">{ui(locale, P.notFoundHome)}</Link>
        </div>
      </section>
    </main>
  );
}
