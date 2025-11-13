"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/db/query/user";
import { useActionState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { type UserProfileData } from "@/utils/types/user";

export default function EditProfileForm({
  userProfile,
}: {
  userProfile: UserProfileData;
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
          <div className="flex">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" type="button">
                <ArrowLeft className="size-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
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

        <input type="hidden" name="userId" value={userProfile.userId} />

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
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
              <Input
                name="firstName"
                id="firstName"
                type="text"
                defaultValue={(state.firstName as string) || ""}
                placeholder="First name"
                required
              />
              <FieldError>{state.fieldErrors?.firstName}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
              <Input
                name="lastName"
                id="lastName"
                type="text"
                defaultValue={(state.lastName as string) || ""}
                placeholder="Last name"
                required
              />
              <FieldError>{state.fieldErrors?.lastName}</FieldError>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                placeholder="email@example.com"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </Field>
          </FieldGroup>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
              <Input
                name="phoneNumber"
                id="phoneNumber"
                type="tel"
                defaultValue={(state.phoneNumber as string) || ""}
                placeholder="+39 123 456 7890"
              />
              <FieldError>{state.fieldErrors?.phoneNumber}</FieldError>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                name="address"
                id="address"
                type="text"
                defaultValue={(state.address as string) || ""}
                placeholder="Street address"
              />
              <FieldError>{state.fieldErrors?.address}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                name="city"
                id="city"
                type="text"
                defaultValue={(state.city as string) || ""}
                placeholder="City"
              />
              <FieldError>{state.fieldErrors?.city}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="state">State/Province</FieldLabel>
              <Input
                name="state"
                id="state"
                type="text"
                defaultValue={(state.state as string) || ""}
                placeholder="State or Province"
              />
              <FieldError>{state.fieldErrors?.state}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="zipCode">ZIP/Postal Code</FieldLabel>
              <Input
                name="zipCode"
                id="zipCode"
                type="text"
                defaultValue={(state.zipCode as string) || ""}
                placeholder="ZIP or Postal Code"
              />
              <FieldError>{state.fieldErrors?.zipCode}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Input
                name="country"
                id="country"
                type="text"
                defaultValue={(state.country as string) || ""}
                placeholder="Country"
              />
              <FieldError>{state.fieldErrors?.country}</FieldError>
            </Field>
          </FieldGroup>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="birthDate">Date of Birth</FieldLabel>
              <Input
                name="birthDate"
                id="birthDate"
                type="date"
                defaultValue={(state.birthDate as string) || ""}
              />
              <FieldError>{state.fieldErrors?.birthDate}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="taxCode">Tax Code / Fiscal Code</FieldLabel>
              <Input
                name="taxCode"
                id="taxCode"
                type="text"
                defaultValue={(state.taxCode as string) || ""}
                placeholder="Tax identification code"
              />
              <FieldError>{state.fieldErrors?.taxCode}</FieldError>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}
