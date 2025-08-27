"use client";
// components/products/RecentlyViewedProducts.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import RecentViewedCard from "./RecentViewedCard";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";

export default function RecentlyViewedProducts() {
  const {
    items: recentlyViewedItems,
    getRecentlyViewedCount,
    clearRecentlyViewed,
  } = useRecentlyViewedStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything if no items or still loading
  if (isLoading || recentlyViewedItems.length === 0) {
    return null;
  }

  const itemCount = getRecentlyViewedCount();

  return (
    <section className="container max-w-7xl mx-auto py-8 p-3 md:p-8 pb-24">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200">
        {/* Header with title and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-xl lg:text-2xl font-semibold text-[#204462]">
                Your Recently Viewed Items
              </h2>
            </div>
            <span className="bg-[#f5c704] text-[#204462] text-xs font-medium px-2.5 py-0.5 rounded-full">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>

            <Link
              href="/recently-viewed"
              className="text-[#204462] text-sm flex items-center hover:text-[#f5c704] transition-colors font-medium"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Products grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentlyViewedItems.slice(0, 8).map((product) => (
              <RecentViewedCard
                key={product.id}
                product={product}
                showRemoveButton={true}
              />
            ))}
          </div>
        )}

        {/* Show more link if there are more than 8 items */}
        {!isLoading && recentlyViewedItems.length > 8 && (
          <div className="text-center mt-6">
            <Link
              href="/recently-viewed"
              className="inline-flex items-center px-4 py-2 border border-[#204462] rounded-lg text-sm font-medium text-[#204462] bg-white hover:bg-[#f5c704] hover:border-[#f5c704] transition-colors"
            >
              View {recentlyViewedItems.length - 8} more items
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
