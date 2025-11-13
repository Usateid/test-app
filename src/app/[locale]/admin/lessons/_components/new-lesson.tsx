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
import { addLesson } from "@/db/query/lessons";
import { useActionState, useState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface NewLessonProps {
  selectedDate?: Date;
  teachers?: { id: string; name: string }[];
}

export default function NewLesson({ selectedDate, teachers }: NewLessonProps) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const defaultDate = selectedDate || new Date();
  const dateStr = defaultDate.toISOString().split("T")[0];
  const timeStr = `${String(defaultDate.getHours()).padStart(2, "0")}:00`;

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addLesson,
    { fieldErrors: {} }
  );

  const daysOfWeek = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
  ];

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const calculateLessonCount = (months: number = 6) => {
    if (!isRecurring || selectedDays.length === 0) return 0;

    const startDate = defaultDate;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (selectedDays.includes(currentDate.getDay())) {
        count++;
      }
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setIsRecurring(false);
      setSelectedDays([]);
    }
  }, [state.success]);

  useEffect(() => {
    if (selectedDate) {
      setOpen(true);
    }
  }, [selectedDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Recurring Lesson Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <input
                type="hidden"
                name="isRecurring"
                value={isRecurring.toString()}
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Recurring Lesson (repeat weekly)
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="grid gap-2">
                  <Label>Select Days of the Week</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`day-${day.value}`}
                          checked={selectedDays.includes(day.value)}
                          onChange={() => toggleDay(day.value)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label
                          htmlFor={`day-${day.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="recurringDays"
                    value={selectedDays.join(",")}
                  />
                  {isRecurring && selectedDays.length === 0 && (
                    <p className="text-sm text-destructive">
                      Please select at least one day
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="recurringMonths">Duration (months)</Label>
                  <Input
                    id="recurringMonths"
                    name="recurringMonths"
                    type="number"
                    min="1"
                    max="12"
                    defaultValue="6"
                    placeholder="6"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lessons will be created for the next N months
                  </p>
                </div>

                {selectedDays.length > 0 && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium">
                      📅 This will create approximately{" "}
                      <span className="text-primary font-bold">
                        {calculateLessonCount()} lessons
                      </span>{" "}
                      over the next 6 months
                    </p>
                  </div>
                )}
              </div>
            )}

            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Yoga Class"
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
                placeholder="Beginner friendly yoga session"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Date & Time *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  defaultValue={`${dateStr}T${timeStr}`}
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
                  min="30"
                  max="480"
                  step="1"
                  defaultValue="60"
                  placeholder="60"
                  required
                />
                {state.fieldErrors?.duration && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.duration}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="center">Center *</Label>
                <Select name="center" defaultValue="Vasto" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vasto">Vasto</SelectItem>
                    <SelectItem value="Pescara">Pescara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue="scheduled" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
                <Select name="teacherId">
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
            <Button
              type="submit"
              disabled={pending || (isRecurring && selectedDays.length === 0)}
            >
              {pending
                ? "Creating..."
                : isRecurring
                ? `Create ${selectedDays.length > 0 ? "Recurring " : ""}Lessons`
                : "Create Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
