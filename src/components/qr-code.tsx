"use client";

/**
 * Generates a QR code for the current page URL.
 * Uses a free QR code API (no library needed).
 */
export function QRCodeShare({ url, size = 120 }: { url?: string; size?: number }) {
  const qrUrl = url ?? (typeof window !== "undefined" ? window.location.href : "https://jivan.health");
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=0b1020&margin=8`;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrApiUrl}
        alt={`QR code for ${qrUrl}`}
        width={size}
        height={size}
        className="rounded-xl border border-ink-100"
        loading="lazy"
      />
      <p className="text-[10px] text-ink-400">Scan to open this page</p>
    </div>
  );
}