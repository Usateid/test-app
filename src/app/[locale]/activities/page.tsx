import { getActivities } from "@/db/query/activities";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function ActivitiesPage() {
  const activities = await getActivities({ isActive: true, limit: 50 });
  const t = await getTranslations("activities");

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage-50 via-white to-sage-50 dark:from-sage-950 dark:via-sage-900 dark:to-sage-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-sage-100 via-sage-50 to-white dark:from-sage-900 dark:via-sage-800 dark:to-sage-950">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sage-300/20 dark:bg-sage-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-400/10 dark:bg-sage-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-sage-800/50 backdrop-blur-sm"
            >
              {t("discover")}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-sage-900 dark:text-white mb-6 text-balance">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-sage-700 dark:text-sage-200 mb-8 max-w-3xl mx-auto text-pretty">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-sage-600 dark:text-sage-400">
                {t("noActivities")}
              </p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {activities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ActivityCard({
  activity,
  index,
  t,
}: {
  activity: Awaited<ReturnType<typeof getActivities>>[0];
  index: number;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const isEven = index % 2 === 0;
  const formattedDate = activity.date
    ? new Date(activity.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-sage-900 shadow-lg hover:shadow-2xl transition-all duration-500 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } flex flex-col`}
    >
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[400px] overflow-hidden">
        {activity.image ? (
          <Image
            src={activity.image}
            alt={activity.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-200 via-sage-300 to-sage-400 dark:from-sage-800 dark:via-sage-700 dark:to-sage-600 flex items-center justify-center">
            <Sparkles className="w-24 h-24 text-sage-600 dark:text-sage-400 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 dark:bg-sage-800/90 backdrop-blur-sm text-sage-900 dark:text-white">
            {activity.center}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-light text-sage-900 dark:text-white group-hover:text-sage-700 dark:group-hover:text-sage-200 transition-colors">
              {activity.name}
            </h2>
          </div>

          {activity.description && (
            <p className="text-lg text-sage-600 dark:text-sage-300 line-clamp-3">
              {activity.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            {formattedDate && (
              <div className="flex items-center gap-2 text-sage-700 dark:text-sage-300">
                <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
            )}

            {activity.duration && activity.duration > 0 && (
              <div className="flex items-center gap-2 text-sage-700 dark:text-sage-300">
                <Clock className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="text-sm font-medium">
                  {activity.duration} {t("minutes")}
                </span>
              </div>
            )}

            {activity.location && (
              <div className="flex items-center gap-2 text-sage-700 dark:text-sage-300">
                <MapPin className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="text-sm font-medium">{activity.location}</span>
              </div>
            )}
          </div>

          {activity.minParticipants && activity.maxParticipants && (
            <div className="pt-2">
              <Badge variant="secondary" className="text-xs">
                {t("participants", {
                  min: activity.minParticipants,
                  max: activity.maxParticipants,
                })}
              </Badge>
            </div>
          )}

          <div className="pt-6">
            <Link href={`/activities/${activity.id}`}>
              <Button
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white group/btn"
              >
                {t("learnMore")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
