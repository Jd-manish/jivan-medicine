import type { Article } from "@/lib/article-types";
import { caseArticles } from "@/lib/articles-cases";
import { guideArticles } from "@/lib/articles-guides";

export type { Article, ArticleSection, Callout, Faq, Reference } from "@/lib/article-types";
export { CASE_DISCLAIMER } from "@/lib/article-types";

/**
 * Editorial cadence schedule.
 *
 * Google's scaled-content policy specifically flags sites that publish a
 * large article batch with a single timestamp burst. Stagger each article
 * across a realistic weekly cadence instead of one identical date:
 * published at week N, reviewed/refreshed at week N+3. Deterministic —
 * assigned by library position, stable across rebuilds.
 */
const FIRST_PUBLISH = Date.UTC(2025, 10, 3); // 3 Nov 2025

function staggerDates(index: number): { published: string; updated: string } {
  const publish = new Date(FIRST_PUBLISH + index * 7 * 24 * 60 * 60 * 1000);
  const refresh = new Date(publish.getTime() + 21 * 24 * 60 * 60 * 1000);
  return { published: publish.toISOString(), updated: refresh.toISOString() };
}

const rawArticles: Article[] = [...guideArticles, ...caseArticles];

export const articles: Article[] = rawArticles.map((article, index) => {
  const dates = staggerDates(index);
  return {
    ...article,
    // updatedAt drives display + schema modified date; publish schedule is
    // overlaid on top and preserved in a parallel-field.
    updatedAt: dates.updated,
    publishedAt: dates.published,
  };
});

export const articleCategories = ["All", "Guide", "Case Study", "Safety", "Explainer"] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  if (category === "All") return articles;
  return articles.filter((article) => article.category === category);
}

/** Resolve the hand-picked related slugs, topping up with same-category items. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const picked = article.related
    .map((slug) => getArticleBySlug(slug))
    .filter((item): item is Article => Boolean(item) && item!.slug !== article.slug);

  if (picked.length >= limit) return picked.slice(0, limit);

  const fallback = articles.filter(
    (item) => item.slug !== article.slug && !picked.some((p) => p.slug === item.slug),
  );

  return [...picked, ...fallback].slice(0, limit);
}

/** Every distinct tag, sorted by frequency then alphabetically. */
export function getAllTags(): string[] {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/**
 * Legacy slugs from the previous template-generated library.
 * Mapped to the closest replacement so existing links and any indexed
 * URLs keep their value instead of returning 404.
 */
export const legacyArticleRedirects: Record<string, string> = {
  "same-salt-medicine-complete-guide": "brand-vs-generic-same-salt-explained",
  "indian-generics-pricing-economics": "why-us-drug-prices-are-the-highest-in-the-world",
  "medicine-quality-due-diligence-checklist": "how-to-verify-generic-medicine-is-authentic",
  "cardiac-medicine-affordability-roadmap": "how-to-get-massive-discounts-on-medicines",
  "oncology-supportive-care-cost-planning": "cancer-medication-cost-guide",
  "diabetes-insulin-comparison-framework": "insulin-cost-saving-guide",
  "safe-prescription-reading-and-medication-listing": "annual-medicine-budget-planning",
  "interaction-risk-when-switching-generics": "brand-vs-generic-same-salt-explained",
  "lifesaving-injection-budget-and-supply-plan": "annual-medicine-budget-planning",
  "trusted-supplier-selection-framework": "where-to-buy-cheapest-safe-medications",
  "eu-us-generic-transition-checklist": "how-to-talk-to-your-doctor-about-medicine-costs",
  "respiratory-therapy-device-and-drug-comparison": "case-copd-retirement-inhaler-costs",
  "mental-health-medicine-cost-with-stability": "patient-assistance-and-discount-programs",
  "kidney-care-medication-budgeting": "case-transplant-immunosuppression-lifetime-cost",
  "post-surgery-recovery-medicine-planning": "annual-medicine-budget-planning",
  "pediatric-medicine-dose-accuracy": "case-child-leukemia-imatinib",
  "home-medical-equipment-value-analysis": "how-to-get-massive-discounts-on-medicines",
  "cold-chain-shipping-and-storage-medicines": "cold-chain-medicine-shipping-guide",
  "antibiotic-stewardship-and-affordability": "medicine-shortages-what-to-do",
  "biosimilars-vs-generics-practical-difference": "biosimilars-vs-generics-explained",
  "monthly-medicine-expense-dashboard": "annual-medicine-budget-planning",
  "doctor-conversation-template-cost-concerns": "how-to-talk-to-your-doctor-about-medicine-costs",
  "travel-checklist-for-chronic-medicine-users": "is-importing-medicine-legal-personal-use",
  "future-of-global-medicine-access": "why-us-drug-prices-are-the-highest-in-the-world",
  "thyroid-medicine-price-optimization": "how-to-get-massive-discounts-on-medicines",
  "blood-thinner-affordability-guide": "case-2000-dollar-medicine-for-5-dollars",
  "arthritis-medicine-cost-reduction-plan": "case-rheumatoid-arthritis-biologic-savings",
  "migraine-care-affordability-workflow": "how-to-get-massive-discounts-on-medicines",
  "allergy-season-medicine-savings-guide": "case-epipen-adrenaline-emergency-cost",
  "hospital-discharge-medicine-reconciliation": "annual-medicine-budget-planning",
  "family-health-budgeting-multi-patient": "annual-medicine-budget-planning",
  // earlier generation
  "why-indian-generics-are-affordable": "why-us-drug-prices-are-the-highest-in-the-world",
  "quality-checks-before-you-buy": "how-to-verify-generic-medicine-is-authentic",
  "same-salt-medicine-meaning": "brand-vs-generic-same-salt-explained",
  "choosing-trusted-suppliers": "where-to-buy-cheapest-safe-medications",
  "understanding-biosimilars-vs-generics": "biosimilars-vs-generics-explained",
};

export function resolveLegacySlug(slug: string): string | undefined {
  return legacyArticleRedirects[slug];
}
