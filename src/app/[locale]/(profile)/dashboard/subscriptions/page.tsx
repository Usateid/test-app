import PageLayout from "@/components/common/page-layout";
// import UserSubscriptions from "@/components/profile/user/subscriptions";
import UserSubscriptionsList from "@/components/profile/user/subscriptions/list";
import { Suspense } from "react";

export default async function SubscriptionsPage() {
  return (
    <PageLayout
      title="Subscriptions"
      description="Manage your subscriptions"
      usePadding
    >
      {/* <Suspense fallback={<div>Loading...</div>}>
        <UserSubscriptions />
      </Suspense> */}
      <Suspense fallback={<div>Loading...</div>}>
        <UserSubscriptionsList />
      </Suspense>
    </PageLayout>
  );
}
