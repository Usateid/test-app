"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Plus, Book, Mail, Home, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileBottomTabs({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
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
  const unauthenticatedTabs = [{ name: "Login", href: "/login", icon: User }];

  const tabs = isAuthenticated ? userTabs : unauthenticatedTabs;

  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-sage-200">
      <div className={`grid grid-cols-5 h-16`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <LinkTab
              key={tab.name}
              href={tab.href}
              IconComponent={<Icon className="w-5 h-5" />}
              name={tab.name}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}

function LinkTab({
  href,
  IconComponent,
  name,
  isActive,
}: {
  href: string;
  IconComponent: React.ReactNode;
  name: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center space-y-1 transition-colors duration-200",
        isActive
          ? "text-sage-600 bg-sage-50"
          : "text-sage-400 hover:text-sage-600"
      )}
    >
      {IconComponent}
      <span className="text-xs font-medium">{name}</span>
    </Link>
  );
}
