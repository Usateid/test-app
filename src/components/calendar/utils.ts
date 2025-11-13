import { LessonType } from "@/db/schema/lessons";

export const getLessonsForDate = (lessons: LessonType[], date: Date) => {
  return lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.startTime);
    return (
      lessonDate.getDate() === date.getDate() &&
      lessonDate.getMonth() === date.getMonth() &&
      lessonDate.getFullYear() === date.getFullYear()
    );
  });
};
