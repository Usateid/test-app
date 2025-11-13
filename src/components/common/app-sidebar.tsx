import {
  BookOpen,
  CreditCard,
  GraduationCap,
  MapPin,
  Users,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const t = useTranslations('nav');

  // Menu items.
  const items = [
    // {
    //   title: "Locations",
    //   url: "/admin/locations",
    //   icon: MapPin,
    // },
    {
      title: t('users'),
      url: "/admin/users",
      icon: Users,
    },
    {
      title: t('teachers'),
      url: "/admin/teachers",
      icon: GraduationCap,
    },
    {
      title: t('activities'),
      url: "/admin/activities",
      icon: Activity,
    },
    {
      title: t('lessons'),
      url: "/admin/lessons",
      icon: BookOpen,
    },
    {
      title: t('subscriptions'),
      url: "/admin/subscriptions",
      icon: CreditCard,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('admin')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2">
          <ModeToggle />
          <LanguageSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
