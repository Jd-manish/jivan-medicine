CREATE TABLE "feedback" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feedback_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT 'Anonymous' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"message" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"medicine" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"source" text DEFAULT 'quote' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicine_lookups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medicine_lookups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"query" text NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medicines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
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
CREATE TABLE "questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"subject" text DEFAULT 'General' NOT NULL,
	"question" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY,
	"value" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "feedback_approved_idx" ON "feedback" ("approved");--> statement-breakpoint
CREATE INDEX "feedback_pinned_idx" ON "feedback" ("pinned");--> statement-breakpoint
CREATE INDEX "feedback_created_idx" ON "feedback" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "medicine_lookups_query_unique" ON "medicine_lookups" ("query");--> statement-breakpoint
CREATE UNIQUE INDEX "medicines_name_strength_form_unique" ON "medicines" ("name","strength","form");--> statement-breakpoint
CREATE UNIQUE INDEX "medicines_slug_unique" ON "medicines" ("slug");--> statement-breakpoint
CREATE INDEX "medicines_salt_idx" ON "medicines" ("generic_salt");--> statement-breakpoint
CREATE INDEX "medicines_category_idx" ON "medicines" ("category");--> statement-breakpoint
CREATE INDEX "medicines_therapy_idx" ON "medicines" ("therapy_area");--> statement-breakpoint
CREATE INDEX "medicines_status_idx" ON "medicines" ("price_status");--> statement-breakpoint
CREATE INDEX "medicines_high_saving_idx" ON "medicines" ("high_saving");--> statement-breakpoint
CREATE INDEX "medicines_name_idx" ON "medicines" ("name");--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" ("status");--> statement-breakpoint
CREATE INDEX "questions_created_idx" ON "questions" ("created_at");