import { getTranslations } from "next-intl/server";

type Props = {
  firstName: string;
};

export default async function WelcomeMessage({ firstName }: Props) {
  const t = await getTranslations("dashboard");
  // Ottiene l'ora attuale per un saluto appropriato
  const currentHour = new Date().getHours();
  let greeting = t("greeting.morning");
  if (currentHour >= 12 && currentHour < 18) {
    greeting = t("greeting.afternoon");
  } else if (currentHour >= 18) {
    greeting = t("greeting.evening");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, {firstName}! 👋
      </h1>
      <p className="text-muted-foreground">{t("welcome")}</p>
    </div>
  );
}
