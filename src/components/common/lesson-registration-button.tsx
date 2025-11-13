"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  registerUserToLesson,
  cancelLessonRegistration,
} from "@/db/query/lesson-registrations";
import { useRouter } from "next/navigation";

interface LessonRegistrationButtonProps {
  lessonId: string;
  userId: string;
  isRegistered: boolean;
  hasSubscription: boolean;
  lessonStartTime: Date;
  lessonStatus: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function LessonRegistrationButton({
  lessonId,
  userId,
  isRegistered: initialIsRegistered,
  hasSubscription,
  lessonStartTime,
  lessonStatus,
  variant = "default",
  size = "default",
  className,
}: LessonRegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const isPast = new Date(lessonStartTime) < new Date();
  const isScheduled = lessonStatus === "scheduled";
  const canRegister = hasSubscription && !isPast && isScheduled;

  const handleRegistration = async () => {
    if (!canRegister) {
      if (!hasSubscription) {
        setMessage({
          type: "error",
          text: "Devi avere un abbonamento attivo per registrarti",
        });
      } else if (isPast) {
        setMessage({
          type: "error",
          text: "Non puoi registrarti a una lezione passata",
        });
      } else if (!isScheduled) {
        setMessage({
          type: "error",
          text: "Questa lezione non è disponibile per la registrazione",
        });
      }
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await registerUserToLesson(userId, lessonId);

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

    const result = await cancelLessonRegistration(userId, lessonId);

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

  return (
    <div className={className}>
      {isRegistered ? (
        <Button
          variant="outline"
          size={size}
          onClick={handleCancellation}
          disabled={isLoading || isPast}
          className="w-full"
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
          variant={variant}
          size={size}
          onClick={handleRegistration}
          disabled={isLoading || !canRegister}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrazione...
            </>
          ) : (
            "Registrati"
          )}
        </Button>
      )}

      {message && (
        <div
          className={`flex items-center gap-2 text-sm p-2 rounded mt-2 ${
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
