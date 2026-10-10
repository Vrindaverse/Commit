CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code_hash" text NOT NULL,
	"purpose" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"consumed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "display_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "email" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "login_logs" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "otp_codes_user_purpose_idx" ON "otp_codes" USING btree ("user_id","purpose");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exams_user_idx" ON "exams" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_user_idx" ON "goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "habits_user_idx" ON "habits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "journal_entries_user_idx" ON "journal_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "learning_paths_user_idx" ON "learning_paths" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "login_logs_user_date_idx" ON "login_logs" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "projects_user_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_user_unique" ON "settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subjects_user_idx" ON "subjects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasks_user_idx" ON "tasks" USING btree ("user_id");