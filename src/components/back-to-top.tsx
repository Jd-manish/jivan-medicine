"use client";

import { useEffect, useState } from "react";

/**
 * Floating back-to-top button that appears after scrolling down.
 * Smooth-scrolls to top on click. Accessible with keyboard.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-600 shadow-lg ring-1 ring-ink-100 transition hover:bg-mint-50 hover:text-mint-600 hover:ring-mint-300 md:bottom-8 md:left-8"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l4.25 4.25a.75.75 0 01-1.06 1.06L10.75 5.56V15a.75.75 0 01-1.5 0V5.56L6.28 8.53a.75.75 0 01-1.06-1.06l4.25-4.25A.75.75 0 0110 3z" />
      </svg>
    </button>
  );
}