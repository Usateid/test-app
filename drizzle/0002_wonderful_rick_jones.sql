CREATE TABLE "activity_registrations" (
	"id" text DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"activity_id" text NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "activity_registrations_user_id_activity_id_pk" PRIMARY KEY("user_id","activity_id")
);
--> statement-breakpoint
ALTER TABLE "activity_registrations" ADD CONSTRAINT "activity_registrations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_registrations" ADD CONSTRAINT "activity_registrations_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;