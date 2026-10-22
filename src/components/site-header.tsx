"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { TopSearch } from "@/components/top-search";
import { localeLinkRel } from "@/lib/seo";

type NavItem = { href: string; label: string };

export function SiteHeader({
  locale,
  brand,
  items,
  locales,
  ctaLabel,
}: {
  locale: string;
  brand: string;
  items: NavItem[];
  locales: readonly string[];
  ctaLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-3">
        <Link
          href={`/${locale}`}
          aria-label={`${brand} home`}
          className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-mint-500/20"
          onClick={() => setOpen(false)}
        >
          <BrandLogo idPrefix="header-logo" name={brand} tagline="Medicine access for everyone" />
        </Link>

        <div className="hidden max-w-md flex-1 lg:block">
          <TopSearch locale={locale} placeholder="Search medicine, symptom, disease, or operation…" />
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />

          <select
            aria-label="Language"
            defaultValue={locale}
            onChange={(e) => {
              router.push(`/${e.target.value}`);
            }}
            className="hidden rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs font-semibold uppercase text-ink-600 outline-none sm:block"
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>

          <Link
            href={`/${locale}/contact/`}
            className="hidden rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 sm:inline-flex"
          >
            {ctaLabel}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 lg:hidden"
          >
            <span className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-ink-800 transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-ink-800 transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-ink-800 transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div className="shell pb-3 lg:hidden">
        <TopSearch locale={locale} placeholder="Search medicine, symptom, or operation…" />
      </div>

      <div className="hidden border-t border-ink-100/70 lg:block">
        <div className="shell flex h-11 items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="grid overflow-hidden border-t border-ink-100 bg-white transition-all duration-300 lg:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="shell space-y-1 py-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {locales.slice(0, 5).map((code) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  hrefLang={code}
                  rel={localeLinkRel(code)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-ink-50 px-2.5 py-1.5 text-[11px] font-semibold uppercase text-ink-600"
                >
                  {code}
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-ink-600 underline underline-offset-2"
              >
                All languages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
