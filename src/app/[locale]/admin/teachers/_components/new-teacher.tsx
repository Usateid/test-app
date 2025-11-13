"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTeacherInvitation } from "@/db/query/teacher-invitation";
import { useActionState, useState, useEffect } from "react";
import { ActionState } from "@/db/utils";
import GenericForm from "@/components/common/generic-form";
import { Copy, CheckCircle2 } from "lucide-react";

export default function NewTeacher() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const options = [
    { name: "email", type: "email" },
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
  ];

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createTeacherInvitation,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success && !open) {
      setCopied(false);
    }
  }, [state.success, open]);

  const handleCopyLink = () => {
    if (state.magicLink) {
      navigator.clipboard.writeText(state.magicLink as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Teacher</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        {!state.success ? (
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>Create Teacher Invitation</DialogTitle>
              <DialogDescription>
                Enter the teacher&apos;s information to generate a registration
                link.
              </DialogDescription>
            </DialogHeader>
            <GenericForm options={options} state={state} />
            {state.error && (
              <p className="text-sm text-red-500 mt-2">{state.error}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create Invitation"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Teacher Invitation Created!</DialogTitle>
              <DialogDescription>
                Copy the magic link below and send it to the teacher.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <input
                  type="text"
                  value={state.magicLink as string}
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This link will expire in 7 days.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => setOpen(false)}>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
