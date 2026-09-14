CREATE TABLE IF NOT EXISTS "medicines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"slug" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"brand_names" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"therapy_area" text DEFAULT 'General' NOT NULL,
	"form" text NOT NULL,
	"company" text NOT NULL,
	"generic_salt" text NOT NULL,
	"strength" text NOT NULL,
	"pack_size" text DEFAULT '1 pack' NOT NULL,
	"use_cases" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"dosage" text DEFAULT '' NOT NULL,
	"pros" text DEFAULT '' NOT NULL,
	"cons" text DEFAULT '' NOT NULL,
	"side_effects" text DEFAULT '' NOT NULL,
	"storage" text DEFAULT 'Store below 25°C, away from moisture and direct light.' NOT NULL,
	"us_eu_price" integer NOT NULL,
	"india_price" integer NOT NULL,
	"price_status" text DEFAULT 'estimated' NOT NULL,
	"price_notes" text DEFAULT 'Pricing estimated from therapeutic class averages.' NOT NULL,
	"price_source" text DEFAULT '' NOT NULL,
	"price_source_url" text DEFAULT '' NOT NULL,
	"price_last_checked" timestamp with time zone DEFAULT now() NOT NULL,
	"prescription_required" boolean DEFAULT true NOT NULL,
	"high_saving" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "medicines_name_strength_form_unique" ON "medicines" ("name", "strength", "form");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "medicines_slug_unique" ON "medicines" ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_salt_idx" ON "medicines" ("generic_salt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_category_idx" ON "medicines" ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_therapy_idx" ON "medicines" ("therapy_area");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_status_idx" ON "medicines" ("price_status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_high_saving_idx" ON "medicines" ("high_saving");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_name_idx" ON "medicines" ("name");
