"use client";

import * as React from "react";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "System", value: "system", icon: Computer },
];
export function ModeToggle({
  showDropdown = true,
}: {
  showDropdown?: boolean;
}) {
  const { theme: selectedTheme, setTheme } = useTheme();

  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => setTheme(theme.value)}
            >
              {theme.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <div key={theme.value}>
            <Button
              className="w-full"
              variant={theme.value === selectedTheme ? "default" : "outline"}
              onClick={() => setTheme(theme.value)}
            >
              <theme.icon className="h-[1.2rem] w-[1.2rem]" />
              <span>{theme.name}</span>
            </Button>
          </div>
        ))}
      </div>
    );
  }
}
