"use client";

import { Link, usePathname } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ModeToggle } from "@/components/toggler/theme-toggle";
import { useTranslations } from "next-intl";
import { ACTIVE_SETTINGS } from "@/utils/const";
import { Button } from "@/components/ui/button";
import { Menu, Home, Book, Plus, CreditCard, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [{ name: "Blogs", href: "/blog" }];

const userTabs = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Blog", href: "/blog", icon: Book },
  { name: "Prenota", href: "/dashboard/booking", icon: Plus },
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  { name: "Profilo", href: "/dashboard/profile", icon: User },
];

export default function DesktopHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background-secondary backdrop-blur-sm border-b border-sage-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-semibold text-sage-900 dark:text-gray-100">
              Serenity Yoga
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard/profile">{t("profile")}</Link>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Accedi</Link>
              </Button>
            )}
            <ModeToggle />
            {ACTIVE_SETTINGS.show_change_language && <LanguageSwitcher />}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            {ACTIVE_SETTINGS.show_change_language && <LanguageSwitcher />}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Y</span>
                    </div>
                    <span className="text-xl font-semibold">Serenity Yoga</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated ? (
                    <>
                      {userTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        return (
                          <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                              "flex items-center space-x-3 text-lg font-medium transition-colors duration-200",
                              isActive
                                ? "text-sage-600"
                                : "text-foreground hover:text-sage-600"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{tab.name}</span>
                          </Link>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-medium hover:text-sage-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">Accedi</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
