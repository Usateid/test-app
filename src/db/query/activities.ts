"use server";
import { db } from "@/index";
import { z } from "zod";
import { activities } from "@/db/schema/actitivites";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getActivities() {
  const responseActivities = await db.select().from(activities);
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
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  minParticipants: z.coerce.number().min(1, "Must be at least 1"),
  maxParticipants: z.coerce.number().min(1, "Must be at least 1"),
  redirectUrl: z.string().optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()).default(true),
  center: z.enum(["Vasto", "Pescara"]),
});

export const addActivity = validatedAction(
  addActivitySchema,
  async (data, formData) => {
    try {
      await db.insert(activities).values(data);

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
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  minParticipants: z.coerce.number().min(1, "Must be at least 1"),
  maxParticipants: z.coerce.number().min(1, "Must be at least 1"),
  redirectUrl: z.string().optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()),
  center: z.enum(["Vasto", "Pescara"]),
});

export const updateActivity = validatedAction(
  updateActivitySchema,
  async (data, formData) => {
    const { id, ...updateData } = data;
    try {
      await db.update(activities).set(updateData).where(eq(activities.id, id));

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
