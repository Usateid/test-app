import { Loader2, Save } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function FormButton({ pending }: { pending: boolean }) {
  const t = useTranslations("common");
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {pending ? t("saving") : t("saveChanges")}
    </Button>
  );
}
