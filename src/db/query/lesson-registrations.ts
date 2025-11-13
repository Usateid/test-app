"use server";
import { db } from "@/index";
import {
  lessonRegistrations,
  lessons,
  user,
  userInformation,
} from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasActiveSubscription } from "./user";

export async function isUserRegisteredForLesson(
  userId: string,
  lessonId: string
) {
  const [registration] = await db
    .select()
    .from(lessonRegistrations)
    .where(
      and(
        eq(lessonRegistrations.userId, userId),
        eq(lessonRegistrations.lessonId, lessonId)
      )
    );
  return !!registration;
}
export type UserLessonRegistrationType = Awaited<
  ReturnType<typeof getUserLessonRegistrations>
>[number];

export async function getUserLessonRegistrations(
  userId: string,
  limit: number = 1
) {
  const registrations = await db
    .select({
      id: lessonRegistrations.id,
      lessonId: lessons.id,
      title: lessons.title,
      description: lessons.description,
      startTime: lessons.startTime,
      endTime: lessons.endTime,
      center: lessons.center,
      status: lessons.status,
    })
    .from(lessonRegistrations)
    .innerJoin(lessons, eq(lessonRegistrations.lessonId, lessons.id))
    .where(eq(lessonRegistrations.userId, userId))
    .orderBy(lessons.startTime)
    .limit(limit);

  return registrations;
}

export async function getUpcomingUserLessonRegistrations(userId: string) {
  const now = new Date();
  const registrations = await db
    .select({
      id: lessonRegistrations.id,
      lessonId: lessons.id,
      lessonTitle: lessons.title,
      lessonDescription: lessons.description,
      startTime: lessons.startTime,
      endTime: lessons.endTime,
      center: lessons.center,
      status: lessons.status,
      registeredAt: lessonRegistrations.registeredAt,
    })
    .from(lessonRegistrations)
    .innerJoin(lessons, eq(lessonRegistrations.lessonId, lessons.id))
    .where(
      and(
        eq(lessonRegistrations.userId, userId),
        gte(lessons.startTime, now),
        eq(lessons.status, "scheduled")
      )
    )
    .orderBy(lessons.startTime);

  return registrations;
}

export async function getLessonRegistrations(lessonId: string) {
  const registrations = await db
    .select({
      userId: user.id,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      email: user.email,
      registeredAt: lessonRegistrations.registeredAt,
    })
    .from(lessonRegistrations)
    .innerJoin(user, eq(lessonRegistrations.userId, user.id))
    .innerJoin(userInformation, eq(user.id, userInformation.userId))
    .where(eq(lessonRegistrations.lessonId, lessonId))
    .orderBy(lessonRegistrations.registeredAt);

  return registrations;
}

export async function registerUserToLesson(userId: string, lessonId: string) {
  try {
    // Check if user has active subscription
    const hasSubscription = await hasActiveSubscription(userId);
    if (!hasSubscription) {
      return {
        success: false,
        error: "Devi avere un abbonamento attivo per registrarti alle lezioni",
      };
    }

    // Check if lesson exists and is scheduled
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));

    if (!lesson) {
      return {
        success: false,
        error: "Lezione non trovata",
      };
    }

    if (lesson.status !== "scheduled") {
      return {
        success: false,
        error: "Questa lezione non è più disponibile per la registrazione",
      };
    }

    // Check if lesson is in the future
    if (new Date(lesson.startTime) < new Date()) {
      return {
        success: false,
        error: "Non puoi registrarti a una lezione già iniziata",
      };
    }

    // Check if already registered
    const alreadyRegistered = await isUserRegisteredForLesson(userId, lessonId);
    if (alreadyRegistered) {
      return {
        success: false,
        error: "Sei già registrato a questa lezione",
      };
    }

    // Register user
    await db.insert(lessonRegistrations).values({
      userId,
      lessonId,
    });

    revalidatePath("/dashboard/booking");
    return {
      success: true,
      message: "Registrazione alla lezione completata con successo!",
    };
  } catch (error) {
    console.error("Error registering user to lesson:", error);
    return {
      success: false,
      error: "Si è verificato un errore durante la registrazione. Riprova.",
    };
  }
}

export async function cancelLessonRegistration(
  userId: string,
  lessonId: string
) {
  try {
    // Check if lesson has already started
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));

    if (lesson && new Date(lesson.startTime) < new Date()) {
      return {
        success: false,
        error:
          "Non puoi cancellare una registrazione per una lezione già iniziata",
      };
    }

    await db
      .delete(lessonRegistrations)
      .where(
        and(
          eq(lessonRegistrations.userId, userId),
          eq(lessonRegistrations.lessonId, lessonId)
        )
      );

    revalidatePath("/dashboard/booking");
    return {
      success: true,
      message: "Registrazione cancellata con successo",
    };
  } catch (error) {
    console.error("Error canceling lesson registration:", error);
    return {
      success: false,
      error: "Si è verificato un errore durante la cancellazione. Riprova.",
    };
  }
}
