import type React from "react";

import { auth } from "@clerk/nextjs/server";
import ShopNavigation from "@/components/shop-front/ShopNavigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  return (
    <div>
      <ShopNavigation userId={userId} />
      <div className="mt-12">{children}</div>
    </div>
  );
}
