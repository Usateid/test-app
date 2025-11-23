import { getServerSession } from "@/hooks/server-session";
import WelcomeMessage from "@/components/profile/user/welcome-message";
import ActivitiesList from "@/components/activities";
import LessonsListByUser from "@/components/lessons/list-by-user";
import AppMenu from "@/components/layout/app-menu";

export default async function DashboardPage() {
  const { userInfo } = await getServerSession();

  if (!userInfo) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="relative lg:flex lg:justify-center">
        {/* Background gradient that covers WelcomeMessage and AppMenu */}
        <div className="absolute inset-x-0 top-0 pointer-events-none bg-gradient-to-b from-relief to-transparent h-full" />
        <div className="relative z-10 flex flex-col gap-6 pt-10">
          <div className="flex justify-between items-center mx-4">
            {userInfo.firstName && (
              <WelcomeMessage firstName={userInfo.firstName} />
            )}
          </div>
          <AppMenu />
        </div>
      </div>
      {/* <DailyQuote /> */}
      <div className="lg:flex lg:justify-center">
        <ActivitiesList />
      </div>
      <div className="lg:flex lg:justify-center">
        <LessonsListByUser userId={userInfo.userId} />
      </div>
    </div>
  );
}
