import { TableLoading } from "@/components/ui/data-table";

import DashboardDepartmentListing from "./components/DashboardDepartmentListing";
import { Suspense } from "react";

// Create an async component for data fetching
async function DepartmentWithData() {
  return (
    <DashboardDepartmentListing
      title="Departments"
      subtitle="Manage your departments "
    />
  );
}

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <DepartmentWithData />
      </Suspense>
    </div>
  );
}
