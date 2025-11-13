import { UserProfileData } from "@/utils/types/user";
import { UserCircle2, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserHeader({
  userInfo,
}: {
  userInfo: UserProfileData;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <ArrowLeft className="size-6" />
        </div>
        <div className="font-semibold tracking-tight">Profile</div>
        <div>
          {" "}
          <Edit className="size-6" />
        </div>
      </div>
      <div className="flex justify-center">
        {userInfo.image ? (
          <img
            src={userInfo.image}
            alt={`${userInfo.firstName} ${userInfo.lastName}`}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <UserCircle2 className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
    // <div className="flex justify-between items-center">
    //   <div className="flex items-center gap-4">
    //     {userInfo.image ? (
    //       <img
    //         src={userInfo.image}
    //         alt={`${userInfo.firstName} ${userInfo.lastName}`}
    //         className="w-20 h-20 rounded-full object-cover"
    //       />
    //     ) : (
    //       <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
    //         <UserCircle2 className="w-12 h-12 text-muted-foreground" />
    //       </div>
    //     )}
    //     <div>
    //       <h1 className="text-xl font-bold tracking-tight">
    //         {userInfo.firstName}
    //       </h1>
    //     </div>
    //   </div>
    //   <Link href="/dashboard/profile/edit">
    //     <Button>
    //       <Edit className="size-4" />
    //     </Button>
    //   </Link>
    // </div>
  );
}
