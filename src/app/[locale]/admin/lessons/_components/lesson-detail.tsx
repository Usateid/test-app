"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonType } from "@/db/schema/lessons";
import { Badge } from "@/components/ui/badge";
import EditLesson from "./edit-lesson";
import DeleteLesson from "./delete-lesson";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface LessonDetailProps {
  lesson: LessonType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers?: { id: string; name: string }[];
}

export default function LessonDetail({
  lesson,
  open,
  onOpenChange,
  teachers,
}: LessonDetailProps) {
  if (!lesson) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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

  const calculateDuration = () => {
    const start = new Date(lesson.startTime);
    const end = new Date(lesson.endTime);
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}min`;
    }
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

  const teacherName = teachers?.find((t) => t.id === lesson.teacherId)?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={getStatusColor(lesson.status)}>
              {lesson.status}
            </Badge>
            <div className="flex gap-2">
              <EditLesson lesson={lesson} teachers={teachers} />
              <DeleteLesson id={lesson.id} />
            </div>
          </div>

          {lesson.description && (
            <div>
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(lesson.startTime)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}{" "}
                <span className="text-muted-foreground">
                  ({calculateDuration()})
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{lesson.center}</span>
            </div>

            {teacherName && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{teacherName}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
