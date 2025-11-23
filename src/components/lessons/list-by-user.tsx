import { getActivities } from "@/db/query/activities";

import ScrollableCards from "../common/scrollable-cards";
import DogTag from "../common/scrollable-cards/dog-tag";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { getUserNextLessons } from "@/db/query/user-subscriptions";

export default async function LessonsListByUser({
  userId,
}: {
  userId: string;
}) {
  const lessons = await getUserNextLessons(userId);

  if (lessons.length === 0) {
    return <></>;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold tracking-tight">
          Le tue prossime lezioni
        </h1>

        <Link href="/activities">
          <Badge variant="outline">View All</Badge>
        </Link>
      </div>

      <ScrollableCards>
        {lessons.map((lesson) => (
          <DogTag
            key={lesson.lesson_registrations.id}
            className={lessons.length === 1 ? "w-full" : ""}
          >
            <div>ciao</div>
          </DogTag>
        ))}
      </ScrollableCards>
    </div>
  );
}
