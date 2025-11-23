"use server";
import { db } from "@/index";
import { z } from "zod";
import { activities } from "@/db/schema/actitivites";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getActivities({
  isActive = true,
  limit = 10,
}: {
  isActive?: boolean;
  limit?: number;
}) {
  const responseActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.isActive, isActive))
    .limit(limit);
  return responseActivities;
}

export async function getActivityById(id: string) {
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id));
  return activity;
}

const addActivitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  minParticipants: z.coerce.number().min(1, "Must be at least 1"),
  maxParticipants: z.coerce.number().min(1, "Must be at least 1"),
  teacherId: z.string().optional(),
  location: z.string().optional(),
  redirectUrl: z.string().optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()).default(true),
  center: z.enum(["Vasto", "Pescara"]),
});

export const addActivity = validatedAction(
  addActivitySchema,
  async (data, formData) => {
    try {
      await db.insert(activities).values({
        ...data,
        date: new Date(data.date),
        teacherId:
          data.teacherId && data.teacherId.trim() !== ""
            ? data.teacherId
            : null,
      });

      revalidatePath("/admin/activities");

      return { success: true };
    } catch (error) {
      console.log(error);
      return {
        ...data,
        error: "Failed to add activity. Please try again.",
        success: false,
      };
    }
  }
);

export const deleteActivity = async (id: string) => {
  try {
    await db.delete(activities).where(eq(activities.id, id));
    revalidatePath("/admin/activities");
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete activity. Please try again.",
      success: false,
    };
  }
};

const updateActivitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  minParticipants: z.coerce.number().min(1, "Must be at least 1"),
  maxParticipants: z.coerce.number().min(1, "Must be at least 1"),
  teacherId: z.string().optional(),
  location: z.string().optional(),
  redirectUrl: z.string().optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()),
  center: z.enum(["Vasto", "Pescara"]),
});

export const updateActivity = validatedAction(
  updateActivitySchema,
  async (data, formData) => {
    const { id, ...updateData } = data;
    try {
      await db
        .update(activities)
        .set({
          ...updateData,
          date: new Date(updateData.date),
          teacherId:
            updateData.teacherId && updateData.teacherId.trim() !== ""
              ? updateData.teacherId
              : null,
        })
        .where(eq(activities.id, id));

      revalidatePath("/admin/activities");
      return { success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update activity. Please try again.",
        success: false,
      };
    }
  }
);
