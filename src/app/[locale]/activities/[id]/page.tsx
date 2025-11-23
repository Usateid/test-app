import { getActivityById } from "@/db/query/activities";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Users,
  Sparkles,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  const t = await getTranslations("activities");

  if (!activity || !activity.isActive) {
    notFound();
  }

  const activityDate = activity.date ? new Date(activity.date) : null;
  const hasTime =
    activityDate &&
    (activityDate.getHours() > 0 || activityDate.getMinutes() > 0);

  const formattedDate = activityDate
    ? activityDate.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage-50 via-white to-sage-50 dark:from-sage-950 dark:via-sage-900 dark:to-sage-950">
      {/* Back Button */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/activities">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" />
            {t("backToActivities")}
          </Button>
        </Link>
      </div> */}

      {/* Hero Image */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {activity.image ? (
          <Image
            src={activity.image}
            alt={activity.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-200 via-sage-300 to-sage-400 dark:from-sage-800 dark:via-sage-700 dark:to-sage-600 flex items-center justify-center">
            <Sparkles className="w-32 h-32 text-sage-600 dark:text-sage-400 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Badge className="mb-4 bg-white/90 dark:bg-sage-800/90 backdrop-blur-sm text-sage-900 dark:text-white">
              {activity.center}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              {activity.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {activity.description && (
                <div>
                  <h2 className="text-2xl font-light text-sage-900 dark:text-white mb-4">
                    {t("about")}
                  </h2>
                  <div className="prose prose-sage dark:prose-invert max-w-none">
                    <p className="text-lg text-sage-700 dark:text-sage-300 leading-relaxed whitespace-pre-line">
                      {activity.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="pt-8 border-t border-sage-200 dark:border-sage-800">
                <h2 className="text-2xl font-light text-sage-900 dark:text-white mb-6">
                  {t("details")}
                </h2>
                <div className="space-y-4">
                  {formattedDate && (
                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sage-900 dark:text-white">
                          {t("date")}
                        </p>
                        <p className="text-sage-600 dark:text-sage-300">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  )}

                  {activity.duration && activity.duration > 0 && (
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sage-900 dark:text-white">
                          {t("duration")}
                        </p>
                        <p className="text-sage-600 dark:text-sage-300">
                          {activity.duration} {t("minutes")}
                        </p>
                      </div>
                    </div>
                  )}

                  {activity.location && (
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sage-900 dark:text-white">
                          {t("location")}
                        </p>
                        <p className="text-sage-600 dark:text-sage-300">
                          {activity.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {activity.minParticipants && activity.maxParticipants && (
                    <div className="flex items-start gap-4">
                      <Users className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sage-900 dark:text-white">
                          {t("participants")}
                        </p>
                        <p className="text-sage-600 dark:text-sage-300">
                          {t("participantsRange", {
                            min: activity.minParticipants,
                            max: activity.maxParticipants,
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <Building2 className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sage-900 dark:text-white">
                        {t("center")}
                      </p>
                      <p className="text-sage-600 dark:text-sage-300">
                        {activity.center}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-8 bg-white dark:bg-sage-900 rounded-xl border border-sage-200 dark:border-sage-800 p-6 shadow-lg">
                <h3 className="text-xl font-light text-sage-900 dark:text-white mb-6">
                  {t("joinUs")}
                </h3>
                <p className="text-sage-600 dark:text-sage-300 mb-6 text-sm">
                  {t("joinDescription")}
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    {t("registerNow")}
                  </Button>
                </Link>
                <p className="text-xs text-sage-500 dark:text-sage-400 mt-4 text-center">
                  {t("alreadyMember")}{" "}
                  <Link
                    href="/login"
                    className="text-sage-600 dark:text-sage-400 hover:underline"
                  >
                    {t("login")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
