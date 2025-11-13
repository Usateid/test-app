import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserInformation } from "@/db/query/user";
import { redirect } from "next/navigation";
import { type UserProfileData } from "@/utils/types/user";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return {
      isAuthenticated: false,
      session,
      userInfo: null,
      firstLogin: false,
    };
  } else {
    const userInfo = await getUserInformation(session.user.id);
    return {
      isAuthenticated: true,
      session,
      userInfo,
      firstLogin: !userInfo?.address,
      signOut: async () => {
        await auth.api.signOut({ headers: await headers() });
        redirect("/");
      },
    };
  }
}
