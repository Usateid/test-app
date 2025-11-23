"use server";
import { db } from "@/index";
import {
  userInformation,
  user,
  subscriptions,
  userSubscriptions,
} from "../schema";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import { validatedAction } from "../utils";
import { revalidatePath } from "next/cache";

export type UserInformationWithEmailAndImage = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  role: "user" | "teacher" | "admin";
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  birthDate: Date | null;
  taxCode: string | null;
  email: string;
  image: string | null;
};

export async function getUserInformation(
  userId: string
): Promise<UserInformationWithEmailAndImage | null> {
  const [userInfo] = await db
    .select({
      userId: userInformation.userId,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      role: userInformation.role,
      phoneNumber: userInformation.phoneNumber,
      address: userInformation.address,
      city: userInformation.city,
      zipCode: userInformation.zipCode,
      country: userInformation.country,
      birthDate: userInformation.birthDate,
      taxCode: userInformation.taxCode,
      email: user.email,
      image: user.image,
    })
    .from(userInformation)
    .innerJoin(user, eq(userInformation.userId, user.id))
    .where(eq(userInformation.userId, userId));

  if (!userInfo) {
    return null;
  }

  return {
    ...userInfo,
    userId: userInfo.userId as string,
    email: userInfo.email as string,
  };
}

export async function hasActiveSubscription(userId: string) {
  // Check if user has at least one active subscription that hasn't expired
  const activeUserSubscriptions = await db
    .select({
      id: userSubscriptions.id,
      subscriptionStatus: subscriptions.status,
      expiresAt: userSubscriptions.expiresAt,
    })
    .from(userSubscriptions)
    .innerJoin(
      subscriptions,
      eq(userSubscriptions.subscriptionId, subscriptions.id)
    )
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(subscriptions.status, "active"),
        gt(userSubscriptions.expiresAt, new Date())
      )
    )
    .limit(1);

  return activeUserSubscriptions.length > 0;
}

export async function getUserSubscriptions(userId: string) {
  const subscriptionsList = await db
    .select({
      id: userSubscriptions.id,
      subscriptionId: subscriptions.id,
      subscriptionName: subscriptions.name,
      subscriptionStatus: subscriptions.status,
      activatedAt: userSubscriptions.activatedAt,
      expiresAt: userSubscriptions.expiresAt,
      price: subscriptions.price,
      center: subscriptions.center,
    })
    .from(userSubscriptions)
    .innerJoin(
      subscriptions,
      eq(userSubscriptions.subscriptionId, subscriptions.id)
    )
    .where(eq(userSubscriptions.userId, userId))
    .orderBy(userSubscriptions.activatedAt);

  return subscriptionsList;
}

export type UserDataReturnType = Awaited<
  ReturnType<typeof getUserById>
>["userInformation"];

export async function getUserById(userId: string) {
  const [result] = await db
    .select({
      userInformation: userInformation,
    })
    .from(userInformation)
    .innerJoin(user, eq(userInformation.userId, user.id))
    .where(eq(userInformation.userId, userId));
  return result;
}

export async function getUsers() {
  const users = await db
    .select({
      userId: userInformation.userId,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      role: userInformation.role,
      email: user.email,
      image: user.image,
      createdAt: userInformation.createdAt,
      updatedAt: userInformation.updatedAt,
    })
    .from(userInformation)
    .innerJoin(user, eq(userInformation.userId, user.id))
    .where(eq(userInformation.role, "user"))
    .orderBy(userInformation.createdAt);
  return users;
}

export async function getTeachers() {
  const teachers = await db
    .select({
      id: user.id,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      email: user.email,
    })
    .from(userInformation)
    .innerJoin(user, eq(userInformation.userId, user.id))
    .where(eq(userInformation.role, "teacher"));

  return teachers.map((teacher) => ({
    id: teacher.id,
    name:
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      "Unknown",
  }));
}

const updateUserSchema = z.object({
  userId: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(12, "Address must be at least 12 characters long"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  taxCode: z.string().min(1, "Tax code is required"),
});

export const updateUser = validatedAction(
  updateUserSchema,
  async (data, formData) => {
    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
      birthDate,
      taxCode,
    } = data;
    try {
      // Update user information table
      await db
        .update(userInformation)
        .set({
          firstName,
          lastName,
          phoneNumber: phoneNumber || null,
          address: address || null,
          city: city || null,
          zipCode: zipCode || null,
          country: country || null,
          birthDate: birthDate ? new Date(birthDate) : null,
          taxCode: taxCode || null,
        })
        .where(eq(userInformation.userId, userId));

      await db
        .update(user)
        .set({
          name: `${firstName} ${lastName}`,
        })
        .where(eq(user.id, userId));

      revalidatePath("/admin/users");
      return { ...data, success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user. Please try again.",
        success: false,
      };
    }
  }
);

const updateProfileSchema = z.object({
  userId: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(12, "Address must be at least 12 characters long"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  birthDate: z.string().optional(),
  taxCode: z.string().min(1, "Tax code is required"),
  state: z.string().min(1, "State is required"),
});

export const updateProfile = validatedAction(
  updateProfileSchema,
  async (data, formData) => {
    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
      birthDate,
      taxCode,
    } = data;
    try {
      // Update user information table
      await db
        .update(userInformation)
        .set({
          firstName,
          lastName,
          phoneNumber: phoneNumber || null,
          address: address || null,
          city: city || null,
          zipCode: zipCode || null,
          country: country || null,
          birthDate: birthDate ? new Date(birthDate) : null,
          taxCode: taxCode || null,
        })
        .where(eq(userInformation.userId, userId));

      // Update user name in the user table
      await db
        .update(user)
        .set({
          name: `${firstName} ${lastName}`,
        })
        .where(eq(user.id, userId));

      revalidatePath("/dashboard/profile");
      return { ...data, success: true };
    } catch (error) {
      return {
        ...data,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        success: false,
      };
    }
  }
);
