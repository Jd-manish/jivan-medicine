import type { Article } from "@/lib/article-types";

/** Topic-based byline labels. These are not named people or medical credentials. */
export type AuthorRole = {
  slug: string;
  title: string;
  byline: string;
  expertise: string;
  categories: string[];
};

export const authorRoles: AuthorRole[] = [
  {
    slug: "health-affordability-editor",
    title: "Health Affordability Editor",
    byline: "Health Affordability Editor, Jivan Editorial Team",
    expertise: "Topic label for guides about medicine affordability, assistance programmes, and cost comparisons.",
    categories: ["Guide"],
  },
  {
    slug: "health-safety-editor",
    title: "Health Safety Editor",
    byline: "Health Safety Editor, Jivan Editorial Team",
    expertise: "Topic label for educational content about product verification, medicine handling, and safety considerations.",
    categories: ["Safety"],
  },
  {
    slug: "pricing-research-editor",
    title: "Pricing Research Editor",
    byline: "Pricing Research Editor, Jivan Editorial Team",
    expertise: "Topic label for price-comparison and composite case-study content. Case studies are illustrative, not individual patient records.",
    categories: ["Case Study"],
  },
  {
    slug: "health-economics-editor",
    title: "Health Economics Editor",
    byline: "Health Economics Editor, Jivan Editorial Team",
    expertise: "Topic label for explainers about medicine pricing policy, patents, licensing, and market competition.",
    categories: ["Explainer"],
  },
];

export function getAuthorBySlug(slug: string): AuthorRole | undefined {
  return authorRoles.find((role) => role.slug === slug);
}

export function getAuthorByCategory(category: Article["category"]): AuthorRole {
  return authorRoles.find((role) => role.categories.includes(category)) ?? authorRoles[0];
}
