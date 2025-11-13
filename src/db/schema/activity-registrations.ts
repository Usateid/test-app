import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { activities } from "./actitivites";

export const activityRegistrations = pgTable(
  "activity_registrations",
  {
    id: text("id")
      .default(sql`gen_random_uuid()::text`)
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.activityId] }),
  })
);

export type ActivityRegistrationType =
  typeof activityRegistrations.$inferSelect;
export type InsertActivityRegistrationType =
  typeof activityRegistrations.$inferInsert;
