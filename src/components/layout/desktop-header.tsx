"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from "@/components/toggler/theme-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Chi Siamo", href: "/about" },
  { name: "Lezioni", href: "/classes" },
  { name: "Attività", href: "/activities" },
  { name: "Centri", href: "/schedule" },
  { name: "Contatti", href: "/contact" },
];

export function DesktopHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Serenity Yoga"
                width={32}
                height={32}
              />
            </div>
            <span className="text-xl font-semibold text-sage-400">
              Serena Cirone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sage-400 hover:text-sage-600 hover:bg-sage-200 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="default" asChild>
                <Link href="/dashboard">Profile</Link>
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link href="/login">Accedi</Link>
              </Button>
            )}
            {/* <ModeToggle /> */}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <ModeToggle /> */}
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="Serenity Yoga"
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-xl font-semibold">Serena Cirone</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full justify-between mb-10 px-4">
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Button asChild key={item.name} variant="default">
                        <Link key={item.name} href={item.href}>
                          {item.name}
                        </Link>
                      </Button>
                    ))}
                  </nav>
                  <div className="flex gap-4 justify-between">
                    <ModeToggle />
                    {isAuthenticated ? (
                      <Button variant="action" asChild>
                        <Link href="/dashboard">Profile</Link>
                      </Button>
                    ) : (
                      <Button variant="action" asChild>
                        <Link href="/login">Accedi</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
