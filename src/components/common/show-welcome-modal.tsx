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
import Link from "next/link";
import { useState } from "react";

export default function ShowWelcomeModal({
  firstName,
}: {
  firstName?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome {firstName}!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Since this is your first login, please take a moment to fill out your
          profile.
        </DialogDescription>
        <DialogFooter className="w-full">
          <Link href="/dashboard/profile/edit">
            <Button onClick={() => setOpen(false)}>Go to Profile</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
