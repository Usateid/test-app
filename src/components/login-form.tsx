"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/db/query/auth";
import { useActionState, useState } from "react";
import { ActionState } from "@/db/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSignUp, setIsSignUp] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    isSignUp ? signUp : signIn,
    { fieldErrors: {} }
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{isSignUp ? "Sign up" : "Login"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your email below to sign up for an account"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <FieldGroup>
              {isSignUp && (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    name="name"
                    type="text"
                    id="name"
                    defaultValue={(state.name as string) || ""}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500"
                    required
                  />
                  <FieldError>{state.fieldErrors?.name}</FieldError>
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  defaultValue={(state.email as string) || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500"
                  required
                />
                <FieldError>{state.fieldErrors?.email}</FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  defaultValue={(state.password as string) || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500"
                  required
                />
                <FieldError>{state.fieldErrors?.password}</FieldError>
              </Field>
              {isSignUp && (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    defaultValue={(state.confirmPassword as string) || ""}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500"
                    required
                  />
                  <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
                </Field>
              )}
            </FieldGroup>

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
            >
              {pending ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Field>
        <FieldDescription
          className="text-center"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          Don&apos;t have an account? <a href="#">Sign up</a>
        </FieldDescription>
      </Field>
    </div>
  );
}
