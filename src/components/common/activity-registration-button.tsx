"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  registerUserToActivity,
  cancelActivityRegistration,
} from "@/db/query/activity-registrations";
import { useRouter } from "next/navigation";

interface ActivityRegistrationButtonProps {
  activityId: string;
  userId: string;
  isRegistered: boolean;
  hasSubscription: boolean;
  redirectUrl?: string | null;
}

export function ActivityRegistrationButton({
  activityId,
  userId,
  isRegistered: initialIsRegistered,
  hasSubscription,
  redirectUrl,
}: ActivityRegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleRegistration = async () => {
    if (!hasSubscription) {
      setMessage({
        type: "error",
        text: "Devi avere un abbonamento attivo per registrarti",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await registerUserToActivity(userId, activityId);

    setIsLoading(false);

    if (result.success) {
      setIsRegistered(true);
      setMessage({
        type: "success",
        text: result.message || "Registrazione completata!",
      });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: result.error || "Errore durante la registrazione",
      });
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancellation = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await cancelActivityRegistration(userId, activityId);

    setIsLoading(false);

    if (result.success) {
      setIsRegistered(false);
      setMessage({
        type: "success",
        text: result.message || "Registrazione cancellata",
      });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: result.error || "Errore durante la cancellazione",
      });
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  // If there's a redirect URL, show the external booking button
  if (redirectUrl) {
    return (
      <Button asChild className="w-full">
        <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
          Prenota ora
        </a>
      </Button>
    );
  }

  return (
    <div className="w-full space-y-2">
      {isRegistered ? (
        <Button
          className="w-full"
          variant="destructive"
          onClick={handleCancellation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancellazione...
            </>
          ) : (
            "Cancella registrazione"
          )}
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={handleRegistration}
          disabled={isLoading || !hasSubscription}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrazione...
            </>
          ) : (
            "Registrati all'attività"
          )}
        </Button>
      )}

      {message && (
        <div
          className={`flex items-center gap-2 text-sm p-2 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
