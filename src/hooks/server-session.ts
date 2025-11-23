import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserInformation,
  type UserInformationWithEmailAndImage,
} from "@/db/query/user";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return {
      isAuthenticated: false,
      session,
      userInfo: null,
      userId: null,
      // firstLogin: false,
    };
  } else {
    const userInfo = await getUserInformation(session.user.id);
    return {
      isAuthenticated: true,
      session,
      userInfo,
      userId: session.user.id,
      // firstLogin: !userInfo?.address,
      // firstLogin: false,
      signOut: async () => {
        await auth.api.signOut({ headers: await headers() });
        redirect("/");
      },
    };
  }
}
