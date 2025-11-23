"use server";
import { validatedAction } from "@/db/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "../../index";
import z from "zod";
import { redirect } from "next/navigation";
import { userInformation } from "../schema";
import { APIError } from "better-auth/api";
import { ERROR_MESSAGES } from "@/utils/const";

function getErrorMessage(code: keyof typeof ERROR_MESSAGES | undefined) {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return "Qualcosa è andato storto";
}

const signUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, { message: "La password deve essere almeno 8 caratteri" }),
    name: z.string().min(3, { message: "Il nome è obbligatorio" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La password deve essere almeno 8 caratteri" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, name, confirmPassword } = data;

  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    const authUser = response.user;

    await db
      .insert(userInformation)
      .values({ userId: authUser.id, firstName: name });
  } catch (error) {
    let message = "";

    if (error instanceof APIError) {
      message = getErrorMessage(
        error.body?.code as keyof typeof ERROR_MESSAGES
      );
    }
    return {
      ...data,
      success: false,
      message,
    };
  }
  redirect("/dashboard/profile/welcome");
});

const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "La password deve essere almeno 8 caratteri" }),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;
  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    let message = "Credenziali non valide";

    if (error instanceof APIError) {
      message = getErrorMessage(
        error.body?.code as keyof typeof ERROR_MESSAGES
      );
    }

    return {
      ...data,
      success: false,
      message,
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
