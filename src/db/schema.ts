import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

export const medicines = pgTable(
  "medicines",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().default(""),
    name: text("name").notNull(),
    brandNames: text("brand_names").notNull().default(""),
    category: text("category").notNull(),
    therapyArea: text("therapy_area").notNull().default("General"),
    form: text("form").notNull(),
    company: text("company").notNull(),
    genericSalt: text("generic_salt").notNull(),
    strength: text("strength").notNull(),
    packSize: text("pack_size").notNull().default("1 pack"),
    useCases: text("use_cases").notNull(),
    description: text("description").notNull().default(""),
    dosage: text("dosage").notNull().default(""),
    pros: text("pros").notNull().default(""),
    cons: text("cons").notNull().default(""),
    sideEffects: text("side_effects").notNull().default(""),
    storage: text("storage").notNull().default("Store below 25°C, away from moisture and direct light."),
    usEuPrice: integer("us_eu_price").notNull(),
    indiaPrice: integer("india_price").notNull(),
    priceStatus: text("price_status").notNull().default("estimated"),
    priceNotes: text("price_notes").notNull().default("Pricing estimated from therapeutic class averages."),
    priceSource: text("price_source").notNull().default(""),
    priceSourceUrl: text("price_source_url").notNull().default(""),
    priceLastChecked: timestamp("price_last_checked", { withTimezone: true }).notNull().defaultNow(),
    prescriptionRequired: boolean("prescription_required").notNull().default(true),
    highSaving: boolean("high_saving").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueMedicineIndex: uniqueIndex("medicines_name_strength_form_unique").on(
      table.name,
      table.strength,
      table.form,
    ),
    uniqueSlugIndex: uniqueIndex("medicines_slug_unique").on(table.slug),
    saltIndex: index("medicines_salt_idx").on(table.genericSalt),
    categoryIndex: index("medicines_category_idx").on(table.category),
    therapyIndex: index("medicines_therapy_idx").on(table.therapyArea),
    statusIndex: index("medicines_status_idx").on(table.priceStatus),
    highSavingIndex: index("medicines_high_saving_idx").on(table.highSaving),
    nameIndex: index("medicines_name_idx").on(table.name),
  }),
);

export const medicineLookups = pgTable(
  "medicine_lookups",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    query: text("query").notNull(),
    payload: text("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueQueryIndex: uniqueIndex("medicine_lookups_query_unique").on(table.query),
  }),
);

export const leads = pgTable("leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().default(""),
  email: text("email").notNull(),
  country: text("country").notNull().default(""),
  medicine: text("medicine").notNull().default(""),
  message: text("message").notNull().default(""),
  source: text("source").notNull().default("quote"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * PRIVATE. Questions submitted by visitors.
 * Never exposed on any public route — readable and deletable only by admin.
 */
export const questions = pgTable(
  "questions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull().default(""),
    email: text("email").notNull().default(""),
    country: text("country").notNull().default(""),
    subject: text("subject").notNull().default("General"),
    question: text("question").notNull(),
    status: text("status").notNull().default("new"), // new | read | answered
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("questions_status_idx").on(table.status),
    createdIdx: index("questions_created_idx").on(table.createdAt),
  }),
);

/**
 * PUBLIC once approved. Feedback shown on the site.
 * Admin controls approval, pinning and deletion.
 */
export const feedback = pgTable(
  "feedback",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull().default("Anonymous"),
    country: text("country").notNull().default(""),
    rating: integer("rating").notNull().default(5),
    message: text("message").notNull(),
    /** Only approved rows are ever returned to the public site. */
    approved: boolean("approved").notNull().default(false),
    pinned: boolean("pinned").notNull().default(false),
    /** Stored privately for follow-up; never sent to the public route. */
    contactEmail: text("contact_email").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    approvedIdx: index("feedback_approved_idx").on(table.approved),
    pinnedIdx: index("feedback_pinned_idx").on(table.pinned),
    createdIdx: index("feedback_created_idx").on(table.createdAt),
  }),
);

export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
