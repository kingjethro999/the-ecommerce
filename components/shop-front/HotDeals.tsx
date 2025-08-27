"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingCart,
  Eye,
  Tag,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { DealProduct } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { getDealProducts } from "@/actions/products";
import DealProductCard from "./DealProductCard";

// Product Card Skeleton Component
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group relative flex flex-col h-full rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-28 md:h-48 bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>

        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-16 h-6 bg-gray-200 rounded-md hidden md:block"></div>
          <div className="w-12 h-6 bg-gray-200 rounded-md md:hidden"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col p-3 flex-grow">
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-1"></div>
        </div>

        <div className="hidden md:block mb-3">
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
          <div className="hidden md:flex flex-col">
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>

          <div className="w-full md:w-auto h-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const HotDealsLoadingSkeleton: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleProducts(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleProducts(3);
      } else if (window.innerWidth >= 768) {
        setVisibleProducts(2);
      } else {
        setVisibleProducts(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-white mb-4 container max-w-7xl mx-auto py-6 p-3 md:p-6">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="h-6 md:h-7 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="flex space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: visibleProducts }).map((_, index) => (
            <div key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>

      {/* View all button skeleton */}
      <div className="flex justify-center mt-6">
        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

// Error Component
const HotDealsError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <div className="w-full bg-white mb-4 container max-w-7xl mx-auto py-6 p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="relative pb-1">
              Trending Deals
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#f5c704] rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Exclusive deals on premium products. Limited time only.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Deals
          </h3>

          <p className="text-gray-600 text-center max-w-md mb-6">
            We're having trouble loading the latest deals. Please check your
            connection and try again.
          </p>

          <Button
            onClick={onRetry}
            className="bg-[#204462] hover:bg-[#204462]/90 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function HotDeals() {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getDealProducts,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle screen resize to adjust number of visible products
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleProducts(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleProducts(3);
      } else if (window.innerWidth >= 768) {
        setVisibleProducts(2);
      } else {
        setVisibleProducts(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!products || isLoading) {
    return <HotDealsLoadingSkeleton />;
  }
  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev + visibleProducts >= products.length ? 0 : prev + visibleProducts
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev - visibleProducts < 0
        ? Math.max(0, products.length - visibleProducts)
        : prev - visibleProducts
    );
  };

  const displayedProducts = products.slice(
    currentIndex,
    currentIndex + visibleProducts
  );

  // If we don't have enough products to fill the view, add from the beginning
  if (displayedProducts.length < visibleProducts) {
    const remainingCount = visibleProducts - displayedProducts.length;
    const additionalProducts = products.slice(0, remainingCount);
    displayedProducts.push(...additionalProducts);
  }

  // Handle loading state
  if (isLoading) {
    return <HotDealsLoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return <HotDealsError onRetry={() => refetch()} />;
  }

  // Handle empty state
  if (!products || products.length === 0) {
    return (
      <div className="w-full bg-white mb-4 container max-w-7xl mx-auto py-6 p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="relative pb-1">
                Trending Deals
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#f5c704] rounded-full"></span>
              </span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Exclusive deals on premium products. Limited time only.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Deals Available
          </h3>

          <p className="text-gray-600 text-center max-w-md">
            We're currently updating our deals. Check back soon for exciting
            offers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white mb-4 container max-w-7xl mx-auto py-6 p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="relative pb-1">
              Trending Deals
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#f5c704] rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Exclusive deals on premium products. Limited time only.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={goToPrev}
            disabled={!products || products.length === 0}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow border border-gray-200 hover:border-[#204462] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous products"
          >
            <ChevronLeft size={18} className="text-[#204462]" />
          </button>
          <button
            onClick={goToNext}
            disabled={!products || products.length === 0}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow border border-gray-200 hover:border-[#204462] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next products"
          >
            <ChevronRight size={18} className="text-[#204462]" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden" ref={carouselRef}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <div key={product.id}>
              <DealProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({
          length: Math.ceil(products.length / visibleProducts),
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i * visibleProducts)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === Math.floor(currentIndex / visibleProducts)
                ? "bg-gray-800 w-4"
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      {/* View all button */}
      <div className="flex justify-center mt-6">
        <Button href="/deals" className="bg-[#204462] hover:bg-[#204462]/90">
          View All Deals
        </Button>
      </div>
    </div>
  );
}
