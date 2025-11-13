"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { LessonType } from "@/db/schema/lessons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DayLessonsModal from "./day-lessons-modal";

interface CalendarViewProps {
  lessons: LessonType[];
  onAddLesson?: (date: Date) => void;
  onLessonClick?: (lesson: LessonType) => void;
}

export default function CalendarView({
  lessons,
  onAddLesson,
  onLessonClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedDayLessons, setSelectedDayLessons] = useState<LessonType[]>(
    []
  );
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getLessonsForDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startTime);
      return (
        lessonDate.getDate() === date.getDate() &&
        lessonDate.getMonth() === date.getMonth() &&
        lessonDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getCenterColor = (center: string) => {
    return center === "Vasto" ? "bg-blue-500" : "bg-green-500";
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="min-h-32 border border-border bg-muted/20"
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayLessons = getLessonsForDate(day);
      const today = isToday(day);

      days.push(
        <div
          key={day}
          className={`min-h-32 border border-border p-2 relative ${
            today ? "bg-primary/5 border-primary" : "bg-background"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span
              className={`text-sm font-medium ${
                today
                  ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                  : ""
              }`}
            >
              {day}
            </span>
            {onAddLesson && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() =>
                  onAddLesson(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  )
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {dayLessons.length === 0 ? (
              <div className="text-[10px] text-muted-foreground italic">
                No lessons
              </div>
            ) : dayLessons.length <= 3 ? (
              // Show all lessons if 3 or fewer
              dayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="text-xs p-1 rounded cursor-pointer hover:bg-accent transition-colors border border-border/40"
                  onClick={() => onLessonClick?.(lesson)}
                >
                  <div className="flex items-center gap-1 justify-between">
                    <span className="font-medium truncate text-[11px]">
                      {lesson.title}
                    </span>
                    <Badge
                      className={cn(
                        "text-[9px] px-1 py-0",
                        getCenterColor(lesson.center)
                      )}
                    >
                      {formatTime(lesson.startTime)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              // Show first 2 lessons + count of remaining
              <>
                {dayLessons.slice(0, 2).map((lesson) => (
                  <div
                    key={lesson.id}
                    className="text-xs p-1 rounded cursor-pointer hover:bg-accent transition-colors border border-border/40"
                    onClick={() => onLessonClick?.(lesson)}
                  >
                    <div className="flex items-center gap-1 justify-between">
                      <span className="font-medium truncate text-[11px]">
                        {lesson.title}
                      </span>
                      <Badge
                        className={cn(
                          "text-[9px] px-1 py-0",
                          getCenterColor(lesson.center)
                        )}
                      >
                        {formatTime(lesson.startTime)}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={() => {
                    setSelectedDayLessons(dayLessons);
                    setSelectedDayDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    );
                    setDayModalOpen(true);
                  }}
                >
                  Show {dayLessons.length - 2} more
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <>
      <DayLessonsModal
        open={dayModalOpen}
        onOpenChange={setDayModalOpen}
        lessons={selectedDayLessons}
        date={selectedDayDate}
        onLessonClick={(lesson) => {
          if (onLessonClick) {
            onLessonClick(lesson);
          }
        }}
      />
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button onClick={previousMonth} variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentDate(new Date())}
              variant="outline"
              size="sm"
            >
              Today
            </Button>
            <Button onClick={nextMonth} variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="bg-muted p-2 text-center font-semibold text-sm border-b border-border"
            >
              {dayName}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </>
  );
}
