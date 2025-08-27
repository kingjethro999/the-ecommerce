import CategoryDetail from "@/components/category-detail";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <CategoryDetail slug={slug} />
    </div>
  );
}
