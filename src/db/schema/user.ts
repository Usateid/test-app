import { pgEnum, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { subscriptions } from "./subscriptions";
import { sql } from "drizzle-orm";

export const rolesEnum = pgEnum("roles", ["teacher", "user", "admin"]);

export const userInformation = pgTable("user_information", {
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: rolesEnum("role").notNull().default("user"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  zipCode: text("zip_code"),
  country: text("country"),
  birthDate: timestamp("birth_date"),
  taxCode: text("tax_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Junction table for many-to-many relationship between users and subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  subscriptionId: text("subscription_id")
    .notNull()
    .references(() => subscriptions.id, {
      onDelete: "cascade",
    }),
  // When the user purchased/activated this subscription
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  // When the subscription expires (can be calculated based on subscription duration)
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UserSubscriptionType = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscriptionType = typeof userSubscriptions.$inferInsert;

export type UserInformationType = typeof userInformation.$inferSelect;
export type InsertUserInformationType = typeof userInformation.$inferInsert;
