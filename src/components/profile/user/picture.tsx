import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";

interface UserPictureProps {
  imageUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function UserPicture({
  imageUrl,
  firstName,
  lastName,
  size = "lg",
}: UserPictureProps) {
  const sizeClasses = {
    sm: "size-10",
    md: "size-16",
    lg: "size-32",
  };

  const fallbackText =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : "CN";

  return (
    <div>
      <Avatar className={`${sizeClasses[size]} border-2 border-slate-200`}>
        {imageUrl ? (
          <AvatarImage
            src={imageUrl}
            alt="User Picture"
            className="object-cover"
          />
        ) : null}
        <AvatarFallback>
          {imageUrl ? null : (
            <UserCircle2
              className={`${
                size === "lg" ? "size-16" : size === "md" ? "size-10" : "size-6"
              } text-muted-foreground`}
            />
          )}
          {!imageUrl && size !== "lg" && fallbackText}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
