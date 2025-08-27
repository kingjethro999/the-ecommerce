"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HomeBanner } from "@/types/banners";
import { useQuery } from "@tanstack/react-query";
import { getHomeBanners } from "@/actions/banners";
import React from "react";

const BannerSkeleton = () => {
  return (
    <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden">
      {/* Main Banner Skeleton */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Buttons Skeleton */}
      <div className="hidden md:block">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full animate-pulse">
          <div className="w-full h-full bg-gray-300/50 rounded-full"></div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full animate-pulse">
          <div className="w-full h-full bg-gray-300/50 rounded-full"></div>
        </div>
      </div>

      {/* Navigation Dots Skeleton */}
      <div className="absolute bottom-0 md:bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {/* Simulate 3 dots as a typical banner count */}
          <div className="w-8 h-2 bg-gray-300/70 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-300/50 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-300/50 rounded-full animate-pulse"></div>
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
    </div>
  );
};

export default function BannerSection() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getHomeBanners,
  });

  // Move all useCallback hooks here - before any conditional returns
  const nextSlide = useCallback(() => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  }, [banners]);

  const prevSlide = useCallback(() => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  }, [banners]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !banners || banners.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, banners]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // NOW we can do conditional returns after all hooks are called
  if (isLoading || !banners) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 to-white mt-32">
        <BannerSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 to-white mt-32">
        <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden flex items-center justify-center">
          <p className="text-gray-500">Failed to load Banners</p>
        </div>
      </div>
    );
  }

  console.log(banners);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-white mt-32">
      <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden">
        {/* Banner Slides */}
        <div className="relative w-full h-full">
          {banners &&
            banners.length > 0 &&
            banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <Link
                  href={banner.linkUrl}
                  className="block w-full h-full md:h-auto"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative w-full h-full md:h-auto overflow-hidden">
                    {/* Desktop Image */}
                    <Image
                      src={banner.imageUrl || "/placeholder.svg"}
                      alt={banner.title}
                      width={1376}
                      height={330}
                      className="object-cover w-full hidden md:block"
                      priority={index === 0}
                    />
                    {/* Mobile Image */}
                    <Image
                      src={banner.mobileImageUrl || "/placeholder.svg"}
                      alt={banner.title}
                      width={343}
                      height={195}
                      className="object-cover w-full block md:hidden"
                      priority={index === 0}
                    />
                  </div>
                </Link>
              </div>
            ))}
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block">
          <button
            onClick={prevSlide}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={nextSlide}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-0 md:bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
