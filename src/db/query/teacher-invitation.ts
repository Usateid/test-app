"use server";
import { db } from "@/index";
import { teacherInvitation, user, userInformation } from "../schema";
import { eq, and } from "drizzle-orm";
import { validatedAction, ActionState } from "../utils";
import { z } from "zod";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const createTeacherInvitationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export const createTeacherInvitation = validatedAction(
  createTeacherInvitationSchema,
  async (data) => {
    try {
      // Check if teacher invitation already exists
      const existing = await db
        .select()
        .from(teacherInvitation)
        .where(
          and(
            eq(teacherInvitation.email, data.email),
            eq(teacherInvitation.used, false)
          )
        );

      if (existing.length > 0) {
        return {
          error: "An invitation for this email already exists",
          fieldErrors: {},
        };
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, data.email));

      if (existingUser.length > 0) {
        return {
          error: "A user with this email already exists",
          fieldErrors: {},
        };
      }

      // Generate unique token
      const token = randomBytes(32).toString("hex");
      const id = randomBytes(16).toString("hex");

      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create invitation
      await db.insert(teacherInvitation).values({
        id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token,
        expiresAt,
        used: false,
      });

      // Generate magic link
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const magicLink = `${baseUrl}/register/teacher?token=${token}`;

      // TODO: Send email with magic link
      // For now, we'll just return it in the console/response
      console.log("Magic link for teacher registration:", magicLink);

      revalidatePath("/admin/teachers");

      return {
        success: true,
        magicLink,
        fieldErrors: {},
      };
    } catch (error) {
      console.error("Error creating teacher invitation:", error);
      return {
        error: "Failed to create teacher invitation",
        fieldErrors: {},
      };
    }
  }
);

export async function getTeacherInvitations() {
  try {
    const invitations = await db
      .select()
      .from(teacherInvitation)
      .where(eq(teacherInvitation.used, false));

    return invitations;
  } catch (error) {
    console.error("Error fetching teacher invitations:", error);
    return [];
  }
}

export async function getTeacherInvitationByToken(token: string) {
  try {
    const [invitation] = await db
      .select()
      .from(teacherInvitation)
      .where(
        and(
          eq(teacherInvitation.token, token),
          eq(teacherInvitation.used, false)
        )
      );

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      return null;
    }

    return invitation;
  } catch (error) {
    console.error("Error fetching invitation by token:", error);
    return null;
  }
}

const registerTeacherSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerTeacher = validatedAction(
  registerTeacherSchema,
  async (data) => {
    try {
      // Get invitation
      const invitation = await getTeacherInvitationByToken(data.token);

      if (!invitation) {
        return {
          error: "Invalid or expired invitation token",
          fieldErrors: {},
        };
      }

      // Create user account with better-auth
      const response = await auth.api.signUpEmail({
        body: {
          name: `${invitation.firstName} ${invitation.lastName}`,
          email: invitation.email,
          password: data.password,
        },
      });

      const authUser = response.user;

      // Create user information with teacher role
      await db.insert(userInformation).values({
        userId: authUser.id,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        role: "teacher",
      });

      // Mark invitation as used
      await db
        .update(teacherInvitation)
        .set({ used: true })
        .where(eq(teacherInvitation.id, invitation.id));

      revalidatePath("/admin/teachers");

      return {
        success: true,
        fieldErrors: {},
      };
    } catch (error) {
      console.error("Error registering teacher:", error);
      return {
        error: "Failed to register teacher. The email may already be in use.",
        fieldErrors: {},
      };
    }
  }
);

export async function deleteTeacherInvitation(id: string) {
  try {
    await db.delete(teacherInvitation).where(eq(teacherInvitation.id, id));

    revalidatePath("/admin/teachers");

    return { success: true };
  } catch (error) {
    console.error("Error deleting teacher invitation:", error);
    return { success: false, error: "Failed to delete invitation" };
  }
}
