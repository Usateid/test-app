"use client";

import { LessonType } from "@/db/schema/lessons";
import { Badge } from "@/components/ui/badge";
import DayNavigation from "@/components/calendar/day-navigation";
import { LessonRegistrationButton } from "./lesson-registration-button";
import { CheckCircle, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import { getLessonsForDate } from "@/components/calendar/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface WeeklyCalendarGridProps {
  lessons: LessonType[];
  userId?: string;
  hasSubscription: boolean;
  registeredLessonIds: string[];
}

export default function WeeklyCalendarGrid({
  lessons,
  userId,
  hasSubscription,
  registeredLessonIds,
}: WeeklyCalendarGridProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [dayOffset, setDayOffset] = useState(0); // 0 = today, 1 = tomorrow, etc.

  // Get current displayed day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = new Date(today);
  currentDay.setDate(currentDay.getDate() + dayOffset);

  // Time slots (from 6:00 to 22:00)
  const hours = Array.from({ length: 15 }, (_, i) => 8 + i);

  const goToPreviousDay = () => {
    if (dayOffset > 0) {
      setDayOffset(dayOffset - 1);
    }
  };

  const goToNextDay = () => {
    setDayOffset(dayOffset + 1);
  };

  const handleDaySelect = (newDayOffset: number) => {
    setDayOffset(newDayOffset);
  };

  //   const goToToday = () => {
  //     setDayOffset(0);
  //   };

  const getDayLabel = () => {
    const daysDiff = dayOffset;

    if (daysDiff === 0) return "Oggi";
    if (daysDiff === 1) return "Domani";

    return currentDay.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Get lessons that start in a specific hour
  const getLessonsStartingInHour = (hour: number) => {
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startTime);
      const lessonHour = lessonDate.getHours();

      return (
        lessonDate.getDate() === currentDay.getDate() &&
        lessonDate.getMonth() === currentDay.getMonth() &&
        lessonDate.getFullYear() === currentDay.getFullYear() &&
        lessonHour === hour
      );
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start: Date, end: Date) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diff / 60000);
  };

  const getCenterColor = (center: string) => {
    return center === "Vasto" ? "bg-blue-500" : "bg-green-500";
  };

  const handleLessonClick = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setDetailModalOpen(true);
  };

  const lessonsForCurrentDay = getLessonsForDate(lessons, currentDay);
  return (
    <>
      <div className="space-y-4">
        <DayNavigation
          lessons={lessons}
          selectedDayOffset={dayOffset}
          onDaySelect={handleDaySelect}
        />

        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="overflow-auto max-h-[600px]">
            <div className="relative">
              {lessonsForCurrentDay.map((lesson) => {
                const lessonStart = new Date(lesson.startTime);
                const lessonEnd = new Date(lesson.endTime);
                const startHour = lessonStart.getHours();
                const startMinutes = lessonStart.getMinutes();

                const hourIndex = hours.indexOf(startHour);
                if (hourIndex === -1) return null; // Hour not in range

                // Calculate top position by summing actual row heights
                // Empty rows: h-10 (40px), rows with lessons: h-20 (80px)
                const emptyRowHeight = 40;
                const filledRowHeight = 80;

                let topOffset = 0;
                // Sum heights of all previous rows
                for (let i = 0; i < hourIndex; i++) {
                  const prevHour = hours[i];
                  const prevHourLessons = getLessonsStartingInHour(prevHour);
                  const prevHasLessons = prevHourLessons.length > 0;
                  topOffset += prevHasLessons
                    ? filledRowHeight
                    : emptyRowHeight;
                }

                // Add offset within the starting hour
                const startHourLessons = getLessonsStartingInHour(startHour);
                const startHasLessons = startHourLessons.length > 0;
                const startHourRowHeight = startHasLessons
                  ? filledRowHeight
                  : emptyRowHeight;
                topOffset += (startMinutes / 60) * startHourRowHeight;

                // Calculate height by summing heights of spanned hour rows
                // Start from the lesson's start hour and calculate which hours it spans
                let height = 0;
                const endHour = lessonEnd.getHours();
                const endMinutes = lessonEnd.getMinutes();

                // Calculate height from start position to end position
                const hoursSpanned = [];
                for (let h = startHour; h <= endHour; h++) {
                  if (hours.includes(h)) {
                    hoursSpanned.push(h);
                  }
                }

                // First hour: from start position to end of hour
                if (hoursSpanned.length > 0) {
                  const firstHour = hoursSpanned[0];
                  const firstHourLessons = getLessonsStartingInHour(firstHour);
                  const firstHasLessons = firstHourLessons.length > 0;
                  const firstHourHeight = firstHasLessons
                    ? filledRowHeight
                    : emptyRowHeight;

                  if (hoursSpanned.length === 1) {
                    // Lesson within single hour
                    height =
                      (endMinutes / 60) * firstHourHeight -
                      (startMinutes / 60) * firstHourHeight;
                  } else {
                    // Multiple hours: first hour partial + middle hours + last hour partial
                    height +=
                      firstHourHeight - (startMinutes / 60) * firstHourHeight;

                    // Middle hours (full)
                    for (let i = 1; i < hoursSpanned.length - 1; i++) {
                      const midHour = hoursSpanned[i];
                      const midHourLessons = getLessonsStartingInHour(midHour);
                      const midHasLessons = midHourLessons.length > 0;
                      height += midHasLessons
                        ? filledRowHeight
                        : emptyRowHeight;
                    }

                    // Last hour (partial)
                    if (hoursSpanned.length > 1) {
                      const lastHour = hoursSpanned[hoursSpanned.length - 1];
                      const lastHourLessons =
                        getLessonsStartingInHour(lastHour);
                      const lastHasLessons = lastHourLessons.length > 0;
                      const lastHourHeight = lastHasLessons
                        ? filledRowHeight
                        : emptyRowHeight;
                      height += (endMinutes / 60) * lastHourHeight;
                    }
                  }
                }

                const isRegistered = registeredLessonIds.includes(lesson.id);
                const isPast = new Date(lesson.startTime) < new Date();

                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={cn(
                      "absolute left-[88px] right-2 px-2 py-2 rounded-lg cursor-pointer transition-all hover:shadow-md border-l-4 z-10",
                      "bg-card",
                      isPast && "opacity-50",
                      isRegistered
                        ? "border-green-500 bg-green-100"
                        : "border-blue-500 bg-blue-100"
                    )}
                    style={{
                      top: `${topOffset}px`,
                      height: `${height}px`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 h-full">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold">
                            {lesson.title}
                          </h3>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isRegistered && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Hour rows with fixed height */}
              {hours.map((hour) => {
                const hourLessons = getLessonsStartingInHour(hour);
                const hasLessons = hourLessons.length > 0;

                return (
                  <div
                    key={hour}
                    className={cn(
                      "flex border-b hover:bg-muted/20 transition-colors relative",
                      hasLessons ? "h-20" : "h-10"
                    )}
                  >
                    {/* Time column */}
                    <div className="w-20 flex-shrink-0 p-3 text-sm font-medium text-muted-foreground border-r bg-muted/20 flex items-start justify-center">
                      {String(hour).padStart(2, "0")}:00
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedLesson.title}
                </DialogTitle>
                <DialogDescription>
                  {formatDateTime(selectedLesson.startTime)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getCenterColor(selectedLesson.center)}>
                    {selectedLesson.center}
                  </Badge>
                  {registeredLessonIds.includes(selectedLesson.id) && (
                    <Badge variant="default" className="bg-green-600">
                      Registrato
                    </Badge>
                  )}
                </div>

                {selectedLesson.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Descrizione</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedLesson.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Orario inizio
                    </p>
                    <p className="font-semibold">
                      {formatTime(selectedLesson.startTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orario fine</p>
                    <p className="font-semibold">
                      {formatTime(selectedLesson.endTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durata</p>
                    <p className="font-semibold">
                      {getDuration(
                        selectedLesson.startTime,
                        selectedLesson.endTime
                      )}{" "}
                      minuti
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Centro</p>
                    <p className="font-semibold">{selectedLesson.center}</p>
                  </div>
                </div>

                {userId && selectedLesson.status === "scheduled" && (
                  <div className="pt-4 border-t">
                    <LessonRegistrationButton
                      lessonId={selectedLesson.id}
                      userId={userId}
                      isRegistered={registeredLessonIds.includes(
                        selectedLesson.id
                      )}
                      hasSubscription={hasSubscription}
                      lessonStartTime={selectedLesson.startTime}
                      lessonStatus={selectedLesson.status}
                    />
                  </div>
                )}

                {!userId && (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Accedi per registrarti a questa lezione
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
