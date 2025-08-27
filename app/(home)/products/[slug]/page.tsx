import ProductDetail from "@/components/product-detail";
import React from "react";
import ProductDetailedPage from "../components/ProductDetailedPage";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log(slug);
  return (
    <div className="p-8 mt-24">
      <ProductDetailedPage slug={slug} />
    </div>
  );
}
