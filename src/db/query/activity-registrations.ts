"use server";
import { db } from "@/index";
import { activityRegistrations, activities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasActiveSubscription } from "./user";

export async function isUserRegisteredForActivity(
  userId: string,
  activityId: string
) {
  const [registration] = await db
    .select()
    .from(activityRegistrations)
    .where(
      and(
        eq(activityRegistrations.userId, userId),
        eq(activityRegistrations.activityId, activityId)
      )
    );
  return !!registration;
}

export async function getUserActivityRegistrations(userId: string) {
  const registrations = await db
    .select({
      id: activityRegistrations.id,
      activityId: activities.id,
      activityName: activities.name,
      activityDescription: activities.description,
      activityImage: activities.image,
      activityDuration: activities.duration,
      center: activities.center,
      registeredAt: activityRegistrations.registeredAt,
    })
    .from(activityRegistrations)
    .innerJoin(activities, eq(activityRegistrations.activityId, activities.id))
    .where(eq(activityRegistrations.userId, userId))
    .orderBy(activityRegistrations.registeredAt);

  return registrations;
}

export async function registerUserToActivity(
  userId: string,
  activityId: string
) {
  try {
    // Check if user has active subscription
    const hasSubscription = await hasActiveSubscription(userId);
    if (!hasSubscription) {
      return {
        success: false,
        error: "Devi avere un abbonamento attivo per registrarti alle attività",
      };
    }

    // Check if already registered
    const alreadyRegistered = await isUserRegisteredForActivity(
      userId,
      activityId
    );
    if (alreadyRegistered) {
      return {
        success: false,
        error: "Sei già registrato a questa attività",
      };
    }

    // Register user
    await db.insert(activityRegistrations).values({
      userId,
      activityId,
    });

    revalidatePath("/dashboard/booking");
    return {
      success: true,
      message: "Registrazione completata con successo!",
    };
  } catch (error) {
    console.error("Error registering user to activity:", error);
    return {
      success: false,
      error: "Si è verificato un errore durante la registrazione. Riprova.",
    };
  }
}

export async function cancelActivityRegistration(
  userId: string,
  activityId: string
) {
  try {
    await db
      .delete(activityRegistrations)
      .where(
        and(
          eq(activityRegistrations.userId, userId),
          eq(activityRegistrations.activityId, activityId)
        )
      );

    revalidatePath("/dashboard/booking");
    return {
      success: true,
      message: "Registrazione cancellata con successo",
    };
  } catch (error) {
    console.error("Error canceling activity registration:", error);
    return {
      success: false,
      error: "Si è verificato un errore durante la cancellazione. Riprova.",
    };
  }
}
