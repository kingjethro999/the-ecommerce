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
import { useUser } from "@clerk/nextjs";

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
  const { isSignedIn, user, isLoaded } = useUser();
  // console.log("Primary email=>", user?.primaryEmailAddress?.emailAddress);
  // console.log("---------------");
  // console.log("Email addresses=>", user?.emailAddresses[0].emailAddress);
  const userData = {
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
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
        {isLoaded ? <NavUser user={userData} /> : <p>Loading...</p>}
      </SidebarFooter>
    </Sidebar>
  );
}
