"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { registerTeacher } from "@/db/query/teacher-invitation";
import { useActionState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";

interface TeacherRegistrationFormProps {
  token: string;
}

export default function TeacherRegistrationForm({
  token,
}: TeacherRegistrationFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    registerTeacher,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success) {
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    }
  }, [state.success, router]);

  if (state.success) {
    return (
      <div className="text-center space-y-4 p-6 border rounded-lg bg-green-50 dark:bg-green-900/20">
        <div className="text-green-600 dark:text-green-400">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Registration Successful!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your account has been created. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            minLength={8}
          />
          <FieldError>{state.fieldErrors?.password}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            minLength={8}
          />
          <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
        </Field>
      </FieldGroup>

      {state.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating Account..." : "Complete Registration"}
      </Button>
    </form>
  );
}
