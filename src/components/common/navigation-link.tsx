"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function NavigationLink({
  navItems,
}: {
  navItems: { href: string; icon: React.ReactNode; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(item.href + "/");

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 text-base font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
