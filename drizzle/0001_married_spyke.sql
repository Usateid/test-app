CREATE TABLE "user_subscriptions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"activated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "birth_date" timestamp;--> statement-breakpoint
ALTER TABLE "user_information" ADD COLUMN "tax_code" text;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;