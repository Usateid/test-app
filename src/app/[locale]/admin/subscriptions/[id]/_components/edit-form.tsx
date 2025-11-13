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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSubscription } from "@/db/query/subscriptions";
import { SubscriptionType } from "@/db/schema/subscriptions";
import { CENTERS, SUBSCRIPTION_STATUS } from "@/utils/const";
import { useActionState, useEffect, useState } from "react";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function EditSubscriptionForm({
  subscription,
}: {
  subscription: SubscriptionType;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateSubscription,
    { fieldErrors: {}, ...subscription }
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/subscriptions");
    }
  }, [state.success, router]);

  // Format date to YYYY-MM-DD for input type="date"
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return new Date().toISOString().split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex">
            <Link href="/admin/subscriptions">
              <Button variant="outline" size="sm" type="button">
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Edit Subscription
              </h1>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <input type="hidden" name="id" value={subscription.id} />

        {/* Header Section */}

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
              <FieldLabel htmlFor="name">Subscription Name *</FieldLabel>
              <Input
                name="name"
                id="name"
                type="text"
                defaultValue={(state.name as string) || ""}
                placeholder="e.g., Monthly Membership"
                required
              />
              <FieldError>{state.fieldErrors?.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Price (€) *</FieldLabel>
              <Input
                name="price"
                id="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={(state.price as number) || 0}
                placeholder="0.00"
                required
              />
              <FieldError>{state.fieldErrors?.price}</FieldError>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                name="description"
                id="description"
                type="text"
                defaultValue={(state.description as string) || ""}
                placeholder="Optional description"
              />
              <FieldError>{state.fieldErrors?.description}</FieldError>
            </Field>
          </FieldGroup>
        </div>

        {/* Schedule & Limits */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule & Limits</h2>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="fromDate">Start Date</FieldLabel>
              <Input
                name="fromDate"
                id="fromDate"
                type="date"
                defaultValue={formatDateForInput(subscription.fromDate)}
              />
              <FieldError>{state.fieldErrors?.fromDate}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="toDate">End Date</FieldLabel>
              <Input
                name="toDate"
                id="toDate"
                type="date"
                defaultValue={formatDateForInput(subscription.toDate)}
              />
              <FieldError>{state.fieldErrors?.toDate}</FieldError>
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-6 md:grid-cols-3 mt-6">
            <Field>
              <FieldLabel htmlFor="entriesPerDay">Entries Per Day *</FieldLabel>
              <Input
                name="entriesPerDay"
                id="entriesPerDay"
                type="number"
                min="1"
                defaultValue={(state.entriesPerDay as number) || 1}
                required
              />
              <FieldError>{state.fieldErrors?.entriesPerDay}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="entriesPerWeek">
                Entries Per Week *
              </FieldLabel>
              <Input
                name="entriesPerWeek"
                id="entriesPerWeek"
                type="number"
                min="1"
                defaultValue={(state.entriesPerWeek as number) || 1}
                required
              />
              <FieldError>{state.fieldErrors?.entriesPerWeek}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="entriesPerWeek">
                Duration In Days *
              </FieldLabel>
              <Input
                name="durationInDays"
                id="durationInDays"
                type="number"
                min="1"
                defaultValue={(state.durationInDays as number) || 1}
                required
              />
              <FieldError>{state.fieldErrors?.durationInDays}</FieldError>
            </Field>
          </FieldGroup>
        </div>

        {/* Settings */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="status">Status *</FieldLabel>
              <Select
                name="status"
                defaultValue={(state.status as string) || "active"}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SUBSCRIPTION_STATUS.Active}>
                    Active
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.Inactive}>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{state.fieldErrors?.status}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="center">Center *</FieldLabel>
              <Select
                name="center"
                defaultValue={(state.center as string) || "Vasto"}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CENTERS.Vasto}>{CENTERS.Vasto}</SelectItem>
                  <SelectItem value={CENTERS.Pescara}>
                    {CENTERS.Pescara}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{state.fieldErrors?.center}</FieldError>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}
