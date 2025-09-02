"use client";

import type * as React from "react";
import {
  ArrowUpCircleIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon,
  TrendingUpIcon,
  InboxIcon,
  MegaphoneIcon,
  FileBarChartIcon as FileBarGraphIcon,
  Monitor,
  Blocks,
  Chrome,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

const data = {
  navMain: [
    {
      title: "Profile",
      url: "/user-dashboard/user-profile",
      icon: UserIcon,
    },
    {
      title: "My Orders",
      url: "/user-dashboard",
      icon: ShoppingCartIcon,
    },
  ],
};

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user, loading } = useAuth();
  const userData = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.image || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {!loading && isAuthenticated ? (
          <NavUser user={userData} />
        ) : (
          <p>Loading...</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
