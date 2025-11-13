import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { subscriptionStatusEnum, centersEnum } from "./enums";

export const subscriptions = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").default(0).notNull(),
  fromDate: timestamp("from_date"),
  toDate: timestamp("to_date"),
  status: subscriptionStatusEnum("status").notNull().default("inactive"),
  entriesPerDay: integer("entries_per_day").notNull().default(1),
  entriesPerWeek: integer("entries_per_week").notNull().default(1),
  center: centersEnum("center").notNull().default("Vasto"),
  durationInDays: integer("duration_in_days").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SubscriptionType = typeof subscriptions.$inferSelect;
export type InsertSubscriptionType = typeof subscriptions.$inferInsert;
