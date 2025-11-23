import CardProductDemo from "@/components/ui/card-image";
import { SubscriptionType } from "@/db/schema/subscriptions";
import { UserSubscriptionType } from "@/db/query/user-subscriptions";

export default async function UserSubscriptionsList({
  availableSubscriptions,
  userId,
  activeSubscriptions,
}: {
  availableSubscriptions: SubscriptionType[];
  activeSubscriptions: UserSubscriptionType[];
  userId?: string;
}) {
  if (availableSubscriptions.length === 0) {
    return <div>No subscriptions found</div>;
  }

  const lastActiveSubscription =
    activeSubscriptions[activeSubscriptions.length - 1];
  return (
    <div className="flex flex-col gap-4">
      {availableSubscriptions.map((subscription) => (
        <CardProductDemo
          key={subscription.id}
          subscription={subscription}
          userId={userId}
          activeSubscriptions={lastActiveSubscription}
        />
      ))}
    </div>
  );
}
