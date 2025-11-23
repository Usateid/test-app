"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, Calendar, Repeat, MapPin, Euro } from "lucide-react";
import { SubscriptionType } from "@/db/schema/subscriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubscriptionConfirmationDialog from "@/components/layout/cards/subscription/subscription-confirmation-dialog";
import { cn } from "@/lib/utils";

interface AllSubscriptionsProps {
  subscriptions: SubscriptionType[];
  userId?: string;
}

export default function AllSubscriptions({
  subscriptions,
  userId,
}: AllSubscriptionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const matchesSearch =
        subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || subscription.status === statusFilter;

      const matchesCenter =
        centerFilter === "all" || subscription.center === centerFilter;

      return matchesSearch && matchesStatus && matchesCenter;
    });
  }, [subscriptions, searchQuery, statusFilter, centerFilter]);

  const handleSelectSubscription = (subscription: SubscriptionType) => {
    setSelectedSubscription(subscription);
    setDialogOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              All Subscriptions
            </h1>
            <p className="text-muted-foreground mt-1">
              Choose the perfect plan for your fitness journey
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={centerFilter} onValueChange={setCenterFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                <SelectItem value="Vasto">Vasto</SelectItem>
                <SelectItem value="Pescara">Pescara</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
          subscriptions
        </div>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              userId={userId}
              onSelect={() => handleSelectSubscription(subscription)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <Sparkles className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No subscriptions found
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      {/* {userId && selectedSubscription && (
        <SubscriptionConfirmationDialog
          subscription={selectedSubscription}
          userId={userId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )} */}
    </div>
  );
}

interface SubscriptionCardProps {
  subscription: SubscriptionType;
  userId?: string;
  onSelect: () => void;
}

function SubscriptionCard({
  subscription,
  userId,
  onSelect,
}: SubscriptionCardProps) {
  const isActive = subscription.status === "active";
  const isVasto = subscription.center === "Vasto";

  return (
    <Card
      className={cn(
        "group relative h-full flex flex-col border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 overflow-hidden",
        !isActive && "opacity-75"
      )}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          variant={isActive ? "success" : "secondary"}
          className="shadow-sm"
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Decorative Gradient */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 transition-opacity",
          isActive
            ? "bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-60 group-hover:opacity-100"
            : "bg-gradient-to-r from-muted via-muted to-muted"
        )}
      />

      <CardHeader className="pb-4 pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
              {subscription.name}
            </CardTitle>
          </div>
          {subscription.description && (
            <CardDescription className="text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {subscription.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Center Badge */}
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <Badge
            variant={isVasto ? "default" : "secondary"}
            className="text-xs"
          >
            {subscription.center}
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Weekly Entries */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/70">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
              <Repeat className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                Weekly Entries
              </p>
              <p className="font-semibold text-sm text-card-foreground">
                {subscription.entriesPerWeek}{" "}
                {subscription.entriesPerWeek === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>

          {/* Daily Entries */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/70">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
              <Calendar className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                Daily Entries
              </p>
              <p className="font-semibold text-sm text-card-foreground">
                {subscription.entriesPerDay}{" "}
                {subscription.entriesPerDay === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>

          {/* Duration */}
          {subscription.durationInDays > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/70">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                <Calendar className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  Duration
                </p>
                <p className="font-semibold text-sm text-card-foreground">
                  {subscription.durationInDays}{" "}
                  {subscription.durationInDays === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4 pt-6">
        {/* Price */}
        <div className="flex items-baseline justify-center w-full gap-2">
          <Euro className="size-5 text-muted-foreground" />
          <span className="text-4xl font-bold text-card-foreground">
            {subscription.price}
          </span>
        </div>

        {/* Action Button */}
        <Button
          size="lg"
          className="w-full group-hover:shadow-md transition-all duration-300"
          variant={isActive ? "default" : "outline"}
          onClick={onSelect}
          disabled={!userId || !isActive}
        >
          {isActive ? "Select Plan" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
