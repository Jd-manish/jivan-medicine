import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jivan.health";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jivan — Compare Medicine Prices & Indian Generic Alternatives",
    template: "%s | Jivan",
  },
  description:
    "Compare US and European medicine prices with lower-cost Indian same-salt alternatives. Search 13,000+ products with uses, dosage, manufacturer and transparent price sources.",
  applicationName: "Jivan",
  category: "health",
  authors: [{ name: "Jivan Editorial Team", url: `${siteUrl}/en/about` }],
  creator: "Jivan",
  publisher: "Jivan",
  keywords: [
    "medicine price comparison",
    "Indian generic medicines",
    "same salt medicines",
    "affordable medicines US",
    "affordable medicines Europe",
    "cheap prescription alternatives",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Jivan — Medicine Access for Everyone",
    description:
      "Find the same active-salt medication at a fraction of the price, with transparent sources and physician-first safety guidance.",
    type: "website",
    url: siteUrl,
    siteName: "Jivan",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jivan — Medicine Access for Everyone",
    description: "Compare medicine prices and find lower-cost Indian same-salt alternatives.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-ink-900 antialiased">{children}</body>
    </html>
  );
}
