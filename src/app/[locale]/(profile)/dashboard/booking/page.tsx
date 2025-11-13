import { getScheduledLessons } from "@/db/query/lessons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AlertCircle, CalendarDays } from "lucide-react";
import { getServerSession } from "@/hooks/server-session";
import { hasActiveSubscription } from "@/db/query/user";
import { getUserLessonRegistrations } from "@/db/query/lesson-registrations";
import WeeklyCalendarGrid from "@/components/common/weekly-calendar-grid";
import { Button } from "@/components/ui/button";

export default async function BookingPage() {
  const { userInfo } = await getServerSession();
  const hasSubscription =
    userInfo && userInfo.userId
      ? await hasActiveSubscription(userInfo.userId)
      : false;

  // Get all lessons
  const scheduledLessons = await getScheduledLessons();

  // Get user registrations
  const userRegistrations =
    userInfo && userInfo.userId
      ? await getUserLessonRegistrations(userInfo.userId)
      : [];

  const registeredLessonIds = userRegistrations.map((reg) => reg.lessonId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Prenota una lezione
          </h1>
        </div>
        <CalendarDays className="h-8 w-8 text-muted-foreground" />
      </div>

      {!hasSubscription && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Abbonamento non attivo</AlertTitle>
          <AlertDescription>
            <div className="w-full flex lg:justify-between lg:items-center lg:flex-row flex-col gap-2">
              <p>
                Devi avere un abbonamento attivo per registrarti alle lezioni.
              </p>
              <Button asChild variant="destructive" size="sm">
                <Link href="/dashboard/subscriptions">
                  Visualizza abbonamenti
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* {userInfo && (
        <div className="bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Sei registrato a{" "}
            <span className="font-bold">{userRegistrations.length}</span>{" "}
            lezioni
          </p>
        </div>
      )} */}
      <WeeklyCalendarGrid
        lessons={scheduledLessons}
        userId={userInfo?.userId ?? undefined}
        hasSubscription={hasSubscription}
        registeredLessonIds={registeredLessonIds}
      />
    </div>
  );
}
