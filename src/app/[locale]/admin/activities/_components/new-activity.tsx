"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addActivity } from "@/db/query/activities";
import { useActionState, useState, useEffect } from "react";
import { ActionState } from "@/db/utils";
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
import { CENTERS } from "@/utils/const";

export default function NewActivity() {
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addActivity,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
        <DialogTitle>Add New Activity</DialogTitle>
        <form action={formAction}>
          <FieldGroup className="my-4 flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                name="name"
                type="text"
                id="name"
                defaultValue={(state.name as string) || ""}
                required
              />
              <FieldError>{state.fieldErrors?.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                name="description"
                id="description"
                defaultValue={(state.description as string) || ""}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500 min-h-[100px]"
              />
              <FieldError>{state.fieldErrors?.description}</FieldError>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
                <Input
                  name="duration"
                  type="number"
                  id="duration"
                  defaultValue={(state.duration as number) || 50}
                  min="1"
                  required
                />
                <FieldError>{state.fieldErrors?.duration}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="center">Center</FieldLabel>
                <Select name="center" defaultValue={CENTERS.Vasto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CENTERS.Vasto}>
                      {CENTERS.Vasto}
                    </SelectItem>
                    <SelectItem value={CENTERS.Pescara}>
                      {CENTERS.Pescara}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{state.fieldErrors?.center}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="minParticipants">
                  Min Participants
                </FieldLabel>
                <Input
                  name="minParticipants"
                  type="number"
                  id="minParticipants"
                  defaultValue={(state.minParticipants as number) || 4}
                  min="1"
                  required
                />
                <FieldError>{state.fieldErrors?.minParticipants}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="maxParticipants">
                  Max Participants
                </FieldLabel>
                <Input
                  name="maxParticipants"
                  type="number"
                  id="maxParticipants"
                  defaultValue={(state.maxParticipants as number) || 20}
                  min="1"
                  required
                />
                <FieldError>{state.fieldErrors?.maxParticipants}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="redirectUrl">Redirect URL</FieldLabel>
              <Input
                name="redirectUrl"
                type="text"
                id="redirectUrl"
                defaultValue={(state.redirectUrl as string) || ""}
                placeholder="/example"
              />
              <FieldError>{state.fieldErrors?.redirectUrl}</FieldError>
            </Field>

            <Field>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  value="true"
                  defaultChecked={state.isActive !== false}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <FieldLabel htmlFor="isActive" className="mb-0">
                  Active
                </FieldLabel>
              </div>
              <FieldError>{state.fieldErrors?.isActive}</FieldError>
            </Field>
          </FieldGroup>

          {state.error && (
            <div className="text-sm text-red-600 mb-4">{state.error}</div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Create Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
