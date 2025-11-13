import { getUserLessonRegistrations } from "@/db/query/lesson-registrations";
import type { UserLessonRegistrationType } from "@/db/query/lesson-registrations";
import Image from "next/image";
import { formatDateYearMonthDay } from "@/utils";
import { getTranslations } from "next-intl/server";
import { ArrowRightIcon, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function LastActivities({ userId }: { userId: string }) {
  const t = await getTranslations("common");

  const lastLessons = await getUserLessonRegistrations(userId);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-bold tracking-tight">
          {t("lastActivity")}
        </h1>
        <Link href="/dashboard/activities">
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      {lastLessons.length > 0 ? (
        <Activities lessons={lastLessons} />
      ) : (
        <NoActivities />
      )}
    </div>
  );
}

function Activities({ lessons }: { lessons: UserLessonRegistrationType[] }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {lessons.map((lesson) => (
          <ActivitySmallCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}

function ActivitySmallCard({ lesson }: { lesson: UserLessonRegistrationType }) {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-xl ">
      <div className="flex gap-4">
        <div className="relative size-16">
          <Image
            src="https://hatha-yoga-marina.com/logo.png"
            fill={true}
            alt="Picture of the author"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1 gap-1">
          <h4 className="font-semibold truncate">{lesson.title}</h4>
          <p className="text-xs">{lesson.center}</p>
          <div className="flex items-center gap-2">
            <Clock className="size-3" />
            <p className="text-xs">
              {formatDateYearMonthDay(lesson.startTime)}
            </p>
          </div>

          {/* <p className="text-sm text-muted-foreground">
            {lesson.startTime.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {lesson.endTime.toLocaleString()}
          </p> */}
        </div>
      </div>
    </div>
  );
}
function NoActivities() {
  return (
    <div>
      <p>No activities found</p>
    </div>
  );
}
