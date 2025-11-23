import type { SubscriptionType } from "@/db/schema/subscriptions";
import { BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "@/hooks/server-session";
import SaveSubscriptionButton from "./save-subscription-button";

export default async function SubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionType;
}) {
  const t = await getTranslations("subscriptions");
  // const { isAuthenticated, session } = await getServerSession();

  return (
    <div className="border rounded-lg p-4 flex justify-center w-full">
      <div className="flex flex-col gap-4">
        <p className="text-center font-semibold">{subscription.name}</p>
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-green-500" />
          {t("entriesPerWeek", { count: subscription.entriesPerWeek })}
        </div>
        {/* {isAuthenticated && session?.user?.id && (
          <SaveSubscriptionButton
            userId={session.user.id}
            subscriptionId={subscription.id}
            durationInDays={subscription.durationInDays}
          />
        )} */}
      </div>
    </div>
    // <Card
    //   class
    //   <CardContent className="space-y-6">
    //     <div className="grid grid-cols-2 gap-3">
    //       <div className="flex items-center gap-3 text-sm">
    //         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
    //           <MapPin className="w-4 h-4" />
    //         </div>
    //         <div>
    //           <p className="font-medium">{subscription.center}</p>
    //         </div>
    //       </div>

    //       <div className="flex items-center gap-3 text-sm">
    //         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
    //           <Repeat className="w-4 h-4" />
    //         </div>
    //         <div>
    //           <p className="font-medium">
    //             {subscription.entriesPerDay}{" "}
    //             {subscription.entriesPerDay === 1 ? "entry" : "entries"} per day
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex items-center gap-3 text-sm">
    //         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
    //           <TrendingUp className="w-4 h-4" />
    //         </div>
    //         <div>
    //           <p className="font-medium">
    //             {subscription.entriesPerWeek}{" "}
    //             {subscription.entriesPerWeek === 1 ? "entry" : "entries"} per
    //             week
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex items-center gap-3 text-sm">
    //         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
    //           <Calendar className="w-4 h-4" />
    //         </div>
    //         <div>
    //           <p className="font-medium">{subscription.durationInDays} days</p>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="flex items-baseline gap-2">
    //       <span className="text-4xl font-bold text-primary">
    //         €{subscription.price}
    //       </span>
    //     </div>

    //     {/* Call to Action */}
    //     {/* {onSelect && (
    //       <Button
    //         onClick={() => onSelect(subscription)}
    //         className="w-full mt-4 group-hover:shadow-md transition-shadow"
    //       >
    //         <Check className="w-4 h-4 mr-2" />
    //         Choose This Plan
    //       </Button>
    //     )} */}
    //   </CardContent>

    //   {/* Decorative gradient overlay */}
    //   <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    // </Card>
  );
}

// export function SubscriptionActiveCard({
//   subscription,
// }: {
//   subscription: SubscriptionType;
// }) {
//   return (
//     <Card className="border-success/50 bg-emerald-50">
//       <CardHeader>
//         <CardTitle className="text-xl font-bold">
//           Hai un pacchetto attivo!
//         </CardTitle>
//         <CardDescription className="text-base mt-2">
//           Il tuo pacchetto, {subscription.name}, è attivo e scade il{" "}
//         </CardDescription>
//       </CardHeader>
//     </Card>
//   );
// }
