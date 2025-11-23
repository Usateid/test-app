import { getTranslations } from "next-intl/server";

type Props = {
  firstName: string;
};

export default async function WelcomeMessage({ firstName }: Props) {
  // const t = await getTranslations("dashboard");
  // const currentHour = new Date().getHours();
  // let greeting = t("greeting.morning");
  // if (currentHour >= 12 && currentHour < 18) {
  //   greeting = t("greeting.afternoon");
  // } else if (currentHour >= 18) {
  //   greeting = t("greeting.evening");
  // }

  return (
    <div className="space-y-1 text-primary-foreground">
      <h1 className="font-semibold">Ciao {firstName}! 👋</h1>
      <p className="text-xl font-bold">Benvenuto nella tua area personale</p>
    </div>
  );
}
