import { type ActivityType } from "@/db/schema/actitivites";
import DeleteActivity from "./delete-activity";
import EditActivity from "./edit-activity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ListActivities({
  activities,
}: {
  activities: ActivityType[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Center</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No activities found. Add your first activity to get started.
            </TableCell>
          </TableRow>
        ) : (
          activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell>{activity.duration} min</TableCell>
              <TableCell>
                {activity.minParticipants} - {activity.maxParticipants}
              </TableCell>
              <TableCell>{activity.center}</TableCell>
              <TableCell>
                <Badge variant={activity.isActive ? "success" : "destructive"}>
                  {activity.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="justify-end gap-2 flex">
                <EditActivity id={activity.id} />
                <DeleteActivity id={activity.id} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
