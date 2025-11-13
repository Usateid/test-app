import { Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getTranslations } from "next-intl/server";

export default async function DailyQuote() {
  const quotes = await getTranslations("quotes");
  const t = await getTranslations("dashboard");

  function getDailyQuote(quotes: Array<{ text: string; author: string }>) {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24
    );
    return quotes[dayOfYear % quotes.length];
  }

  // Get quotes array from translations
  const quotesArray = Array.from({ length: 7 }, (_, i) => ({
    text: quotes(`${i}.text`),
    author: quotes(`${i}.author`),
  }));

  const dailyQuote = getDailyQuote(quotesArray);

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{t("quoteOfDay")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote className="space-y-2">
          <p className="text-lg font-medium italic">
            &quot;{dailyQuote.text}&quot;
          </p>
          <footer className="text-sm text-muted-foreground">
            — {dailyQuote.author}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
