import { getServerSession } from "@/hooks/server-session";
import { redirect } from "next/navigation";
import EditProfileForm from "./_components/edit-profile-form";

export default async function ProfileEditPage() {
  const { isAuthenticated, userInfo } = await getServerSession();

  if (!isAuthenticated || !userInfo) {
    redirect("/login");
  }

  return <EditProfileForm userProfile={userInfo} />;
}
