import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default function EditSubscription({ id }: { id: string }) {
  return (
    <Link href={`/admin/subscriptions/${id}`}>
      <Button variant="outline" size="sm">
        <Pencil className="size-4" />
      </Button>
    </Link>
  );
}
