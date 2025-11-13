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
import { addSubscription } from "@/db/query/subscriptions";
import { useActionState, useState } from "react";
import { ActionState } from "@/db/utils";
import GenericForm from "@/components/common/generic-form";
import { useEffect } from "react";
import { CENTERS } from "@/utils/const";

export default function NewSubscription() {
  const [open, setOpen] = useState(false);
  const options = [{ name: "name", type: "text" }];

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addSubscription,
    { fieldErrors: {} }
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new Subscription</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add new Subscription</DialogTitle>
          </DialogHeader>
          <GenericForm options={options} state={state} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
