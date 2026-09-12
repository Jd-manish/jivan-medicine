import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, supportedLocales } from "@/lib/i18n";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Terms of Use",
    description:
      "Terms governing use of Jivan: the information service we provide, what we are not, intellectual property, acceptable use, accuracy limitations and liability.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(supportedLocales.map((alt) => [alt, `/${alt}/terms`])),
    },
  };
}

const sections = [
  {
    h: "1. The service we provide",
    body: [
      "Jivan provides medicine pricing information, comparison tools, and educational articles for visitors in the United States, Europe and elsewhere. The service is informational only.",
      "Jivan is not a pharmacy, not a marketplace, not a medical provider, and not a customs or legal adviser. Nothing on this site creates a pharmacist–patient or doctor–patient relationship.",
    ],
  },
  {
    h: "2. No medical advice",
    body: [
      "All content is general education. It does not diagnose, treat, or prescribe, and is no substitute for a licensed clinician who can see your full history.",
      "You agree never to start, stop, substitute, or re-dose any medicine based solely on this site. In an emergency, contact local emergency services, not this website.",
    ],
  },
  {
    h: "3. Accuracy and price limitations",
    body: [
      "Prices are reference points, carefully labelled as market-checked, derived, or estimated. They are not live quotations and do not guarantee availability or final cost at any supplier.",
      "You are responsible for verifying the current price, packaging, batch validity, and suitability directly with the supplier and your clinician before any purchase.",
      "Importing medicine is regulated differently in each country and changes over time. You are responsible for checking and obeying your own national law; we describe it in general terms only.",
    ],
  },
  {
    h: "4. Acceptable use",
    body: [
      "You agree not to scrape the catalog at volume, probe or overload the service, impersonate others in forms, submit fabricated or promotional feedback, or use the content to build a competing dataset.",
      "We may rate-limit or block abusive traffic to protect the service for everyone.",
    ],
  },
  {
    h: "5. Intellectual property",
    body: [
      "The Jivan name, logo, original editorial content, design system and software belong to Jivan. You may share individual links freely and quote short excerpts with attribution; you may not republish full articles or catalog datasets.",
      "Drug names and manufacturer names mentioned remain the trademarks of their respective owners; references are nominative and informational only.",
    ],
  },
  {
    h: "6. Third-party content and advertising",
    body: [
      "Where display advertising is shown (for example via Google AdSense), ads are provided by third parties over which we have no editorial control. A placement of an ad or the mention of any company is not an endorsement, and advertisers never influence our listings or conclusions.",
      "External links to regulators, Wikipedia and other sources are provided for verification; those sites are governed by their own terms.",
    ],
  },
  {
    h: "7. Submitted content",
    body: [
      "Questions you submit are private and never published. Feedback you submit is licensed to us for publication, moderation and deletion; it remains credited to the display name you chose.",
      "You confirm that anything you submit is accurate to your experience, lawful to share, and free of personal data you do not want us to process.",
    ],
  },
  {
    h: "8. Liability",
    body: [
      "Jivan is provided “as is” without warranties of any kind. To the maximum extent permitted by law we are not liable for decisions made in reliance on prices, articles, or lookup results; nor for interrupted access, data loss from user devices, or supplier conduct.",
      "Where local law does not permit full exclusion, our aggregate liability is limited to the amount (if any) you paid to use the service — which is zero for this free platform.",
    ],
  },
  {
    h: "9. Changes to these terms",
    body: [
      "We may update these terms; the current version always lives at this URL with a visible update date. Continued use after changes constitutes acceptance. Last updated: February 2026.",
    ],
  },
  {
    h: "10. Contact for legal questions",
    body: [
      "support@jivan.health — subject “Legal”. We answer compliance and takedown requests promptly.",
    ],
  },
];

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Legal</p>
          <h1 className="mt-3 text-3xl font-black text-ink-900 sm:text-4xl">Terms of Use</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600">
            Plain-language terms for using Jivan: what we are, what we are not, and what you are responsible for.
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
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
