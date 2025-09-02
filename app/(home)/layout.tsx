import type React from "react";

import ShopNavigation from "@/components/shop-front/ShopNavigation";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShopNavigation userId={null} />
      <div className="pt-24">{children}</div>
    </>
  );
}
