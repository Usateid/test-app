import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";

export default function UserPicture() {
  return (
    <div>
      <Avatar className="size-32 border-2 border-slate-200">
        <AvatarImage
          src="/t-c.jpeg"
          alt="User Picture"
          className="object-cover"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
