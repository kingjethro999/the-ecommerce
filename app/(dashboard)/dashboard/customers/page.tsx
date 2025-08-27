import { TableLoading } from "@/components/ui/data-table";
import DashboardCategoryListing from "./components/DashboardCustomerListing";
import { Suspense } from "react";
import DashboardUserListing from "./components/DashboardCustomerListing";
import DashboardCustomerListing from "./components/DashboardCustomerListing";

// Create an async component for data fetching
async function UserWithData() {
  return (
    <DashboardCustomerListing
      title="Customers"
      subtitle="Manage your customers "
    />
  );
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
