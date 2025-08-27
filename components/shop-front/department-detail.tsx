"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Grid3X3,
  List,
  Search,
  SortAsc,
  Store,
  Tag,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Home,
  Layers,
  TrendingUp,
  Star,
  Eye,
  Heart,
  Filter,
} from "lucide-react";
import { getDepartmentBySlug } from "@/actions/departments";
import { DepartmentCategory, type DepartmentDetail } from "@/types/departments";

// Enhanced Category Card Component
const CategoryCard = ({
  category,
  index,
}: {
  category: DepartmentCategory;
  index: number;
}) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 animate-fade-in-up">
        {/* Category Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Hover actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
              <Eye className="w-4 h-4 text-gray-600 hover:text-primary" />
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-gray-700">
                Category
              </span>
            </div>
          </div>
        </div>

        {/* Category Info */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 mb-2">
                {category.name}
              </h3>

              {/* Rating display */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? "text-secondary fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">(4.0)</span>
              </div>

              {/* View category link */}
              <div className="flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-primary to-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
};

// Loading Component
const DepartmentDetailLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Banner skeleton */}
        <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg mb-12 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error Component
const DepartmentDetailError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 rounded-full p-6 mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Department Not Found
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            We couldn't find the department you're looking for. It may have been
            moved or doesn't exist.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onRetry}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/departments"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-medium"
            >
              <Layers className="h-4 w-4 mr-2" />
              All Departments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function DepartmentDetailPage({ slug }: { slug: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  const {
    data: department,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["department-categories", slug],
    queryFn: () => getDepartmentBySlug(slug),
  });

  // Filter categories based on search
  const filteredCategories =
    department?.categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return <DepartmentDetailLoading />;
  }

  if (error || !department) {
    return (
      <DepartmentDetailError error={error as Error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href="/departments"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Departments
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-primary font-medium">{department.title}</span>
        </nav>

        {/* Department Banner */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-12 shadow-lg">
          <Image
            src={department.bannerImage}
            alt={department.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-white font-medium text-sm">
                      Department
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {department.title}
                </h1>

                <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                  {department.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <span className="text-white font-bold text-lg">
                      {department.categories.length} Categories
                    </span>
                  </div>

                  <div className="bg-secondary/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                    <span className="text-white font-medium">
                      Premium Quality Products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <option value="name">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="hidden md:flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-gray-100" : ""
                  } rounded-l-lg transition-colors`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-gray-100" : ""
                  } rounded-r-lg transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-600 font-medium">
                {sortedCategories.length} of {department.categories.length}{" "}
                categories
              </div>
            </div>
          </div>

          {/* Active filters */}
          {searchTerm && (
            <div className="mt-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active filter:</span>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                <span>"{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-primary hover:text-primary-dark"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        {sortedCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-sm">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No categories found
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm
                ? `No categories match "${searchTerm}". Try adjusting your search.`
                : "This department doesn't have any categories yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
              >
                Show All Categories
              </button>
            )}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {sortedCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore More Departments
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover thousands of products across all our departments. From
              electronics to fashion, we have everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/departments"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center gap-2"
              >
                <Layers className="w-5 h-5" />
                All Departments
              </Link>
              <Link
                href="/products"
                className="bg-white text-gray-700 border border-gray-200 hover:border-gray-300 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-sm flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary: #204462;
          --primary-dark: #1a3852;
          --secondary: #f5c704;
        }

        .text-primary {
          color: var(--primary);
        }

        .bg-primary {
          background-color: var(--primary);
        }

        .border-primary {
          border-color: var(--primary);
        }

        .hover\:bg-primary-dark:hover {
          background-color: var(--primary-dark);
        }

        .text-secondary {
          color: var(--secondary);
        }

        .bg-secondary {
          background-color: var(--secondary);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
