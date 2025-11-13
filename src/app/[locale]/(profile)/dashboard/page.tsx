import { getServerSession } from "@/hooks/server-session";
import WelcomeMessage from "@/components/profile/user/welcome-message";
import DailyQuote from "@/components/common/daily-quote";
import NextLessons from "@/components/profile/user/next-lessons";
import ActiveSubscriptions from "@/components/profile/user/active-subscriptions";

export default async function DashboardPage() {
  const { userInfo } = await getServerSession();

  if (!userInfo) {
    return null;
  }

  return (
    <div className="mt-4 px-4 space-y-6">
      {userInfo.firstName && <WelcomeMessage firstName={userInfo.firstName} />}
      <DailyQuote />

      <div className="grid gap-6 md:grid-cols-2">
        {userInfo.userId && <NextLessons userId={userInfo.userId} />}

        {userInfo.userId && <ActiveSubscriptions userId={userInfo.userId} />}
      </div>
    </div>
  );
}
