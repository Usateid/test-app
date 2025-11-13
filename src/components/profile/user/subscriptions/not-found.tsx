import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserSubscriptionsNotFound() {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle>No subscriptions found</CardTitle>
      </CardHeader>
    </Card>
  );
}
