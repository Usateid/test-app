"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/db/query/user";
import { useActionState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCircle } from "lucide-react";
import type { UserDataReturnType } from "@/db/query/user";
import { useTranslations } from "next-intl";
import FormButton from "@/components/common/form-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditUserForm({
  user,
}: {
  user: UserDataReturnType & {
    id: string;
  };
}) {
  const t = useTranslations("profile.edit");

  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateUser,
    { fieldErrors: {}, ...user }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(t("userUpdated"));
      router.push("/admin/users");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <FormButton pending={pending} />
      </div>
      <div className="space-y-8">
        <input type="hidden" name="userId" value={user.id} />

        {/* Error Message */}
        {state.error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium">
              {state.error}
            </p>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg border grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-muted-foreground" />
            </div>
          </div>
          <div className="col-span-3 space-y-4">
            <FieldGroup className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="firstName">{t("firstName")} *</FieldLabel>
                <Input
                  name="firstName"
                  id="firstName"
                  type="text"
                  defaultValue={(state.firstName as string) || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.firstName}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">{t("lastName")} *</FieldLabel>
                <Input
                  name="lastName"
                  id="lastName"
                  type="text"
                  defaultValue={(state.lastName as string) || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.lastName}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="birthDate">{t("birthDate")} *</FieldLabel>
                <Input
                  name="birthDate"
                  id="birthDate"
                  type="date"
                  defaultValue={
                    state.birthDate
                      ? new Date(state.birthDate as string)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  required
                />
                <FieldError>{state.fieldErrors?.birthDate}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="taxCode">{t("taxCode")} *</FieldLabel>
                <Input
                  name="taxCode"
                  id="taxCode"
                  type="text"
                  defaultValue={(state.taxCode as string) || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.taxCode}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="phoneNumber">
                  {t("phoneNumber")} *
                </FieldLabel>
                <Input
                  name="phoneNumber"
                  id="phoneNumber"
                  type="tel"
                  placeholder="+39 123 456 7890"
                  defaultValue={
                    (state.phoneNumber as string) || user.phoneNumber || ""
                  }
                  required
                />
                <FieldError>{state.fieldErrors?.phoneNumber}</FieldError>
              </Field>
              <span className="md:flex hidden"></span>
              <Field>
                <FieldLabel htmlFor="address">{t("address")} *</FieldLabel>
                <Input
                  name="address"
                  id="address"
                  type="text"
                  defaultValue={(state.address as string) || user.address || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.address}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="city">{t("city")} *</FieldLabel>
                <Input
                  name="city"
                  id="city"
                  type="text"
                  defaultValue={(state.city as string) || user.city || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.city}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="zipCode">{t("zipCode")} *</FieldLabel>
                <Input
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  defaultValue={(state.zipCode as string) || user.zipCode || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.zipCode}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="country">{t("country")} *</FieldLabel>
                <Input
                  name="country"
                  id="country"
                  type="text"
                  defaultValue={(state.country as string) || user.country || ""}
                  required
                />
                <FieldError>{state.fieldErrors?.country}</FieldError>
              </Field>
            </FieldGroup>
          </div>
        </div>
      </div>
    </form>
  );
}
