import { TableLoading } from "@/components/ui/data-table";
import DashboardCategoryListing from "./components/DashboardCategoryListing";
import { Suspense } from "react";

// Create an async component for data fetching
async function CategoryWithData() {
  return (
    <DashboardCategoryListing
      title="Categories"
      subtitle="Manage your product categories"
    />
  );
}

export default function CategoriesPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <CategoryWithData />
      </Suspense>
    </div>
  );
}
