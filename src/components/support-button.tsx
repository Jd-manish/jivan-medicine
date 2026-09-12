"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SupportButton({ locale }: { locale: string }) {
  // Rendered server-side so it is visible immediately and without JavaScript.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("jivan_support_hidden") === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-24 right-3 z-40 flex items-center gap-1.5 md:bottom-6 md:right-6">
      <Link
        href={`/${locale}/support`}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-br from-mint-500 to-mint-600 py-2.5 pl-3 pr-4 text-white shadow-lg shadow-mint-600/30 transition hover:scale-[1.03] hover:shadow-xl"
        aria-label="Help the admin keep Jivan free"
      >
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="anim-ring absolute h-6 w-6 rounded-full bg-white/40" />
          <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-current">
            <path d="M12 21s-7.5-4.7-9.6-9A5.3 5.3 0 0 1 12 6.2 5.3 5.3 0 0 1 21.6 12c-2.1 4.3-9.6 9-9.6 9Z" />
          </svg>
        </span>
        <span className="text-xs font-bold leading-tight">
          Help the admin
        </span>
      </Link>

      <button
        onClick={() => {
          sessionStorage.setItem("jivan_support_hidden", "1");
          setHidden(true);
        }}
        aria-label="Hide support button"
        className="grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] font-bold text-ink-400 shadow ring-1 ring-ink-100 hover:text-ink-900"
      >
        ×
      </button>
    </div>
  );
}
