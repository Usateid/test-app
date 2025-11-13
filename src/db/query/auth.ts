"use server";
import { validatedAction } from "@/db/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "../../index";
import z from "zod";
import { redirect } from "next/navigation";
import { userInformation } from "../schema";

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
  confirmPassword: z.string().min(8),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, name } = data;

  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    const authUser = response.user;

    await db.insert(userInformation).values({ userId: authUser.id });
  } catch (error) {
    return {
      ...data,
      error: "Failed to create user. Please try again.",
    };
  }

  redirect("/dashboard/profile");
});

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    return {
      ...data,
      message: "User signed in failed",
    };
  }
  redirect("/dashboard");
});

// export async function signIn(email: string, password: string) {
//   try {
//     const signInEmailResponse = await auth.api.signInEmail({
//       body: { email, password },
//     });
//     return {
//       response: "success",
//       message: "User signed in successfully",
//       user: signInEmailResponse,
//     };
//   } catch (error) {
//     return {
//       response: "error",
//       message: (error as Error).message,
//       user: null,
//     };
//   }
// }

export async function signOut() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    return {
      response: "error",
      message: (error as Error).message,
    };
  }
  redirect("/login");
}
