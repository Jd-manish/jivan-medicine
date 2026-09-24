"use client";

import { useState } from "react";

/**
 * Social share buttons for medicine savings.
 * Pre-fills viral text showing the price difference.
 *
 * Example: "I found Sofosbuvir for $30 in India — it costs $18,000 in the US!
 * That's 99.8% less. Same active ingredient. Check your medicines: jivan.health"
 */
export function ShareSavings({
  medicineName,
  usPrice,
  indiaPrice,
  savingsPercent,
  locale,
  url,
}: {
  medicineName: string;
  usPrice: string;
  indiaPrice: string;
  savingsPercent: number;
  locale: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const savingsText = savingsPercent >= 10 ? `${savingsPercent}%` : `${savingsPercent}%`;

  const viralText =
    `💊 I found ${medicineName} for ${indiaPrice} in India — it costs ${usPrice} in the US/EU! ` +
    `That's ${savingsText} less. Same active ingredient, same quality. ` +
    `Check your medicines at jivan.health`;

  const encodedText = encodeURIComponent(viralText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      name: "X / Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: "bg-ink-900 text-white hover:bg-ink-800",
    },
    {
      name: "Facebook",
      icon: "f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      color: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      name: "WhatsApp",
      icon: "✆",
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: "bg-green-600 text-white hover:bg-green-700",
    },
    {
      name: "LinkedIn",
      icon: "in",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-blue-700 text-white hover:bg-blue-800",
    },
    {
      name: "Reddit",
      icon: "⬆",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      color: "bg-orange-600 text-white hover:bg-orange-700",
    },
  ];

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`${viralText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = `${viralText}\n\n${shareUrl}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="panel rounded-3xl p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-500/10">
          <span className="text-lg">📢</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-ink-900">
            Spread the word — save lives
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            Most people don&apos;t know these price gaps exist. Share this and help
            someone afford their medication.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition hover:scale-[1.03] ${link.color}`}
            title={`Share on ${link.name}`}
          >
            <span className="text-sm">{link.icon}</span>
            {link.name}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition hover:scale-[1.03] ${
            copied
              ? "bg-mint-500 text-white"
              : "bg-ink-50 text-ink-700 hover:bg-ink-100"
          }`}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-ink-50 p-3">
        <p className="text-xs leading-relaxed text-ink-500 italic">
          &ldquo;{viralText}&rdquo;
        </p>
      </div>
    </div>
  );
}

/**
 * Simple share button that uses the Web Share API (mobile)
 * or falls back to a copy-to-clipboard action.
 */
export function QuickShareButton({
  medicineName,
  usPrice,
  indiaPrice,
  savingsPercent,
}: {
  medicineName: string;
  usPrice: string;
  indiaPrice: string;
  savingsPercent: number;
}) {
  const [shared, setShared] = useState(false);

  const shareText =
    `💊 ${medicineName}: ${indiaPrice} in India vs ${usPrice} in US/EU ` +
    `(${savingsPercent}% less). Same medicine, same quality. ` +
    `Check yours: jivan.health`;

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: `${medicineName} — ${savingsPercent}% less`, text: shareText, url });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // User cancelled or not supported — fall through
      }
    }

    // Fallback: copy
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = `${shareText}\n\n${url}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-600 transition hover:border-mint-500/40 hover:bg-mint-500/5 hover:text-mint-600"
    >
      {shared ? (
        <>✓ Copied!</>
      ) : (
        <>📢 Share this {savingsPercent}% saving</>
      )}
    </button>
  );
}