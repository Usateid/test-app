import { getLessons } from "@/db/query/lessons";
import { getTeachers } from "@/db/query/user";
import LessonsCalendarView from "./_components/lessons-calendar-view";

export default async function LessonsPage() {
  const [lessons, teachers] = await Promise.all([getLessons(), getTeachers()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lessons</h1>
      </div>

      <LessonsCalendarView lessons={lessons} teachers={teachers} />
    </div>
  );
}
