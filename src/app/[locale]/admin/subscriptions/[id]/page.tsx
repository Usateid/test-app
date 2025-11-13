import { getSubscriptionById } from "@/db/query/subscriptions";
import EditSubscriptionForm from "./_components/edit-form";
import { redirect } from "next/navigation";

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const subscription = await getSubscriptionById(id);

  if (!subscription) {
    redirect("/admin/subscriptions");
  }

  return <EditSubscriptionForm subscription={subscription} />;
}
