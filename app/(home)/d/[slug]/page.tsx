import CategoryDetail from "@/components/category-detail";
import DepartmentDetailPage from "@/components/shop-front/department-detail";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <DepartmentDetailPage slug={slug} />
    </div>
  );
}
