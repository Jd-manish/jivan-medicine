import type { Metadata } from "next";
import { isValidLocale, supportedLocales } from "@/lib/i18n";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Privacy Policy",
    description:
      "How Jivan handles data: what we collect, what we never collect, third-party advertising cookies including Google AdSense disclosure, analytics, retention, and your rights.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/privacy`])),
    },
  };
}

const sections = [
  {
    h: "1. What we collect — and what we deliberately do not",
    body: [
      "We are a privacy-minimal service by design. You can read every article, search the catalog and compare prices without an account, a login, or any identifying information.",
      "Technical data: your browser automatically sends an IP address, browser type, device class and language preference with every request. We use the language preference to route you to a localized version of the site.",
      "Voluntary submissions: if you send a question, leave feedback, or request a price-check, we store exactly the fields you typed (name, email if given, country, and your message). We never enrich, buy, or infer additional data about you.",
      "What we never collect: medical records, images of prescriptions, genetic data, biometric data, or payment card details. Please do not send medical records or prescription scans through any form on this site.",
    ],
  },
  {
    h: "2. How submissions are handled",
    body: [
      "Questions are private: they are visible only to the administrator, are never published, and are deleted once answered or on request.",
      "Feedback is different: it is submitted specifically for publication after moderation. Your display name and country (if provided) appear publicly; your email never does.",
      "Price-check leads are used only to respond to your request. We do not add them to marketing lists and there is no newsletter to opt out of.",
    ],
  },
  {
    h: "3. Advertising and third-party cookies (including Google)",
    body: [
      "Where advertising is enabled, it is served by third-party vendors including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and other websites.",
      "Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet. You can opt out of personalized advertising by visiting Google Ads Settings (adssettings.google.com) and www.aboutads.info/choices.",
      "If ads are not yet enabled on this site, no advertising cookies are being set. We will update this policy before enabling them; approval changes are never applied silently to this document.",
      "Analytics, where used, is configured for aggregate reporting (page views, approximate geography) and is not used to build individual profiles.",
    ],
    notes: [
      "Cookie categories: strictly-necessary (locale session, admin session), preference (dismissed hints), and third-party advertising cookies (only when ads are enabled).",
      "EU/UK visitors: where personalized ads are used, a consent mechanism is required and non-consented users receive non-personalized or no ads.",
    ],
  },
  {
    h: "4. Data retention",
    body: [
      "Questions: deleted after handling, or within 12 months at most.",
      "Feedback: retained while it remains published; deleted permanently if you unpublish it via our contact page.",
      "Price-check leads: retained up to 12 months so we can see whether follow-up was completed."
    ],
  },
  {
    h: "5. Sharing and selling",
    body: [
      "We do not sell personal information. We do not share submission content with marketers, brokers, or third parties for their own use.",
      "Vendor processing: hosting, database and error-monitoring providers may process technical data on our behalf under their own terms; this is infrastructure, not data sharing for commercial purposes.",
      "Legal: we disclose data only if compelled by a valid legal order, and where lawful we will attempt to notify affected users.",
    ],
  },
  {
    h: "6. Your rights (including GDPR/UK GDPR and CCPA-style rights)",
    body: [
      "You may request access to, a copy of, correction of, or deletion of any personal data we hold about you. Because we hold so little, requests are fast and free.",
      "Write to support@jivan.health with the subject “Data request,” tell us what you need, and we verify by the email you submit.",
      "EU/UK residents may also complain to their national data protection authority; US residents of covered states may exercise opt-out and deletion rights over the (minimal) data we hold.",
    ],
  },
  {
    h: "7. Children",
    body: [
      "Jivan is a general-audience information service with no account system and is not directed at children under 13. We do not knowingly collect data from children. If a submission is identified as coming from a child, it is deleted.",
    ],
  },
  {
    h: "8. Changes to this policy",
    body: [
      "This policy lives at a permanent URL with a visible “last updated” line. Material changes are described on this page; we do not make material changes silently.",
      "Last updated: February 2026."
    ],
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Legal</p>
          <h1 className="mt-3 text-3xl font-black text-ink-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600">
            Jivan is privacy-minimal by design. This policy covers what we collect, what we never collect,
            advertising cookies, retention, and your rights.
          </p>
        </div>
      </section>

      <div className="shell max-w-4xl py-12">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.h} className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink-900">{section.h}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((p) => (
                  <p key={p} className="text-sm leading-7 text-ink-600">{p}</p>
                ))}
              </div>
              {section.notes ? (
                <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                  {section.notes.map((note) => (
                    <li key={note} className="flex gap-2.5 text-sm leading-6 text-ink-500">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                      {note}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
