"use client";
import React, { useState, useEffect } from "react";
import { Filter, Search, ChevronDown, Tag } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { getAllProductDeals, getDealProducts } from "@/actions/products";
import { Skeleton } from "@/components/ui/skeleton";
import DealProductCard from "@/components/shop-front/DealProductCard";

const categories = [
  { id: "all", name: "All Categories" },
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Kitchen" },
  { id: "fashion", name: "Fashion" },
  { id: "beauty", name: "Beauty" },
  { id: "sports", name: "Sports & Outdoors" },
];

const sortOptions = [
  { value: "best", label: "Best Deals" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Discount %" },
];

export default function AllDealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("best");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["deal-products", selectedCategory, sortBy, searchQuery],
    queryFn: ({ pageParam }) => getAllProductDeals(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  // Loading skeleton
  if (isLoading && !data) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <Tag className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load deals
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't load the deals. Please try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#204462] hover:bg-[#204462]/90"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-24">
      {/* Hero Section */}
      <div className="bg-[#204462] text-white py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 mr-2 text-[#f5c704]" />
            <h1 className="text-3xl md:text-4xl font-bold">All Deals</h1>
          </div>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Discover the best deals and discounts across all categories. Limited
            time offers updated daily.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#204462] focus:border-[#204462]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#204462] focus:border-[#204462]"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex-1 md:text-right">
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#204462] focus:border-[#204462]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{products.length}</span> deals
            {hasNextPage ? "+" : ""}
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter</span>
          </div>
        </div>

        {/* Deals Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <DealProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Intersection observer trigger */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                <div className="text-gray-500">Loading more products...</div>
              </div>
            )}

            {/* No more products */}
            {!hasNextPage && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You've reached the end of our product catalog!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No deals found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="bg-[#204462] hover:bg-[#204462]/90"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-[#f5c704] py-12 mt-12">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#204462] mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-[#204462] mb-6">
            Subscribe to our newsletter and get the best deals delivered
            straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-md border border-[#204462] focus:outline-none focus:ring-2 focus:ring-[#204462]"
            />
            <Button className="bg-[#204462] hover:bg-[#204462]/90 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
