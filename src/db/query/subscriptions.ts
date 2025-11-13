"use server";
import { db } from "@/index";
import { z } from "zod";
import { subscriptions } from "@/db/schema/subscriptions";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getSubscriptions() {
  const responseSubscriptions = await db.select().from(subscriptions);
  return responseSubscriptions;
}

export async function getSubscriptionById(id: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id));
  return subscription;
}

const addSubscriptionSchema = z.object({
  name: z.string().min(1),
});

export const addSubscription = validatedAction(
  addSubscriptionSchema,
  async (data, formData) => {
    const { name } = data;
    try {
      await db.insert(subscriptions).values({ name });

      revalidatePath("/admin/subscriptions");

      return { success: true };
    } catch (error) {
      return {
        ...data,
        error: "Failed to add subscription. Please try again.",
        success: false,
      };
    }
  }
);

export const deleteSubscription = async (id: string) => {
  try {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
    revalidatePath("/admin/subscriptions");
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Failed to delete subscription. Please try again.",
      success: false,
    };
  }
};

const updateSubscriptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  entriesPerDay: z.coerce.number().min(1, "Must be at least 1"),
  entriesPerWeek: z.coerce.number().min(1, "Must be at least 1"),
  center: z.enum(["Vasto", "Pescara"]),
  durationInDays: z.coerce.number().min(1, "Must be at least 1"),
});

export const updateSubscription = validatedAction(
  updateSubscriptionSchema,
  async (data, formData) => {
    const { id, fromDate, toDate, ...updateData } = data;
    try {
      // Convert date strings to Date objects or set to null
      const values: {
        name: string;
        description?: string | null;
        price: number;
        fromDate: Date | null;
        toDate: Date | null;
        status: "active" | "inactive";
        entriesPerDay: number;
        entriesPerWeek: number;
        center: "Vasto" | "Pescara";
        durationInDays: number;
      } = {
        ...updateData,
        fromDate: fromDate ? new Date(fromDate) : null,
        toDate: toDate ? new Date(toDate) : null,
      };

      await db
        .update(subscriptions)
        .set(values)
        .where(eq(subscriptions.id, id));

      revalidatePath("/admin/subscriptions");
      return { success: true };
    } catch (error) {
      console.log(data);
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

export type SubscriptionType = Awaited<
  ReturnType<typeof getSubscriptions>
>[number];
