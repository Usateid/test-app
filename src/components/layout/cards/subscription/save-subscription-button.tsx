"use client";
import { Button } from "@/components/ui/button";
import { addUserSubscription } from "@/db/query/user-subscriptions";
import { useActionState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SaveSubscriptionButton({
  userId,
  subscriptionId,
  durationInDays,
}: {
  userId: string;
  subscriptionId: string;
  durationInDays: number;
}) {
  const t = useTranslations("subscriptions");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addUserSubscription,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      <input type="hidden" name="durationInDays" value={durationInDays} />
      <Button type="submit" disabled={pending} variant="outline" size="sm">
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {tCommon("saving")}
          </>
        ) : (
          t("chooseThisPlan")
        )}
      </Button>
      {state.error && (
        <p className="text-sm text-red-500 mt-2">{state.error}</p>
      )}
    </form>
  );
}
