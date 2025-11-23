import DesktopHeader from "@/components/layout/header/desktop";
import PageLayout from "@/components/common/page-layout";

export default async function MainLayout({
  isAuthenticated = false,
  children,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  return (
    <>
      <DesktopHeader isAuthenticated={isAuthenticated} />
      <PageLayout>{children}</PageLayout>
    </>
  );
}
