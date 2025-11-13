"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonType } from "@/db/schema/lessons";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LessonRegistrationButton } from "./lesson-registration-button";

interface DayLessonsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessons: LessonType[];
  date: Date | null;
  onLessonClick?: (lesson: LessonType) => void;
  userId?: string;
  hasSubscription?: boolean;
  userRegisteredLessons?: string[];
}

export default function DayLessonsModal({
  open,
  onOpenChange,
  lessons,
  date,
  onLessonClick,
  userId,
  hasSubscription = false,
  userRegisteredLessons = [],
}: DayLessonsModalProps) {
  if (!date) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Sort lessons by start time
  const sortedLessons = [...lessons].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formatDate(date)}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} scheduled
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {sortedLessons.map((lesson) => {
              const isRegistered = userRegisteredLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="p-3 rounded-lg border border-border transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getCenterColor(lesson.center)}>
                          {formatTime(lesson.startTime)} -{" "}
                          {formatTime(lesson.endTime)}
                        </Badge>
                        <Badge variant={getStatusColor(lesson.status)}>
                          {lesson.status}
                        </Badge>
                        {isRegistered && (
                          <Badge variant="default" className="bg-green-600">
                            Registrato
                          </Badge>
                        )}
                      </div>
                      <h3
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={() => {
                          if (onLessonClick) {
                            onOpenChange(false);
                            onLessonClick(lesson);
                          }
                        }}
                      >
                        {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {lesson.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {lesson.center}
                      </p>
                    </div>
                  </div>
                  {userId && (
                    <LessonRegistrationButton
                      lessonId={lesson.id}
                      userId={userId}
                      isRegistered={isRegistered}
                      hasSubscription={hasSubscription}
                      lessonStartTime={lesson.startTime}
                      lessonStatus={lesson.status}
                      size="sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
