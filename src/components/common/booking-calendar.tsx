"use client";

import { useState } from "react";
import CalendarView from "./calendar-view";
import DayLessonsModal from "./day-lessons-modal";
import { LessonType } from "@/db/schema/lessons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LessonRegistrationButton } from "./lesson-registration-button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingCalendarProps {
  lessons: LessonType[];
  userId?: string;
  hasSubscription: boolean;
  registeredLessonIds: string[];
}

export default function BookingCalendar({
  lessons,
  userId,
  hasSubscription,
  registeredLessonIds,
}: BookingCalendarProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleLessonClick = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setDetailModalOpen(true);
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start: Date, end: Date) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diff / 60000); // minutes
  };

  const getCenterColor = (center: string) => {
    return center === "Vasto" ? "bg-blue-500" : "bg-green-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default">Programmata</Badge>;
      case "completed":
        return <Badge variant="secondary">Completata</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancellata</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <CalendarView lessons={lessons} onLessonClick={handleLessonClick} />

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
                  {getStatusBadge(selectedLesson.status)}
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
