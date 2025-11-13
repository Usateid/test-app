CREATE TABLE "lesson_registrations" (
	"id" text DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_registrations_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_registrations" ADD CONSTRAINT "lesson_registrations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_registrations" ADD CONSTRAINT "lesson_registrations_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;