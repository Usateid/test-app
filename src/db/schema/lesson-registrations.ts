import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { lessons } from "./lessons";

export const lessonRegistrations = pgTable(
  "lesson_registrations",
  {
    id: text("id")
      .default(sql`gen_random_uuid()::text`)
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.lessonId] }),
  })
);

export type LessonRegistrationType = typeof lessonRegistrations.$inferSelect;
export type InsertLessonRegistrationType =
  typeof lessonRegistrations.$inferInsert;
