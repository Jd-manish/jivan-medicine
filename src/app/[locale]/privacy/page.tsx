import type { Metadata } from "next";
import { isValidLocale } from "@/lib/i18n";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Privacy Policy",
    description: "How Jivan handles technical data, public-source search lookups, browser storage, and email correspondence.",
    alternates: localizedAlternates(locale, "privacy"),
    robots: localizedRobots(locale),
  };
}

const sections = [
  {
    h: "1. What the site handles",
    body: [
      "You can read articles, search the static catalog, and compare prices without an account or login. Jivan does not operate an application database or an on-site contact-submission form.",
      "Technical requests: Cloudflare Pages and other delivery infrastructure may process your IP address, browser/request metadata, and requested URL to serve the site and protect it from abuse. See Cloudflare's privacy terms for its processing and retention practices.",
      "Unmatched searches: when the medicine catalog and procedure index have no match, the search page automatically sends the query directly from your browser to RxNorm (U.S. National Library of Medicine), openFDA (U.S. Food and Drug Administration), and Wikipedia for public-source background. Those services may receive the query, IP address, and standard request metadata under their own privacy terms. Search terms can also remain in your browser history and hosting request logs. Do not enter a person's name or other identifying health information. Jivan does not persist the lookup responses in an application database.",
      "Browser storage: the theme preference and comparison selections use local storage; dismissing the support button uses session storage. These preferences stay in your browser and are not used to identify you.",
      "Please do not send medical records, prescription images, genetic data, biometric data, or payment-card details to Jivan or to a public lookup service.",
    ],
  },
  {
    h: "2. Email correspondence",
    body: [
      "Contact and correction links use mailto links. If you choose to send an email, your email provider transmits it to the address you selected; the message is handled in that recipient mailbox and is not submitted to or stored by the static website. The mailbox provider and recipient may retain correspondence under their own policies.",
      "Messages are not published on the site. Do not include sensitive health details. To request deletion of correspondence, write to the same address and identify the message as clearly as possible.",
    ],
  },
  {
    h: "3. Advertising and cookies",
    body: [
      "The current site build has advertising disabled. If advertising is enabled in a future build, third-party vendors such as Google AdSense may use cookies or similar technologies; this policy and any required consent controls must be updated before that change.",
      "Jivan does not currently include an application account, newsletter, or advertising profile. Cloudflare's delivery services may process technical request data as described above.",
    ],
    notes: [
      "The site uses browser local/session storage for preferences; this is distinct from a cookie and can be cleared in your browser settings.",
      "EU/UK visitors: if personalized advertising is introduced, the required consent choices must be presented before it is used.",
    ],
  },
  {
    h: "4. Retention and deletion",
    body: [
      "Jivan does not keep search responses or voluntary submissions in an application database. Browser preferences remain until you clear them; session storage is normally cleared when the browser session ends.",
      "Email correspondence is retained in the recipient mailbox for handling and record-keeping. Contact the recipient address to request deletion; hosting and public-source providers apply their own log and retention policies.",
    ],
  },
  {
    h: "5. Sharing and selling",
    body: [
      "Jivan does not sell personal information. Unmatched search terms are sent to the named public-source services from your browser, and technical requests are handled by Cloudflare Pages and related delivery infrastructure. Those providers process data under their own terms.",
      "We do not provide search terms or email correspondence to marketers or brokers for their own marketing use. We may disclose information when required by a valid legal order and, where lawful, will attempt to notify affected people.",
    ],
  },
  {
    h: "6. Privacy requests",
    body: [
      "You may ask what personal information Jivan holds about you or request its correction or deletion. Because the site has no application account or submission database, most site preferences can be cleared directly in your browser; email correspondence can be addressed to its recipient mailbox.",
      "For a privacy question, write to support@jivan.health with the subject “Data request.” EU/UK residents may also contact their national data protection authority; rights available to other residents depend on applicable law.",
    ],
  },
  {
    h: "7. Children",
    body: [
      "Jivan is a general-audience information service and is not directed at children under 13. Do not include a child's name or identifying health information in a search or email. If you believe a child has sent sensitive information to a Jivan mailbox, contact that mailbox to request deletion.",
    ],
  },
  {
    h: "8. Changes to this policy",
    body: [
      "Material changes are described on this page. The policy is reviewed when the site's data flows or third-party services change.",
      "Last updated: 7 October 2026.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="shell py-12 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Legal</p>
          <h1 className="mt-3 text-3xl font-black text-ink-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600">
            Jivan is a static, account-free information site. This policy explains public-source search lookups, browser storage, technical request data, and email correspondence.
          </p>
        </div>
      </section>

      <div className="shell max-w-4xl py-12">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.h} className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink-900">{section.h}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-ink-600">{paragraph}</p>
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
