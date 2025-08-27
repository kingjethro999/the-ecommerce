"use client";
// app/recently-viewed/page.tsx or components/pages/RecentlyViewedPage.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Trash2, Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import RecentViewedCard from "@/components/shop-front/RecentViewedCard";

export default function RecentlyViewedPage() {
  const {
    items: recentlyViewedItems,
    getRecentlyViewedCount,
    clearRecentlyViewed,
  } = useRecentlyViewedStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure hydration is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = getRecentlyViewedCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-8 p-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Recently Viewed
                </h1>
                <p className="text-gray-600">
                  {itemCount} product{itemCount !== 1 ? "s" : ""} you've viewed
                  recently
                </p>
              </div>
            </div>
          </div>

          {itemCount > 0 && (
            <Button
              variant="outline"
              onClick={clearRecentlyViewed}
              className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {itemCount === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/50 backdrop-blur-sm rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <Clock className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Recently Viewed Items
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing our products to see your recently viewed items
              here.
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {itemCount > 0 && (
          <>
            {/* Filter/Sort Bar */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Showing {itemCount} product{itemCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-sm text-gray-500">Most recent first</div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 md:gap-6">
              {recentlyViewedItems.map((product) => (
                <RecentViewedCard
                  key={product.id}
                  product={product}
                  showRemoveButton={true}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-12 text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 inline-block">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Continue Shopping
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover more amazing products
                </p>
                <Link
                  href="/products"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse All Products
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
