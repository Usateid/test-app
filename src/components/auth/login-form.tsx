"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ActionState } from "@/db/utils";
import { signIn } from "@/db/query/auth";
import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/field";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({
  onSwitchToRegister,
  onForgotPassword,
}: LoginFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    { fieldErrors: {} }
  );
  return (
    <div className="sm:rounded-lg sm:border sm:bg-card sm:text-card-foreground sm:shadow-sm w-full max-w-md mx-auto">
      {/* <div className="flex flex-col items-center justify-center gap-[10px] py-[20px]">
        {JSON.stringify(state)}
      </div> */}
      <div className="p-6">
        <form action={formAction} className="space-y-4">
          <FieldGroup>
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
              <FieldLabel htmlFor="password">
                <div className="flex w-full justify-between">
                  <span>Password</span>
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-xs text-muted-foreground hover:underline cursor-pointer"
                      disabled={pending}
                    >
                      Password dimenticata?
                    </button>
                  )}
                </div>
              </FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                defaultValue={state.password as string}
                disabled={pending}
              />
              <FieldError>{state.fieldErrors?.password}</FieldError>
            </Field>
          </FieldGroup>

          {state.message && (
            <p className="text-sm text-destructive-foreground">
              {state.message}
            </p>
          )}

          <Button type="submit" className="w-full my-[10px]" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accedi
          </Button>

          {onSwitchToRegister && (
            <div className="text-center text-sm flex items-center justify-center gap-2">
              <span className="text-center text-muted-foreground">
                Non hai un account?
              </span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="cursor-pointer hover:underline"
                disabled={pending}
              >
                Registrati ora
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
