"use client";

import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Keep the global fallback deterministic for static export and hydration.
  // It never redirects or varies by browser language or crawler identity.
  const locale = "en";
  const home = `/${locale}/`;

  return (
    <html lang={locale}>
      <body>
        <main className="grid min-h-screen place-items-center bg-[#0b1020] px-4 py-12 text-center text-white">
          <section className="max-w-lg">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#6ee7c7] to-[#12b98c] text-2xl font-black text-[#08131b]">
              J
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#6ee7c7]">{ui(locale, P.errorKicker)}</p>
            <h1 className="mt-3 text-3xl font-black">{ui(locale, P.errorTitle)}</h1>
            <p className="mt-4 text-sm leading-7 text-[#cbd6e8]">{ui(locale, P.errorBody)}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="rounded-xl bg-[#34d3aa] px-5 py-3 text-sm font-bold text-[#08131b]"
              >
                {ui(locale, P.errorRetry)}
              </button>
              <a href={home} className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white">
                {ui(locale, P.notFoundHome)}
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
