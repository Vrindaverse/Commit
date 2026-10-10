CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text NOT NULL,
	"date" text NOT NULL,
	"time" text DEFAULT '' NOT NULL,
	"syllabus" text[] DEFAULT '{}' NOT NULL,
	"color" text DEFAULT '#F8C8C8' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"deadline" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"milestones" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"color" text DEFAULT '#F7E8A4' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"color" text DEFAULT '#CDEAC0' NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"mood" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"color" text DEFAULT '#DCCEF5' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"tasks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"milestones" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"color" text DEFAULT '#B8D8F8' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"attendance" integer DEFAULT 0 NOT NULL,
	"assignments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"grade" text DEFAULT '' NOT NULL,
	"color" text DEFAULT '#FFD8BE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"due_date" text NOT NULL,
	"time" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"project_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
