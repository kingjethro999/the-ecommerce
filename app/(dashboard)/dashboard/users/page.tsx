import { TableLoading } from "@/components/ui/data-table";
import DashboardCategoryListing from "./components/DashboardUserListing";
import { Suspense } from "react";
import DashboardUserListing from "./components/DashboardUserListing";

// Create an async component for data fetching
async function UserWithData() {
  return <DashboardUserListing title="Users" subtitle="Manage your users " />;
}

export default function UsersPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <UserWithData />
      </Suspense>
    </div>
  );
}
