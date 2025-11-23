"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  updateProfile,
  type UserInformationWithEmailAndImage,
} from "@/db/query/user";
import { useActionState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function EditProfileForm({
  userProfile,
}: {
  userProfile: UserInformationWithEmailAndImage;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateProfile,
    {
      fieldErrors: {},
      ...userProfile,
      birthDate: userProfile.birthDate
        ? userProfile.birthDate.toISOString().split("T")[0]
        : null,
    }
  );

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/profile");
    }
  }, [state.success, router]);
  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {userProfile.image ? (
                <img
                  src={userProfile.image}
                  alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle2 className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Edit Profile
                </h1>
              </div>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </div>
        </div>

        <input type="hidden" name="userId" value={userProfile.userId || ""} />

        {/* Error Message */}
        {state.error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium">
              {state.error}
            </p>
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-lg border bg-card p-6">
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="firstName">Nome *</FieldLabel>
              <Input
                name="firstName"
                id="firstName"
                type="text"
                defaultValue={(state.firstName as string) || ""}
                placeholder="Nome"
                required
              />
              <FieldError>{state.fieldErrors?.firstName}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Cognome *</FieldLabel>
              <Input
                name="lastName"
                id="lastName"
                type="text"
                defaultValue={(state.lastName as string) || ""}
                placeholder="Cognome"
                required
              />
              <FieldError>{state.fieldErrors?.lastName}</FieldError>
            </Field>
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="phoneNumber">Telefono *</FieldLabel>
              <Input
                name="phoneNumber"
                id="phoneNumber"
                type="tel"
                required
                defaultValue={(state.phoneNumber as string) || ""}
                placeholder="Telefono"
              />
              <FieldError>{state.fieldErrors?.phoneNumber}</FieldError>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="address">Indirizzo *</FieldLabel>
              <Input
                name="address"
                id="address"
                type="text"
                required
                defaultValue={(state.address as string) || ""}
                placeholder="Indirizzo"
              />
              <FieldError>{state.fieldErrors?.address}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="city">Città *</FieldLabel>
              <Input
                name="city"
                id="city"
                type="text"
                required
                defaultValue={(state.city as string) || ""}
                placeholder="Città"
              />
              <FieldError>{state.fieldErrors?.city}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="state">Provincia *</FieldLabel>
              <Input
                name="state"
                id="state"
                type="text"
                required
                defaultValue={(state.state as string) || ""}
                placeholder="Provincia"
              />
              <FieldError>{state.fieldErrors?.state}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="zipCode">CAP *</FieldLabel>
              <Input
                name="zipCode"
                id="zipCode"
                type="text"
                required
                defaultValue={(state.zipCode as string) || ""}
                placeholder="CAP"
              />
              <FieldError>{state.fieldErrors?.zipCode}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="birthDate">Data di nascita *</FieldLabel>
              <Input
                name="birthDate"
                id="birthDate"
                type="date"
                required
                defaultValue={(state.birthDate as string) || ""}
              />
              <FieldError>{state.fieldErrors?.birthDate}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="taxCode">Codice fiscale *</FieldLabel>
              <Input
                name="taxCode"
                id="taxCode"
                type="text"
                required
                defaultValue={(state.taxCode as string) || ""}
                placeholder="Codice fiscale"
              />
              <FieldError>{state.fieldErrors?.taxCode}</FieldError>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}
