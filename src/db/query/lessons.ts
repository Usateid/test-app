"use server";
import { db } from "@/index";
import { z } from "zod";
import { lessons } from "@/db/schema/lessons";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";
import { eq, gte, lte, and, or, lt, gt, ne } from "drizzle-orm";

export async function getLessons() {
  const responseLessons = await db.select().from(lessons);
  return responseLessons;
}

export async function getScheduledLessons() {
  const responseLessons = await db
    .select()
    .from(lessons)
    .where(
      and(eq(lessons.status, "scheduled"), gte(lessons.startTime, new Date()))
    );
  return responseLessons;
}
export async function getLessonsByDateRange(startDate: Date, endDate: Date) {
  const responseLessons = await db
    .select()
    .from(lessons)
    .where(
      and(gte(lessons.startTime, startDate), lte(lessons.startTime, endDate))
    );
  return responseLessons;
}

export async function getLessonById(id: string) {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
  return lesson;
}

// Helper function to check if a lesson time slot overlaps with existing lessons
async function checkLessonOverlap(
  startTime: Date,
  endTime: Date,
  excludeId?: string
) {
  const conditions = [
    // New lesson starts before existing lesson ends AND new lesson ends after existing lesson starts
    lt(lessons.startTime, endTime),
    gt(lessons.endTime, startTime),
  ];

  // Exclude the lesson being updated (if provided)
  if (excludeId) {
    conditions.push(ne(lessons.id, excludeId));
  }

  const overlappingLessons = await db
    .select()
    .from(lessons)
    .where(and(...conditions));

  return overlappingLessons;
}

const addLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  teacherId: z.string().optional(),
  startTime: z.string(),
  duration: z.string(),
  center: z.enum(["Vasto", "Pescara"]),
  status: z.enum(["scheduled", "cancelled", "completed"]).default("scheduled"),
  isRecurring: z.string().optional(),
  recurringDays: z.string().optional(),
  recurringMonths: z.string().optional(),
});

export const addLesson = validatedAction(
  addLessonSchema,
  async (data, formData) => {
    try {
      const startTime = new Date(data.startTime);
      const durationMinutes = parseInt(data.duration);

      // Calculate end time based on duration
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const baseLesson: {
        title: string;
        description?: string | null;
        teacherId: string | null;
        center: "Vasto" | "Pescara";
        status: "scheduled" | "cancelled" | "completed";
      } = {
        title: data.title,
        description: data.description,
        teacherId: data.teacherId || null,
        center: data.center,
        status: data.status,
      };

      const lessonsToCreate = [];

      // Check if this is a recurring lesson
      if (data.isRecurring === "true" && data.recurringDays) {
        const selectedDays = data.recurringDays
          .split(",")
          .map((d) => parseInt(d));
        const months = parseInt(data.recurringMonths || "6");

        // Calculate end date (N months from start)
        const recurringEndDate = new Date(startTime);
        recurringEndDate.setMonth(recurringEndDate.getMonth() + months);

        // Get the duration in milliseconds
        const durationMs = durationMinutes * 60000;

        // Iterate through each day until end date
        const currentDate = new Date(startTime);
        currentDate.setHours(
          startTime.getHours(),
          startTime.getMinutes(),
          0,
          0
        );

        while (currentDate <= recurringEndDate) {
          // Check if current day matches any selected recurring day
          if (selectedDays.includes(currentDate.getDay())) {
            const lessonStart = new Date(currentDate);
            const lessonEnd = new Date(currentDate.getTime() + durationMs);

            lessonsToCreate.push({
              ...baseLesson,
              startTime: lessonStart,
              endTime: lessonEnd,
            });
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Single lesson
        lessonsToCreate.push({
          ...baseLesson,
          startTime,
          endTime,
        });
      }

      // Check for overlapping lessons before inserting
      for (const lesson of lessonsToCreate) {
        const overlapping = await checkLessonOverlap(
          lesson.startTime,
          lesson.endTime
        );

        if (overlapping.length > 0) {
          const conflictDate = lesson.startTime.toLocaleString("it-IT", {
            dateStyle: "short",
            timeStyle: "short",
          });
          const existingDate = overlapping[0].startTime.toLocaleString(
            "it-IT",
            {
              dateStyle: "short",
              timeStyle: "short",
            }
          );
          return {
            ...data,
            error: `Conflitto di orario: esiste già una lezione "${overlapping[0].title}" il ${existingDate}. La nuova lezione è prevista per ${conflictDate}.`,
            success: false,
          };
        }
      }

      // Insert all lessons
      await db.insert(lessons).values(lessonsToCreate);

      revalidatePath("/admin/lessons");

      return { success: true };
    } catch (error) {
      console.error("Failed to add lesson:", error);
      return {
        ...data,
        error: "Failed to add lesson. Please try again.",
        success: false,
      };
    }
  }
);

export const deleteLesson = async (id: string) => {
  try {
    await db.delete(lessons).where(eq(lessons.id, id));
    revalidatePath("/admin/lessons");
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete lesson. Please try again.",
      success: false,
    };
  }
};

const updateLessonSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  teacherId: z.string().optional(),
  startTime: z.string(),
  duration: z.string(),
  center: z.enum(["Vasto", "Pescara"]),
  status: z.enum(["scheduled", "cancelled", "completed"]),
});

export const updateLesson = validatedAction(
  updateLessonSchema,
  async (data, formData) => {
    const { id, ...updateData } = data;
    try {
      const startTime = new Date(updateData.startTime);
      const durationMinutes = parseInt(updateData.duration);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const values: {
        title: string;
        description?: string | null;
        teacherId: string | null;
        center: "Vasto" | "Pescara";
        status: "scheduled" | "cancelled" | "completed";
        startTime: Date;
        endTime: Date;
      } = {
        title: updateData.title,
        description: updateData.description,
        teacherId: updateData.teacherId || null,
        center: updateData.center,
        status: updateData.status,
        startTime,
        endTime,
      };

      if (!updateData.teacherId) {
        values.teacherId = null;
      }

      // Check for overlapping lessons before updating
      const overlapping = await checkLessonOverlap(startTime, endTime, id);

      if (overlapping.length > 0) {
        const conflictDate = startTime.toLocaleString("it-IT", {
          dateStyle: "short",
          timeStyle: "short",
        });
        const existingDate = overlapping[0].startTime.toLocaleString("it-IT", {
          dateStyle: "short",
          timeStyle: "short",
        });
        return {
          ...data,
          error: `Conflitto di orario: esiste già una lezione "${overlapping[0].title}" il ${existingDate}. La nuova lezione è prevista per ${conflictDate}.`,
          success: false,
        };
      }

      await db.update(lessons).set(values).where(eq(lessons.id, id));

      revalidatePath("/admin/lessons");
      return { success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update lesson. Please try again.",
        success: false,
      };
    }
  }
);
