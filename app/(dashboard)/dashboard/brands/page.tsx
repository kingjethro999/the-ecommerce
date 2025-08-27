import { TableLoading } from "@/components/ui/data-table";

import { Suspense } from "react";
import BrandListing from "./components/DashboardBrandListing";

// Create an async component for data fetching
async function BrandsWithData() {
  return <BrandListing title="Brands" subtitle="Manage your brands " />;
}

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <BrandsWithData />
      </Suspense>
    </div>
  );
}
