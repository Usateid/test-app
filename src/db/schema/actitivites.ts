import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { centersEnum } from "./enums";
import { user } from "./auth";

export const activities = pgTable("activities", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull().default(0),
  minParticipants: integer("min_participants").notNull().default(1),
  maxParticipants: integer("max_participants").notNull().default(10),
  teacherId: text("teacher_id").references(() => user.id, {
    onDelete: "set null",
  }),
  location: text("location"),
  redirectUrl: text("redirect_url"),
  isActive: boolean("is_active").notNull().default(true),
  center: centersEnum("center").notNull().default("Vasto"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type ActivityType = typeof activities.$inferSelect;
export type InsertActivityType = typeof activities.$inferInsert;
