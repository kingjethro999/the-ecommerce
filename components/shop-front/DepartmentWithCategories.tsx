"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, AlertCircle, RefreshCw, Grid3X3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentsWithCategories } from "@/actions/departments";
import { Button } from "@/components/ui/button";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// Category Card Skeleton
function CategoryCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative bg-white rounded-lg border border-[#e0e6ed] overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="relative h-24 bg-[#e0e6ed]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e0e6ed] via-[#e8edf4] to-[#e0e6ed] animate-shimmer"></div>
        </div>

        {/* Content Skeleton */}
        <div className="p-3 space-y-2">
          <div className="h-3 bg-[#e0e6ed] rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

// Department Card Skeleton
function DepartmentCardSkeleton() {
  return (
    <Card className="bg-white shadow animate-pulse border border-[#e0e6ed]">
      <CardContent className="p-3 md:p-6">
        {/* Title Skeleton */}
        <div className="h-5 md:h-6 bg-[#e0e6ed] rounded w-1/2 mb-4"></div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>

        {/* View All Link Skeleton */}
        <div className="h-4 bg-[#e0e6ed] rounded w-16"></div>
      </CardContent>
    </Card>
  );
}

// Main Loading Skeleton Component
function DepartmentCategoriesLoadingSkeleton() {
  return (
    <section className="bg-[#f5f7fa] md:container max-w-7xl mx-auto p-3 md:p-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6 px-6">
        <div className="animate-pulse">
          <div className="h-6 md:h-8 bg-[#e0e6ed] rounded w-48 mb-2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-[#e0e6ed] rounded w-20"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <DepartmentCardSkeleton key={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}

// Error Component
function DepartmentCategoriesError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="bg-[#f5f7fa] md:container max-w-7xl mx-auto p-3 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-base md:text-xl lg:text-3xl font-bold text-[#204462] mb-2">
          <span className="relative inline-block">Browse by Categories</span>
        </h2>
        <Link
          href={"#"}
          className="text-[#204462]/80 text-sm flex items-center hover:text-[#204462]"
        >
          View All<span className="ml-1">→</span>
        </Link>
      </div>

      {/* Error Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-[#f5c704]/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[#204462]" />
          </div>

          <h3 className="text-xl font-semibold text-[#204462] mb-2">
            Failed to Load Categories
          </h3>

          <p className="text-[#204462]/80 text-center max-w-md mb-6">
            We're having trouble loading the department categories. Please check
            your connection and try again.
          </p>

          <Button
            onClick={onRetry}
            className="bg-[#204462] hover:bg-[#1a3a52] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}

// Empty State Component
function DepartmentCategoriesEmpty() {
  return (
    <section className="bg-[#f5f7fa] md:container max-w-7xl mx-auto p-3 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-base md:text-xl lg:text-3xl font-bold text-[#204462] mb-2">
          <span className="relative inline-block">Browse by Categories</span>
        </h2>
        <Link
          href={"#"}
          className="text-[#204462]/80 text-sm flex items-center hover:text-[#204462]"
        >
          View All<span className="ml-1">→</span>
        </Link>
      </div>

      {/* Empty Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-[#e0e6ed] rounded-full flex items-center justify-center mb-4">
            <Grid3X3 className="w-8 h-8 text-[#204462]/40" />
          </div>

          <h3 className="text-xl font-semibold text-[#204462] mb-2">
            No Categories Available
          </h3>

          <p className="text-[#204462]/80 text-center max-w-md">
            We're currently updating our categories. Check back soon for
            organized product collections!
          </p>
        </div>
      </div>
    </section>
  );
}

// Main Component
export default function DepartmentWithCategories() {
  const {
    data: departments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["departments-with-categories"],
    queryFn: getDepartmentsWithCategories,
  });

  if (isLoading) {
    return <DepartmentCategoriesLoadingSkeleton />;
  }

  if (error) {
    return <DepartmentCategoriesError onRetry={() => refetch()} />;
  }

  if (!departments || departments.length === 0) {
    return <DepartmentCategoriesEmpty />;
  }

  return (
    <section className="bg-[#f5f7fa] md:container max-w-7xl mx-auto p-3 md:p-8">
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-base md:text-xl lg:text-3xl font-bold text-[#204462] mb-2">
          <span className="relative inline-block">Browse by Categories</span>
        </h2>
        <Button
          className="bg-[#204462] text-white hover:bg-[#204462]/90 hover:text-white"
          href={"/categories"}
        >
          View All<span className="ml-1">→</span>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card
              key={department.id}
              className="bg-white shadow border border-[#e0e6ed]"
            >
              <CardContent className="p-3 md:p-6">
                <h2 className="text-base md:text-xl font-bold text-[#204462] mb-4 leading-tight">
                  {department.title}
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {department.categories?.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  )) || (
                    <div className="col-span-2 text-center py-4">
                      <p className="text-[#204462]/80 text-sm">
                        No categories available
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href={`/d/${department.slug || "#"}`}
                  className="inline-block text-sm text-[#204462] hover:text-black hover:underline font-medium py-2 px-6 rounded-2xl border border-gray-200"
                >
                  View All
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
