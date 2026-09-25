import Link from "next/link";
import { CapsuleArt, MoleculeArt } from "@/components/medical-art";

export default function NotFound() {
  return (
    <main className="hero-aurora grid min-h-screen place-items-center overflow-hidden px-4 py-12 text-center">
      <div className="grid-lines absolute inset-0" />
      <MoleculeArt className="anim-drift absolute -right-10 top-10 w-52 opacity-20" />
      <CapsuleArt className="anim-float absolute -left-8 bottom-12 w-40 opacity-20" />

      <section className="relative max-w-xl">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-mint-400 to-mint-600 text-4xl font-black text-ink-900">
          404
        </div>

        <h1 className="mt-8 text-4xl font-black text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-ink-200">
          This page doesn&apos;t exist or may have been moved. Try searching for a medicine or go back to the homepage.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/en/search" className="btn-primary">
            Search medicines →
          </Link>
          <Link href="/en" className="btn-ghost">
            Go to homepage
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-sm font-semibold text-mint-300">Popular searches</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {["Sofosbuvir", "Imatinib", "Insulin", "Trastuzumab", "Apixaban", "Lenalidomide"].map((name) => (
              <Link
                key={name}
                href={`/en/search?q=${encodeURIComponent(name)}`}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-mint-500/20 hover:text-mint-300"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}