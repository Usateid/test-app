import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
]);

export const centersEnum = pgEnum("centers", ["Vasto", "Pescara"]);

export const lessonStatusEnum = pgEnum("lesson_status", [
  "scheduled",
  "cancelled",
  "completed",
]);

// export const subscriptionGroupsEnum = pgEnum("subscription_groups", [
//   "group_a",
//   "group_b",
//   "group_c",
// ]);
