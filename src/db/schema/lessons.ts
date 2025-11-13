import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { lessonStatusEnum, centersEnum } from "./enums";

export const lessons = pgTable("lessons", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),
  title: text("title").notNull(),
  description: text("description"),
  teacherId: text("teacher_id").references(() => user.id, {
    onDelete: "set null",
  }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  center: centersEnum("center").notNull().default("Vasto"),
  status: lessonStatusEnum("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type LessonType = typeof lessons.$inferSelect;
export type InsertLessonType = typeof lessons.$inferInsert;
