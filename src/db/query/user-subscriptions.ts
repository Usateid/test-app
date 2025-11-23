"use server";
import { db } from "@/index";
import {
  userSubscriptions,
  subscriptions,
  lessons,
  lessonRegistrations,
} from "../schema";
import { eq, and, gte } from "drizzle-orm";
import { z } from "zod";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";

export async function getUserActiveSubscriptions(userId: string) {
  return await db
    .select({
      id: userSubscriptions.id,
      userId: userSubscriptions.userId,
      subscriptionId: subscriptions.id,
      name: subscriptions.name,
      description: subscriptions.description,
      price: subscriptions.price,
      center: subscriptions.center,
      entriesPerDay: subscriptions.entriesPerDay,
      entriesPerWeek: subscriptions.entriesPerWeek,
      durationInDays: subscriptions.durationInDays,
      status: subscriptions.status,
      activatedAt: userSubscriptions.activatedAt,
      expiresAt: userSubscriptions.expiresAt,
      createdAt: userSubscriptions.createdAt,
      updatedAt: userSubscriptions.updatedAt,
    })
    .from(userSubscriptions)
    .innerJoin(
      subscriptions,
      eq(userSubscriptions.subscriptionId, subscriptions.id)
    )
    .where(eq(userSubscriptions.userId, userId))
    .orderBy(userSubscriptions.expiresAt);
}

const addUserSubscriptionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  durationInDays: z.coerce.number().min(1, "Duration must be at least 1 day"),
});

export const addUserSubscription = validatedAction(
  addUserSubscriptionSchema,
  async (data, formData) => {
    const { userId, subscriptionId, durationInDays } = data;
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationInDays);

      await db.insert(userSubscriptions).values({
        userId,
        subscriptionId,
        expiresAt,
      });

      revalidatePath("/admin/users");
      revalidatePath("/dashboard/profile");
      return { success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add subscription to user. Please try again.",
        success: false,
      };
    }
  }
);

export const removeUserSubscription = async (userSubscriptionId: string) => {
  try {
    await db
      .delete(userSubscriptions)
      .where(eq(userSubscriptions.id, userSubscriptionId));

    revalidatePath("/admin/users");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to remove subscription. Please try again.",
      success: false,
    };
  }
};

const updateUserSubscriptionSchema = z.object({
  id: z.string(),
  expiresAt: z.string().min(1, "Expiration date is required"),
});

export const updateUserSubscription = validatedAction(
  updateUserSubscriptionSchema,
  async (data, formData) => {
    const { id, expiresAt } = data;
    try {
      await db
        .update(userSubscriptions)
        .set({
          expiresAt: new Date(expiresAt),
        })
        .where(eq(userSubscriptions.id, id));

      revalidatePath("/admin/users");
      revalidatePath("/dashboard/profile");

      return { success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update subscription. Please try again.",
        success: false,
      };
    }
  }
);

export const getUserNextLessons = async (userId: string) => {
  const nextLessons = await db
    .select()
    .from(lessonRegistrations)
    .innerJoin(lessons, eq(lessonRegistrations.lessonId, lessons.id))
    .where(
      and(
        eq(lessonRegistrations.userId, userId),
        gte(lessons.startTime, new Date()),
        eq(lessons.status, "scheduled")
      )
    );
  return nextLessons;
};

export type UserNextLessonType = Awaited<
  ReturnType<typeof getUserNextLessons>
>[number];

export type UserSubscriptionType = Awaited<
  ReturnType<typeof getUserActiveSubscriptions>
>[number];
