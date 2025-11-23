"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ActionState } from "@/db/utils";
import { signUp } from "@/db/query/auth";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onForgotPassword?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUp,
    {}
  );

  return (
    <div className="sm:rounded-lg sm:border sm:bg-card sm:text-card-foreground sm:shadow-sm w-full max-w-md mx-auto">
      {/* <div className="flex flex-col items-center justify-center gap-[10px] py-[20px]">
      </div> */}
      <div className="p-6">
        <form action={formAction} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                defaultValue={state.name as string}
                disabled={pending}
              />
              <FieldError>{state.fieldErrors?.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                defaultValue={state.email as string}
                disabled={pending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                defaultValue={state.password as string}
                disabled={pending}
              />
              <FieldError>{state.fieldErrors?.password}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                defaultValue={state.confirmPassword as string}
                disabled={pending}
              />
              <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
            </Field>
          </FieldGroup>

          {state.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button type="submit" className="w-full my-[10px]" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrati
          </Button>

          {onSwitchToLogin && (
            <div className="text-center text-sm flex items-center justify-center gap-2">
              <span className="text-center text-muted-foreground">
                Hai già un account?
              </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="cursor-pointer hover:underline"
                disabled={pending}
              >
                Accedi ora
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
