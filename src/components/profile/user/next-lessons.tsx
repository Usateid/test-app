import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { getScheduledLessons } from "@/db/query/lessons";

export default async function NextLessons({ userId }: { userId: string }) {
  const t = await getTranslations("dashboard");

  //   const lessons = await getScheduledLessons(userId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>{t("upcomingLessons")}</CardTitle>
        </div>
        <CardDescription>{t("yourScheduledLessons")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t("noLessonsBooked")}</p>
          <Link href="/dashboard/booking">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              {t("bookALesson")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
