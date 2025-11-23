import { getActivities } from "@/db/query/activities";

import ScrollableCards from "@/components/common/scrollable-cards";
import DogTag from "@/components/common/scrollable-cards/dog-tag";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default async function ActivitiesList() {
  const limitActivities = 3;
  const activities = await getActivities({ limit: limitActivities });

  return (
    <div className="space-y-2">
      <div className="flex justify-between px-4 pt-2">
        <h1 className="text-lg font-semibold tracking-tight">
          Attività disponibili
        </h1>

        {activities.length > limitActivities && (
          <Link href="/activities">
            <Badge variant="outline">View All</Badge>
          </Link>
        )}
      </div>

      <ScrollableCards>
        {activities.map((activity) => (
          <DogTag
            key={activity.id}
            className={activities.length === 1 ? "w-full" : "w-96"}
          >
            <div>
              <h2 className="font-semibold text-lg mb-2 text-gray-800 truncate">
                {activity.name}
              </h2>
              {activity.date && (
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              )}
              <div className="text-sm text-gray-600 line-clamp-3 mb-2">
                {activity.description}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              {activity.duration && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {activity.duration} min
                </span>
              )}
              {activity.center && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">
                  {activity.center}
                </span>
              )}
              {/* You can add more activity details here if needed */}
            </div>
          </DogTag>
        ))}
      </ScrollableCards>
    </div>
  );
}
