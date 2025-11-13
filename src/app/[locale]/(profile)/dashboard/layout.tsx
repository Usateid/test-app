import DesktopHeader from "@/components/layout/header/desktop";
import MobileBottomTabs from "@/components/layout/header/mobile";
import { getServerSession } from "@/hooks/server-session";
import ShowWelcomeModal from "@/components/common/show-welcome-modal";
import PageLayout from "@/components/common/page-layout";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userInfo, firstLogin } = await getServerSession();

  return (
    <>
      <DesktopHeader isAuthenticated={isAuthenticated} />
      <PageLayout>
        <div className="mb-20 max-w-5xl mx-auto">{children}</div>
      </PageLayout>
      {firstLogin && <ShowWelcomeModal firstName={userInfo?.firstName ?? ""} />}
      <MobileBottomTabs isAuthenticated={isAuthenticated} />
    </>
  );
}
