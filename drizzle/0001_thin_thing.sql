CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text DEFAULT 'Vrinda' NOT NULL,
	"email" text DEFAULT 'vrinda@example.com' NOT NULL,
	"daily_reminder" boolean DEFAULT true NOT NULL,
	"goal_alerts" boolean DEFAULT true NOT NULL,
	"accent_color" text DEFAULT '#F7E8A4' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
