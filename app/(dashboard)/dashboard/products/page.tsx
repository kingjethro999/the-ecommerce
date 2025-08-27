import { Suspense } from "react";
import { TableLoading } from "@/components/ui/data-table";

import DashboardProductListing from "./components/DashboardProductListing";

// Create an async component for data fetching
async function ProductListingWithData() {
  return (
    <DashboardProductListing
      title="Products"
      subtitle="Manage your product catalog"
    />
  );
}

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <ProductListingWithData />
      </Suspense>
    </div>
  );
}
