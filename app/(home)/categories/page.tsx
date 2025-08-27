"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Grid3X3,
  Store,
  Tag,
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Home,
  Layers,
} from "lucide-react";
import { getDepartmentsWithCategories } from "@/actions/departments";

// Type definitions
export interface DepartmentsWithCategories {
  id: string;
  title: string;
  slug: string;
  categories: {
    id: string;
    image: string;
    name: string;
    slug: string;
  }[];
}

// Enhanced Category Card Component
const CategoryCard = ({
  category,
}: {
  category: { id: string; image: string; name: string; slug: string };
}) => {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="relative bg-white rounded-lg border border-gray-200 hover:border-[#f5c704] hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Category Image */}
        <div className="relative h-24 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-[#204462]/20 transition-colors duration-300"></div>
        </div>

        {/* Category Info */}
        <div className="p-3">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#204462] transition-colors duration-200">
            {category.name}
          </h4>
          <div className="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs text-[#204462] font-medium">
              View Products
            </span>
            <ArrowRight className="w-3 h-3 ml-1 text-[#204462]" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// Department Card Component
const DepartmentCard = ({
  department,
}: {
  department: DepartmentsWithCategories;
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayCategories = showAll
    ? department.categories
    : department.categories.slice(0, 6);
  const hasMoreCategories = department.categories.length > 6;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Department Header */}
      <div className="bg-[#204462] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {department.title}
              </h2>
              <p className="text-white/80 text-sm">
                {department.categories.length} categor
                {department.categories.length !== 1 ? "ies" : "y"}
              </p>
            </div>
          </div>

          <Link
            href={`/d/${department.slug}`}
            className="bg-[#f5c704] hover:bg-[#f5c704]/90 text-[#204462] rounded-lg px-4 py-2 font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6">
        {department.categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No categories available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreCategories && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  {showAll ? (
                    <>
                      <span>Show Less</span>
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </>
                  ) : (
                    <>
                      <span>Show {department.categories.length - 6} More</span>
                      <ChevronRight className="w-4 h-4 -rotate-90" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Loading Component
const DepartmentsLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#204462]/5 to-[#f5c704]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Search skeleton */}
        <div className="max-w-md mx-auto mb-12">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Department cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-24"></div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="bg-gray-200 h-24 rounded-lg"></div>
                      <div className="bg-gray-200 h-4 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error Component
const DepartmentsError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#204462]/5 to-[#f5c704]/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 rounded-full p-6 mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            We couldn't load the departments. Please try again.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onRetry}
              className="bg-[#204462] text-white px-6 py-3 rounded-lg hover:bg-[#204462]/90 transition-colors flex items-center font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-medium"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Departments Page Component
export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<
    DepartmentsWithCategories[]
  >([]);

  const {
    data: departments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["departments-categories"],
    queryFn: getDepartmentsWithCategories,
  });

  // Filter departments based on search term
  useEffect(() => {
    if (!departments) return;

    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(
        (dept) =>
          dept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.categories.some((cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredDepartments(filtered);
    }
  }, [departments, searchTerm]);

  if (isLoading) {
    return <DepartmentsLoading />;
  }

  if (error || !departments) {
    return (
      <DepartmentsError error={error as Error} onRetry={() => refetch()} />
    );
  }

  const totalCategories = departments.reduce(
    (sum, dept) => sum + dept.categories.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#204462]/5 to-[#f5c704]/5 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#204462] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-[#204462] font-medium">Departments</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-[#204462] rounded-lg p-3">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#204462]">
              Shop by Department
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our {departments.length} departments featuring{" "}
            {totalCategories} categories of products
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments and categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5c704] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {filteredDepartments.length === 0
                    ? `No departments found for "${searchTerm}"`
                    : `Found ${filteredDepartments.length} department${
                        filteredDepartments.length !== 1 ? "s" : ""
                      } matching "${searchTerm}"`}
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-[#204462] hover:text-[#f5c704] text-sm font-medium ml-auto"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Departments Grid */}
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-[#204462] mb-4">
              No departments found
            </h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search terms or browse all departments
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-[#204462] hover:bg-[#204462]/90 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            >
              Show All Departments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDepartments.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {filteredDepartments.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-[#204462] mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                Contact our support team or browse all products
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-[#204462] hover:bg-[#204462]/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-[#204462] border border-[#204462] hover:border-[#f5c704] px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
