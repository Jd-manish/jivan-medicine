"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // Broadening the type completely resolves the strict mode conflict
    adsbygoogle: any;
  }
}

function validClientId(value: string) {
  return /^ca-pub-\d{10,20}$/.test(value.trim());
}

function validSlotId(value: string) {
  return /^\d{5,20}$/.test(value.trim());
}

export function AdSlot({
  enabled,
  clientId,
  slotId,
  placement = "unit",
  format = "horizontal",
  className = "",
}: {
  enabled: boolean;
  clientId: string;
  slotId: string;
  placement?: string;
  format?: "horizontal" | "rectangle";
  className?: string;
}) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!enabled || !validClientId(clientId) || !validSlotId(slotId)) return;
    try {
      if (adRef.current && adRef.current.innerHTML === "") {
        // The cast is removed and {} is now perfectly accepted
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense unit initialization error:", e);
    }
  }, [pathname, enabled, clientId, slotId]);

  if (!enabled || !validClientId(clientId) || !validSlotId(slotId)) return null;

  const height = format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]";

  return (
    <div className={`shell my-6 overflow-hidden text-center ${className}`}>
      <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.16em] text-ink-400">
        Advertisement
      </p>
      <ins
        ref={adRef}
        className={`adsbygoogle block ${height} w-full`}
        style={{ display: "block" }}
        data-ad-client={clientId.trim()}
        data-ad-slot={slotId.trim()}
        data-ad-format={format === "horizontal" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdsenseLoader({ enabled, clientId }: { enabled: boolean; clientId: string }) {
  if (!enabled || !validClientId(clientId)) return null;
  return (
    <Script
      id="adsbygoogle-loader"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId.trim()}`}
    />
  );
}