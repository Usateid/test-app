"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLesson } from "@/db/query/lessons";
import { LessonType } from "@/db/schema/lessons";
import { useActionState, useState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { Pencil } from "lucide-react";

interface EditLessonProps {
  lesson: LessonType;
  teachers?: { id: string; name: string }[];
}

export default function EditLesson({ lesson, teachers }: EditLessonProps) {
  const [open, setOpen] = useState(false);

  const formatDatetimeLocal = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const calculateDuration = () => {
    const start = new Date(lesson.startTime);
    const end = new Date(lesson.endTime);
    return Math.round((end.getTime() - start.getTime()) / 60000); // Convert to minutes
  };

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateLesson,
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
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
        <form action={formAction}>
          <input type="hidden" name="id" value={lesson.id} />
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={lesson.title}
                required
              />
              {state.fieldErrors?.title && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.title}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                defaultValue={lesson.description || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Date & Time *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  defaultValue={formatDatetimeLocal(lesson.startTime)}
                  required
                />
                {state.fieldErrors?.startTime && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.startTime}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  defaultValue={calculateDuration()}
                  placeholder="60"
                  required
                />
                {state.fieldErrors?.duration && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.duration}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Duration in minutes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="center">Center *</Label>
                <Select name="center" defaultValue={lesson.center} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vasto">Vasto</SelectItem>
                    <SelectItem value="Pescara">Pescara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue={lesson.status} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {teachers && teachers.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Teacher</Label>
                <Select name="teacherId" defaultValue={lesson.teacherId || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating..." : "Update Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
