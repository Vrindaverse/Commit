-- Recreate login_logs (dropped out-of-band) with the unique (user_id, date)
-- constraint declared in schema.ts, and remove the unused otp_codes table.
--
-- The database is schema-pushed (drizzle.__drizzle_migrations is empty), so this
-- runs outside the drizzle journal. Every statement is idempotent and safe to re-run.

CREATE TABLE IF NOT EXISTS "login_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'login_logs_user_id_users_id_fk') THEN
		ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_user_id_users_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "login_logs_user_date_unique"
	ON "login_logs" USING btree ("user_id", "date");

DROP TABLE IF EXISTS "otp_codes";
