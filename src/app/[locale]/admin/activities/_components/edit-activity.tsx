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
import { getActivityById, updateActivity } from "@/db/query/activities";
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
import { Pencil } from "lucide-react";
import { type InsertActivityType } from "@/db/schema/actitivites";

interface EditActivityProps {
  id: string;
  teachers?: { id: string; name: string }[];
}

export default function EditActivity({ id, teachers }: EditActivityProps) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<InsertActivityType | null>(null);
  const [loading, setLoading] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateActivity,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (open && !activity) {
      setLoading(true);
      getActivityById(id).then((data) => {
        setActivity(data);
        setLoading(false);
      });
    }
  }, [open, id, activity]);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setActivity(null); // Reset for next open
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
        <DialogTitle>Edit Activity</DialogTitle>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : activity ? (
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <FieldGroup className="my-4 flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  defaultValue={activity.name}
                  required
                />
                <FieldError>{state.fieldErrors?.name}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  name="description"
                  id="description"
                  defaultValue={activity.description || ""}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500 min-h-[100px]"
                />
                <FieldError>{state.fieldErrors?.description}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="date">Date & Time</FieldLabel>
                <Input
                  name="date"
                  type="datetime-local"
                  id="date"
                  defaultValue={
                    activity.date
                      ? new Date(activity.date).toISOString().slice(0, 16)
                      : ""
                  }
                  required
                />
                <FieldError>{state.fieldErrors?.date}</FieldError>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
                  <Input
                    name="duration"
                    type="number"
                    id="duration"
                    defaultValue={activity.duration}
                    min="1"
                    required
                  />
                  <FieldError>{state.fieldErrors?.duration}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="center">Center</FieldLabel>
                  <Select name="center" defaultValue={activity.center}>
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
                    defaultValue={activity.minParticipants}
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
                    defaultValue={activity.maxParticipants}
                    min="1"
                    required
                  />
                  <FieldError>{state.fieldErrors?.maxParticipants}</FieldError>
                </Field>
              </div>

              {teachers && teachers.length > 0 && (
                <Field>
                  <FieldLabel htmlFor="teacherId">Teacher</FieldLabel>
                  <Select
                    name="teacherId"
                    defaultValue={activity.teacherId || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{state.fieldErrors?.teacherId}</FieldError>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  name="location"
                  type="text"
                  id="location"
                  defaultValue={activity.location || ""}
                  placeholder="e.g., Studio A, Sala principale"
                />
                <FieldError>{state.fieldErrors?.location}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="redirectUrl">Redirect URL</FieldLabel>
                <Input
                  name="redirectUrl"
                  type="text"
                  id="redirectUrl"
                  defaultValue={activity.redirectUrl || ""}
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
                    defaultChecked={activity.isActive}
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
                {pending ? "Updating..." : "Update Activity"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
