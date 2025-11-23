import { DesktopHeader } from "@/components/layout/desktop-header";
import { getServerSession } from "@/hooks/server-session";
import ShowWelcomeModal from "@/components/common/show-welcome-modal";
import PageLayout from "@/components/common/page-layout";
import { useRouter } from "@/i18n/routing";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userInfo } = await getServerSession();

  return (
    <>
      <DesktopHeader isAuthenticated={isAuthenticated} />
      <PageLayout>
        <div className="md:max-w-5xl lg:max-w-full mx-auto">{children}</div>
      </PageLayout>
      {/* {firstLogin && <ShowWelcomeModal firstName={userInfo?.firstName ?? ""} />} */}
    </>
  );
}
