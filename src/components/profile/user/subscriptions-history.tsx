import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { UserSubscriptionType } from "@/db/query/user-subscriptions";

export default async function UserSubscriptionsHistory({
  activeSubscriptions,
}: {
  activeSubscriptions: UserSubscriptionType[];
}) {
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      {/* Active Subscriptions Section */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <CardTitle className="text-2xl">
                {t("activeSubscriptions")}
              </CardTitle>
              <CardDescription className="mt-1">
                {t("yourCurrentSubscriptions")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.map((subscription) => {
                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <h3 className="font-semibold text-lg text-foreground">
                      {subscription.name}
                    </h3>
                    <Badge variant="success">Attivo</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4 text-lg">
                {t("noSubscriptionsMessage")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
