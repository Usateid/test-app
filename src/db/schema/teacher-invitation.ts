import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const teacherInvitation = pgTable("teacher_invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type TeacherInvitationType = typeof teacherInvitation.$inferSelect;
export type InsertTeacherInvitationType = typeof teacherInvitation.$inferInsert;
