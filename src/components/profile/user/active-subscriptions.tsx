import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUserActiveSubscriptions } from "@/db/query/user-subscriptions";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils";

export default async function ActiveSubscriptions({
  userId,
}: {
  userId: string;
}) {
  const t = await getTranslations("dashboard");

  const activeSubscriptions = await getUserActiveSubscriptions(userId);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{t("activeSubscriptions")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {activeSubscriptions.length > 0 ? (
          <div className="">
            {activeSubscriptions.map((subscription) => {
              const daysRemaining = Math.ceil(
                (subscription.expiresAt.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const isExpiringSoon = daysRemaining <= 7;

              return (
                <div key={subscription.id}>
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{subscription.name}</h3>
                      </div>
                      <Badge
                        variant={
                          subscription.center === "Vasto"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.center}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={
                            isExpiringSoon ? "text-orange-600 font-medium" : ""
                          }
                        >
                          {daysRemaining > 0
                            ? t("daysRemaining", { days: daysRemaining })
                            : t("expired")}
                        </span>
                      </div>
                      <div>
                        {t("expiresOn", {
                          date: formatDate(subscription.expiresAt),
                        })}
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {t("entriesPerDay", {
                        count: subscription.entriesPerDay,
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {t("entriesPerWeek", {
                        count: subscription.entriesPerWeek,
                      })}
                    </span>
                  </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              {t("noSubscriptionsMessage")}
            </p>
            <Link href="/dashboard/subscriptions">
              {t("newSubscriptionButton")}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
