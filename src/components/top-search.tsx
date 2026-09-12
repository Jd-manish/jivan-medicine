"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { savingsLabel } from "@/components/price-block";

type Suggestion = {
  slug: string;
  name: string;
  genericSalt: string;
  category: string;
  therapyArea: string;
  indiaPrice: number;
  usEuPrice: number;
};

export function TopSearch({
  locale,
  placeholder,
  size = "compact",
}: {
  locale: string;
  placeholder: string;
  size?: "compact" | "hero";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setItems([]);
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/medicines/suggest?q=${encodeURIComponent(query)}`, { cache: "no-store" });
        const json = (await res.json()) as { items: Suggestion[] };
        setItems(json.items ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(handle);
  }, [query]);

  const goToSearch = (value: string) => {
    if (!value.trim()) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(value.trim())}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && items[active]) {
        setOpen(false);
        router.push(`/${locale}/medicine/${items[active].slug}`);
      } else {
        goToSearch(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = size === "hero";

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 ${isHero ? "h-5 w-5" : "h-4 w-4"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.2-4.2" />
        </svg>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onFocus={() => items.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search medicines"
          className={`w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-24 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 ${
            isHero ? "py-4 text-base" : "py-2.5 text-sm"
          }`}
        />

        <button
          onClick={() => goToSearch(query)}
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-ink-900 font-semibold text-white transition hover:bg-ink-800 ${
            isHero ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          Search
        </button>
      </div>

      {open && (items.length > 0 || loading) ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl">
          {loading && items.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-400">Searching…</p>
          ) : (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {items.map((item, index) => {
                  const badge = savingsLabel(item.usEuPrice, item.indiaPrice);
                  return (
                    <li key={item.slug}>
                      <button
                        onMouseEnter={() => setActive(index)}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/${locale}/medicine/${item.slug}`);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                          active === index ? "bg-mint-500/8" : "hover:bg-ink-50"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink-900">{item.name}</span>
                          <span className="block truncate text-xs text-ink-400">
                            {item.genericSalt} · {item.therapyArea}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-lg bg-mint-500/10 px-2 py-1 text-[11px] font-bold text-mint-600">
                          {badge}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => goToSearch(query)}
                className="w-full border-t border-ink-100 bg-ink-50 px-4 py-3 text-left text-xs font-semibold text-ink-600 hover:bg-ink-100"
              >
                See all results for “{query}” — including live medical database lookup →
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
