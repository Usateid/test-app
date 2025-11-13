import SubscriptionCard from "@/components/layout/cards/subscription";
import { getSubscriptions } from "@/db/query/subscriptions";

export default async function UserSubscriptionsList() {
  const availableSubscriptions = await getSubscriptions();
  if (availableSubscriptions.length === 0) {
    return <div>No subscriptions found</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="group relative flex w-full snap-x snap-mandatory gap-8 items-start overflow-x-auto overflow-y-hidden justify-start pl-4 lg:pl-0"> */}
      {availableSubscriptions.map((subscription) => (
        <div key={subscription.id}>
          <SubscriptionCard subscription={subscription} />
        </div>
      ))}
    </div>
  );
}
