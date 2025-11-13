"use client";

import { useState } from "react";
import CalendarView from "@/components/common/calendar-view";
import NewLesson from "./new-lesson";
import LessonDetail from "./lesson-detail";
import { LessonType } from "@/db/schema/lessons";

interface LessonsCalendarViewProps {
  lessons: LessonType[];
  teachers: { id: string; name: string }[];
}

export default function LessonsCalendarView({
  lessons,
  teachers,
}: LessonsCalendarViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);

  const handleAddLesson = (date: Date) => {
    setSelectedDate(date);
  };

  const handleLessonClick = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <NewLesson selectedDate={selectedDate} teachers={teachers} />
      </div>
      <CalendarView
        lessons={lessons}
        onAddLesson={handleAddLesson}
        onLessonClick={handleLessonClick}
      />
      <LessonDetail
        lesson={selectedLesson}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        teachers={teachers}
      />
    </>
  );
}
