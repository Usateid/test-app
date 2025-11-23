"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname } from "@/i18n/routing";
import Link from "next/link";
import { useState } from "react";

export default function ShowWelcomeModal({
  firstName,
}: {
  firstName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname !== "/dashboard/profile/edit");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome {firstName}!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span>Benvenuto nella nostra piattaforma.</span>
          <span>
            Prima di iniziare ad esplorarla, ti invitiamo a completare il tuo
            profilo.
          </span>
        </DialogDescription>
        <DialogFooter>
          <Button asChild onClick={() => setOpen(false)}>
            <Link href="/dashboard/profile/edit">Modifica</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
