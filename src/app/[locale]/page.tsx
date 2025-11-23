import { Button } from "@/components/ui/button";
import { getServerSession } from "../../hooks/server-session";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import MainLayout from "@/components/layout/main";
import { DesktopHeader } from "@/components/layout/desktop-header";
import { HeroSection } from "@/components/layout/hero-section";
import { ClassesSection } from "@/components/layout/classes-section";
import { AboutSection } from "@/components/layout/about-section";
import { ContactSection } from "@/components/layout/contact-section";

export default async function Home() {
  const { isAuthenticated } = await getServerSession();
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Header */}
      <DesktopHeader isAuthenticated={isAuthenticated} />

      {/* Main Content */}
      <main>
        <HeroSection />
        <ClassesSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
