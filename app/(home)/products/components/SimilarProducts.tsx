import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { SimilarProduct } from "@/types/products";
import RecentViewedCard from "@/components/shop-front/RecentViewedCard";
import { Button } from "@/components/ui/button";

export default function SimilarProducts({
  similarProducts,
}: {
  similarProducts: SimilarProduct[];
}) {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map((product) => (
          <RecentViewedCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
