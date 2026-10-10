CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"counterparty" text DEFAULT '' NOT NULL,
	"kind" text DEFAULT 'borrowed' NOT NULL,
	"principal" numeric(12, 2) NOT NULL,
	"paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"date" text NOT NULL,
	"due_date" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"settled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loans_user_idx" ON "loans" USING btree ("user_id");