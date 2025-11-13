import { SubscriptionType } from "@/db/schema/subscriptions";
import DeleteSubscription from "./delete";
import EditSubscription from "./edit";
import { formatDateRange } from "@/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_STATUS } from "@/utils/const";
export default function ListSubscriptions({
  subscriptions,
}: {
  subscriptions: SubscriptionType[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Active Period</TableHead>
          <TableHead className="text-center">Entries per day</TableHead>
          <TableHead className="text-center">Entries per week</TableHead>
          <TableHead>Center</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell className="font-medium">{subscription.name}</TableCell>
            <TableCell>
              <Badge
                variant={
                  subscription.status === SUBSCRIPTION_STATUS.Active
                    ? "success"
                    : "destructive"
                }
              >
                {subscription.status}
              </Badge>
            </TableCell>
            <TableCell className="font-bold">{subscription.price} €</TableCell>
            <TableCell>
              {subscription.fromDate && subscription.toDate
                ? formatDateRange(subscription.fromDate, subscription.toDate)
                : "Always active"}
            </TableCell>
            <TableCell className="text-center">
              {subscription.entriesPerDay}
            </TableCell>
            <TableCell className="text-center">
              {subscription.entriesPerWeek}
            </TableCell>
            <TableCell>{subscription.center}</TableCell>
            <TableCell className="justify-end gap-2 flex">
              <EditSubscription id={subscription.id} />
              <DeleteSubscription id={subscription.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
