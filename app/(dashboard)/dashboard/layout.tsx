import type React from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { checkRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { AdminSidebar } from "../components/AdminDashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect the page from users who are not admins
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/user-dashboard");
  }
  return (
    <SidebarProvider>
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
