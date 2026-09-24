"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatUsd } from "@/components/price-block";

/**
 * Animated flip card that reveals the Indian price on hover/tap.
 * Creates a dramatic "reveal" moment that makes people want to share.
 *
 * On desktop: flips on hover
 * On mobile: flips on tap
 */
export function PriceShockCard({
  name,
  genericSalt,
  usEuPrice,
  indiaPrice,
  locale,
  slug,
  packSize,
  company,
}: {
  name: string;
  genericSalt: string;
  usEuPrice: number;
  indiaPrice: number;
  locale: string;
  slug: string;
  packSize?: string;
  company?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const multiple = Math.round(usEuPrice / Math.max(indiaPrice, 1));
  const savings = Math.min(99.9, Math.floor((1 - indiaPrice / usEuPrice) * 1000) / 10);

  return (
    <Link
      href={`/${locale}/medicine/${slug}`}
      className="group block perspective-[1000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={(e) => {
        if (!flipped) {
          e.preventDefault();
          setFlipped(true);
        }
      }}
    >
      <div
        className="relative h-52 transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front — US price */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                {genericSalt}
              </p>
              <h3 className="mt-2 text-lg font-bold text-white group-hover:text-mint-300">
                {name}
              </h3>
              {company && (
                <p className="mt-1 text-xs text-ink-400">{company}</p>
              )}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-400">
                US / EU price
              </p>
              <p className="mt-1 text-3xl font-black text-white/70">
                {formatUsd(usEuPrice, locale)}
              </p>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <span className="rounded-xl bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300">
              Hover to reveal ↓
            </span>
          </div>
        </div>

        {/* Back — India price */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl border border-mint-500/30 bg-mint-500/10 p-6 backdrop-blur-sm">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-mint-300">
                {genericSalt} — India price
              </p>
              <h3 className="mt-2 text-lg font-bold text-mint-300">{name}</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-400">
                  India market price
                </p>
                <p className="mt-1 text-3xl font-black text-mint-300">
                  {formatUsd(indiaPrice, locale)}
                </p>
                {packSize && (
                  <p className="text-xs text-ink-400">per {packSize}</p>
                )}
              </div>
              <div className="text-right">
                <span className="rounded-xl bg-mint-500 px-3 py-1.5 text-lg font-black text-ink-900">
                  {multiple}×
                </span>
                <p className="mt-1 text-xs font-semibold text-mint-300">
                  {savings % 1 === 0 ? savings.toFixed(0) : savings.toFixed(1)}% less
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Horizontal scroll of Price Shock cards with entrance animation.
 * Shows the top savings in a dramatic, interactive format.
 */
export function PriceShockCarousel({
  items,
  locale,
}: {
  items: Array<{
    id: number;
    name: string;
    genericSalt: string;
    usEuPrice: number;
    indiaPrice: number;
    slug: string;
    packSize: string;
    company: string;
  }>;
  locale: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="min-w-[280px] max-w-[320px] shrink-0 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <PriceShockCard
              name={item.name}
              genericSalt={item.genericSalt}
              usEuPrice={item.usEuPrice}
              indiaPrice={item.indiaPrice}
              locale={locale}
              slug={item.slug}
              packSize={item.packSize}
              company={item.company}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact stat strip showing top savings in a marquee-like format.
 * Perfect for homepage hero or above-the-fold placement.
 */
export function SavingsTicker({
  items,
  locale,
}: {
  items: Array<{
    name: string;
    savings: number;
    multiple: number;
  }>;
  locale: string;
}) {
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track">
        {[...Array(2)].map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((item, i) => (
              <span
                key={`${dup}-${i}`}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <span className="rounded-lg bg-mint-500/20 px-2 py-0.5 text-xs font-black text-mint-300">
                  {item.multiple}×
                </span>
                <span className="text-sm font-semibold text-white/60">
                  {item.name}
                </span>
                <span className="text-xs text-ink-400">
                  ({item.savings}% off)
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}