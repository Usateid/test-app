"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Classi", href: "/classes", icon: Calendar },
  { name: "Profilo", href: "/profile", icon: User },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Menu", href: "/menu", icon: Menu },
];

export function MobileBottomTabs() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sage-200">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors duration-200",
                isActive
                  ? "text-sage-600 bg-sage-50"
                  : "text-sage-400 hover:text-sage-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
