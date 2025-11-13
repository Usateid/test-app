import { getSubscriptions } from "@/db/query/subscriptions";
import NewSubscription from "./_component/new";
import { formatDateRange } from "@/utils";
import DeleteSubscription from "./_component/delete";
import ListSubscriptions from "./_component/list";

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();
  return (
    <div>
      <h1>Subscriptions: {subscriptions.length}</h1>
      <NewSubscription />
      <div className="w-full">
        <ListSubscriptions subscriptions={subscriptions} />
      </div>
    </div>
  );
}
