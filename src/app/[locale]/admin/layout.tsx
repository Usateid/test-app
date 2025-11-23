import { getServerSession } from "@/hooks/server-session";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userInfo } = await getServerSession();

  // Add in middleware
  if (!isAuthenticated || userInfo?.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="mt-4 px-4 max-w-5xl mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
