import { TableLoading } from "@/components/ui/data-table";

import { Suspense } from "react";
import DashboardBannerListing from "./components/DashboardBannerListing";

// Create an async component for data fetching
async function BannerWithData() {
  return (
    <DashboardBannerListing
      title="Banners"
      subtitle="Manage your website banners and promotional content"
    />
  );
}

export default function BannersPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <BannerWithData />
      </Suspense>
    </div>
  );
}
