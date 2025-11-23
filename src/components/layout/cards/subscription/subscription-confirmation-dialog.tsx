"use client";

import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubscriptionType } from "@/db/schema/subscriptions";
import { useActionState } from "react";

import {
  addUserSubscription,
  UserSubscriptionType,
} from "@/db/query/user-subscriptions";
import { ActionState } from "@/db/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { formatDateYearMonthDay } from "@/utils";
import { Badge } from "@/components/ui/badge";
interface SubscriptionConfirmationDialogProps {
  subscription: SubscriptionType;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSubscriptions: UserSubscriptionType;
}

export default function SubscriptionConfirmationDialog({
  subscription,
  userId,
  open,
  onOpenChange,
  activeSubscriptions,
}: SubscriptionConfirmationDialogProps) {
  const t = useTranslations("subscriptions");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addUserSubscription,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      router.refresh();
    }
  }, [state.success, router, onOpenChange]);

  const activeSubscriptionExpiresAt = activeSubscriptions.expiresAt;
  const startDate = activeSubscriptionExpiresAt
    ? new Date(activeSubscriptionExpiresAt.getTime() + 1 * 24 * 60 * 60 * 1000)
    : new Date();
  const endDate = activeSubscriptionExpiresAt
    ? new Date(
        activeSubscriptionExpiresAt.getTime() +
          subscription.durationInDays * 24 * 60 * 60 * 1000
      )
    : new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogTitle>{t("confirmPurchase")}</DialogTitle>
        <DialogDescription>{t("reviewSubscriptionDetails")}</DialogDescription>
        <div className="space-y-4 bg-white dark:bg-background rounded-lg p-4">
          {/* Subscription Name */}
          <div className="flex items-center gap-3 justify-between">
            <p className="font-semibold text-primary">{subscription.name}</p>
          </div>
          <div className="flex items-center gap-3 justify-between">
            <p className="font-semibold text-primary">€{subscription.price}</p>
          </div>

          {/* Entries per week */}
          <div className="flex items-center gap-3 justify-between">
            <p className="font-medium">
              {subscription.entriesPerWeek} Ingressi settimanali
            </p>
          </div>
          {/* Start Date */}
          <div className="flex items-center gap-3 justify-between">
            <p className="text-sm text-muted-foreground">{t("startDate")}</p>
            <p className="font-semibold text-primary">
              {formatDateYearMonthDay(startDate)}
            </p>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-3 justify-between">
            <p className="text-sm text-muted-foreground">{t("endDate")}</p>
            <p className="font-semibold text-primary">
              {formatDateYearMonthDay(endDate)}
            </p>
          </div>
        </div>
        {activeSubscriptionExpiresAt && (
          <Badge variant="outline" className="flex flex-col gap-2">
            <p>Hai gia' un abbonamento attivo che scade il: </p>
            <p className="font-semibold text-primary">
              {formatDateYearMonthDay(activeSubscriptionExpiresAt)}
            </p>
          </Badge>
        )}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <form action={formAction} className="inline">
            <input type="hidden" name="userId" value={userId} />
            <input
              type="hidden"
              name="subscriptionId"
              value={subscription.id}
            />
            <input
              type="hidden"
              name="durationInDays"
              value={subscription.durationInDays}
            />
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {tCommon("saving")}
                </>
              ) : (
                t("confirmPurchase")
              )}
            </Button>
          </form>
        </DialogFooter>

        {state.error && (
          <p className="text-sm text-destructive mt-2 text-center">
            {state.error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
