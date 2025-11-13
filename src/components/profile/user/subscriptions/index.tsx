import { getUserActiveSubscriptions } from "@/db/query/user-subscriptions";
import { getServerSession } from "@/hooks/server-session";
import SubscriptionsNotFound from "./not-found";
// import { SubscriptionActiveCard } from "@/components/layout/cards/subscription";
export default async function UserSubscriptions() {
  const { userInfo } = await getServerSession();

  if (!userInfo || !userInfo.userId) {
    return <div>No user found</div>;
  }

  const subscriptions = await getUserActiveSubscriptions(userInfo?.userId);

  if (subscriptions.length === 0) {
    return <SubscriptionsNotFound />;
  }
  return subscriptions.map((s, index) => (
    <div key={index}>
      test
      {/* <SubscriptionActiveCard subscription={s} /> */}
    </div>
  ));
}
