CREATE TYPE "public"."roles" AS ENUM('teacher', 'user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."centers" AS ENUM('Vasto', 'Pescara');--> statement-breakpoint
CREATE TYPE "public"."lesson_status" AS ENUM('scheduled', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_information" (
	"user_id" text,
	"first_name" text,
	"last_name" text,
	"role" "roles" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer DEFAULT 0 NOT NULL,
	"from_date" timestamp,
	"to_date" timestamp,
	"status" "subscription_status" DEFAULT 'inactive' NOT NULL,
	"entries_per_day" integer DEFAULT 1 NOT NULL,
	"entries_per_week" integer DEFAULT 1 NOT NULL,
	"center" "centers" DEFAULT 'Vasto' NOT NULL,
	"duration_in_days" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"teacher_id" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"center" "centers" DEFAULT 'Vasto' NOT NULL,
	"status" "lesson_status" DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teacher_invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_invitation_email_unique" UNIQUE("email"),
	CONSTRAINT "teacher_invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"duration" integer DEFAULT 0 NOT NULL,
	"min_participants" integer DEFAULT 1 NOT NULL,
	"max_participants" integer DEFAULT 10 NOT NULL,
	"redirect_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"center" "centers" DEFAULT 'Vasto' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;