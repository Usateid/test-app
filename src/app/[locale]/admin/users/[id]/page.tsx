import { getUserById } from "@/db/query/user";
import { getUserActiveSubscriptions } from "@/db/query/user-subscriptions";
import EditUserForm from "./_components/edit-form";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const { userInformation } = await getUserById(id);
  const t = await getTranslations("common");

  if (!userInformation) {
    redirect("/admin/users");
  }

  const userSubscriptions = await getUserActiveSubscriptions(id);

  return (
    <div className="space-y-6 mt-32">
      <EditUserForm user={{ ...userInformation, id }} />
      <div className="border rounded-lg bg-white p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {userSubscriptions.length === 0 ? (
            <div>{t("noSubscriptionsFound")}</div>
          ) : (
            userSubscriptions.map((subscription) => (
              <div key={subscription.id}>{subscription.name}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
