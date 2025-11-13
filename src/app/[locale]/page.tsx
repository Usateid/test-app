import { Button } from "@/components/ui/button";
import { getServerSession } from "../../hooks/server-session";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const { isAuthenticated, userInfo } = await getServerSession();
  const t = await getTranslations("common");

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {isAuthenticated ? (
          <div>
            <h1>
              {t("welcome")} {userInfo?.firstName} {userInfo?.lastName}
            </h1>
            <Link href="/dashboard/profile">Profile</Link>
          </div>
        ) : (
          <div>
            <h1>{t("welcome")} to the platform</h1>
            <Link href="/login">Login</Link>
          </div>
        )}
      </main>
    </div>
  );
}
