ALTER TABLE "expenses" ADD COLUMN "type" text DEFAULT 'expense' NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "account" text DEFAULT 'bank' NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "recurring" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "budgets" jsonb DEFAULT '{}'::jsonb NOT NULL;