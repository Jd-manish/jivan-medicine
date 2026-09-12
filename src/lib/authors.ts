import type { Article } from "@/lib/article-types";

/**
 * Author registry — role-based, not invented individuals.
 *
 * We deliberately publish named-ROLE attribution rather than fabricated
 * named authors with invented credentials. Inventing "Dr. X, PharmD"
 * profiles would be deceptive and fail the same trust review. Instead,
 * each byline links to a real organizational role with a published scope
 * of responsibility, review process and authored content — the same
 * E-E-A-T entity signal without misrepresentation.
 */
export type AuthorRole = {
  slug: string;
  title: string;
  /** Short byline label used on articles */
  byline: string;
  /** One-line expertise summary for the bio card */
  expertise: string;
  /** Full role description for the author page */
  scope: string[];
  /** The review actions this role is accountable for */
  reviewDuties: string[];
  categories: string[];
};

export const authorRoles: AuthorRole[] = [
  {
    slug: "health-affordability-editor",
    title: "Health Affordability Editor",
    byline: "Health Affordability Editor, Jivan Editorial Team",
    expertise:
      "Leads research into prescription-cost reduction: generic substitution routes, assistance programmes, international reference pricing and insurance dynamics.",
    scope: [
      "Owns the practical guides on cutting medicine costs — from substitution strategy and assistance programmes to household budgeting.",
      "Builds each guide from Tier-1 regulator data and programme documentation before drafting begins.",
      "Verifies that every cost figure cited in a guide traces to a documented reference range, never to an unverifiable seller listing.",
    ],
    reviewDuties: [
      "Cross-check guide claims against FDA, EMA and NHS sources before publication.",
      "Rewrite any guide that fails the plain-language test for a non-specialist reader.",
      "Re-review pricing-linked guides when market reference ranges are refreshed.",
    ],
    categories: ["Guide"],
  },
  {
    slug: "health-safety-editor",
    title: "Health Safety Editor",
    byline: "Health Safety Editor, Jivan Editorial Team",
    expertise:
      "Focuses on product security and clinical caution: counterfeit detection, cold-chain handling, import rules, and switch-safety for high-risk medicines.",
    scope: [
      "Owns all safety-classified articles: verification checklists, scam red flags, cold-chain rules and import-legality explainers.",
      "Maintains the test procedures our readers run before buying or switching: licensing checks, batch inspection, arrival checks.",
      "Keeps safety guidance aligned with regulator warnings rather than marketing claims from suppliers.",
    ],
    reviewDuties: [
      "Verify every checklist item against current regulator guidance (FDA, MHRA, NABP, national agencies).",
      "Flag and escalate any article that could read as encouraging an unsafe switch.",
      "Maintain the narrow-therapeutic-index and biologic caution language used across all articles.",
    ],
    categories: ["Safety"],
  },
  {
    slug: "pricing-research-editor",
    title: "Pricing Research Editor",
    byline: "Pricing Research Editor, Jivan Editorial Team",
    expertise:
      "Maintains the referenced price anchor dataset used across the catalog and composes the case studies built from it.",
    scope: [
      "Owns the 476-molecule referenced-price dataset and its re-review cycle.",
      "Compose case studies as composite profiles that follow documented price patterns — clearly labelled as composite, always anchored to real reference ranges.",
      "Computes the arithmetic in every case study so table totals and percentages are internally consistent.",
    ],
    reviewDuties: [
      "Recalculate every case-study table row before publication.",
      "Reject any case where the arithmetic implies an implausible saving without a documented reason.",
      "Keep composite-profile disclaimers visible on every case study.",
    ],
    categories: ["Case Study"],
  },
  {
    slug: "health-economics-editor",
    title: "Health Economics Editor",
    byline: "Health Economics Editor, Jivan Editorial Team",
    expertise:
      "Explains the structural forces behind medicine pricing: patent frameworks, PBM economics, licensing models, and market competition.",
    scope: [
      "Owns explainers on how prices are formed — from US pricing structure and patent thickets to biosimilar approval pathways.",
      "Keeps market-mechanism descriptions current with regulator policy and licensing announcements.",
      "Ensures every mechanism claim links to a primary policy or regulatory source.",
    ],
    reviewDuties: [
      "Verify patent and market-structure claims against policy sources and court filings where public.",
      "Distinguish well-evidenced mechanisms from contested claims and mark contested ones as disputed.",
      "Refresh explainer figures when major pricing policy changes land (for example new negotiation rules).",
    ],
    categories: ["Explainer"],
  },
];

export function getAuthorBySlug(slug: string): AuthorRole | undefined {
  return authorRoles.find((role) => role.slug === slug);
}

export function getAuthorByCategory(category: Article["category"]): AuthorRole {
  return authorRoles.find((role) => role.categories.includes(category)) ?? authorRoles[0];
}
