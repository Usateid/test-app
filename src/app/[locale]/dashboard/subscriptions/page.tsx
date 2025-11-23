import { getSubscriptions } from "@/db/query/subscriptions";
import { getServerSession } from "@/hooks/server-session";

import UserSubscriptionsHistory from "@/components/profile/user/subscriptions-history";
import UserSubscriptionsList from "@/components/profile/user/subscriptions/list";
import { getUserActiveSubscriptions } from "@/db/query/user-subscriptions";

export default async function SubscriptionsPage() {
  const { userId } = await getServerSession();
  if (!userId) {
    return null;
  }
  const availableSubscriptions = await getSubscriptions();
  const activeSubscriptions = await getUserActiveSubscriptions(userId);

  return (
    <div className="text-primary">
      <div className="text-center text-2xl font-bold my-5">
        Scegli il tuo abbonamento!
      </div>
      <div className="m-4">
        <div className="mb-6">
          <UserSubscriptionsHistory activeSubscriptions={activeSubscriptions} />
        </div>
        <UserSubscriptionsList
          availableSubscriptions={availableSubscriptions}
          activeSubscriptions={activeSubscriptions}
          userId={userId}
        />
      </div>
    </div>
  );
}
