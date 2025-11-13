import { getActivities } from "@/db/query/activities";
import NewActivity from "./_components/new-activity";
import ListActivities from "./_components/list-activities";

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered activities
          </p>
        </div>
        <NewActivity />
      </div>

      <div className="w-full">
        <ListActivities activities={activities} />
      </div>
    </div>
  );
}
