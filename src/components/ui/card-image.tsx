"use client";

import { useState } from "react";
import { Calendar, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import { SubscriptionType } from "@/db/schema/subscriptions";
import SubscriptionConfirmationDialog from "@/components/layout/cards/subscription/subscription-confirmation-dialog";
import { UserSubscriptionType } from "@/db/query/user-subscriptions";

const CardProductDemo = ({
  subscription,
  userId,
  activeSubscriptions,
}: {
  subscription: SubscriptionType;
  userId?: string;
  activeSubscriptions: UserSubscriptionType;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {/* <Card key={sub.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{sub.name}</CardTitle>
              <CardDescription>
                {sub.type === 'monthly' ? 'Monthly Subscription' : 'Class Pack'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-3xl font-bold mb-4">${sub.price}</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {sub.credits} Class Credits
                </li>
                {sub.durationDays && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Valid for {sub.durationDays} days
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Access to all centers
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <form action={purchaseSubscription} className="w-full">
                <input type="hidden" name="subscriptionId" value={sub.id} />
                <Button type="submit" className="w-full">Choose Plan</Button>
              </form>
            </CardFooter>
          </Card> */}

      <Card className="group relative h-full flex flex-col border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary transition-colors">
                  {subscription.name}
                </div>
                <span className="text-xl font-bold">€{subscription.price}</span>
              </CardTitle>
              {subscription.description && (
                <CardDescription className="text-muted-foreground line-clamp-2">
                  {subscription.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features grid */}
          <div className="grid grid-cols-1 gap-3">
            {/* Entries per week */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 transition-colors">
              <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary">
                <Repeat className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Weekly entries</p>
                <p className="font-medium text-sm text-card-foreground">
                  {subscription.entriesPerWeek}{" "}
                  {subscription.entriesPerWeek === 1 ? "entry" : "entries"} per
                  week
                </p>
              </div>
            </div>

            {/* Duration */}
            {subscription.durationInDays > 0 && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 transition-colors">
                <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-sm text-card-foreground">
                    {subscription.durationInDays}{" "}
                    {subscription.durationInDays === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button
            size="lg"
            className="w-full group-hover:shadow-md transition-all duration-300"
            variant="default"
            onClick={() => setDialogOpen(true)}
            disabled={!userId}
          >
            Select Plan
          </Button>
        </CardFooter>
      </Card>

      {userId && (
        <SubscriptionConfirmationDialog
          subscription={subscription}
          userId={userId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          activeSubscriptions={activeSubscriptions}
        />
      )}
    </>
  );
};

export default CardProductDemo;
