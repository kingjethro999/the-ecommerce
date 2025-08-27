"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Heart,
  ShoppingBag,
  Star,
  AlertCircle,
  RefreshCw,
  Home,
  ArrowRight,
  Tag,
  TrendingUp,
} from "lucide-react";
import { getCategoryBySlug } from "@/actions/categories";
import { useCartStore } from "@/store/useCart";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { toast } from "sonner";
import { CategoryProduct, SimilarCategory } from "@/types/category";
import CategoryCard from "./shop-front/CategoryCard";
import { formatPrice } from "@/lib/formatPrice";

// Loading Component
const CategoryDetailLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-[#e0e6ed] rounded w-12 animate-pulse"></div>
          <ChevronRight className="h-4 w-4 text-[#c2cad6]" />
          <div className="h-4 bg-[#e0e6ed] rounded w-24 animate-pulse"></div>
          <ChevronRight className="h-4 w-4 text-[#c2cad6]" />
          <div className="h-4 bg-[#e0e6ed] rounded w-32 animate-pulse"></div>
        </div>

        {/* Banner skeleton */}
        <div className="relative h-64 md:h-96 bg-[#e0e6ed] rounded-2xl mb-8 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#204462]/60 to-[#204462]/30 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="aspect-square bg-[#e0e6ed] rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#e0e6ed] rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-[#e0e6ed] rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error Component
const CategoryDetailError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="bg-[#f5c704]/20 rounded-full p-6 mb-6">
            <AlertCircle className="h-12 w-12 text-[#204462]" />
          </div>
          <h1 className="text-2xl font-bold text-[#204462] mb-2">
            Category Not Found
          </h1>
          <p className="text-[#204462]/80 mb-6 max-w-md">
            We couldn't find the category you're looking for. It may have been
            moved or doesn't exist.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onRetry}
              className="bg-[#204462] text-white px-6 py-3 rounded-xl hover:bg-[#1a3a52] transition-colors flex items-center font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/"
              className="bg-[#f5c704] text-[#204462] px-6 py-3 rounded-xl hover:bg-[#e6bd04] transition-colors flex items-center font-medium"
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

// Product Card Component
const ProductCard = ({ product }: { product: CategoryProduct }) => {
  const { addToCart } = useCartStore();
  const { addToRecentlyViewed } = useRecentlyViewedStore();

  const calculateOriginalPrice = (price: number, discount: number) => {
    return price / (1 - discount / 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      discount: product.discount || 0,
    });

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleProductClick = () => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      discount: product.discount,
    });
  };

  const originalPrice =
    product.discount > 0
      ? calculateOriginalPrice(product.price, product.discount)
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={handleProductClick}
      className="group bg-white rounded-lg shadow-sm border border-[#e0e6ed] overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#e8edf4]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#f5c704] text-[#204462] text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist button */}
        <button
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-[#204462] hover:text-[#f5c704]" />
        </button>

        {/* Quick add to cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-[#204462] text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#1a3a52]"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[#204462] mb-2 line-clamp-2 group-hover:text-[#1a3a52] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < 4 ? "text-[#f5c704] fill-current" : "text-[#e0e6ed]"
              }`}
            />
          ))}
          <span className="text-xs text-[#204462]/70 ml-1">(4.0)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#204462]">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="text-[#204462]/50 line-through text-sm">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[#f5c704] text-xs font-medium">
                Save {product.discount}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Similar Categories Component
const SimilarCategories = ({
  categories,
}: {
  categories: SimilarCategory[];
}) => {
  if (categories.length === 0) return null;

  return (
    <section className="mt-16 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-[#204462]" />
        <h2 className="text-xl md:text-2xl font-bold text-[#204462]">
          Similar Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

// Main Component
export default function CategoryDetail({ slug }: { slug: string }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");

  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
  });
  console.log(category);

  if (isLoading) {
    return <CategoryDetailLoading />;
  }

  if (error || !category) {
    return (
      <CategoryDetailError error={error as Error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/"
            className="text-[#204462]/80 hover:text-[#204462] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-[#204462]/50" />
          <Link
            href="/categories"
            className="text-[#204462]/80 hover:text-[#204462] transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="h-4 w-4 text-[#204462]/50" />
          <span className="text-[#204462] font-medium">{category.name}</span>
        </nav>

        {/* Category Banner */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={category.bannerImage}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#204462]/70 via-[#204462]/40 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {category.name}
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-white font-medium">
                      {category.products.length} Products
                    </span>
                  </div>
                  {/* {category.products.some((p) => p. > 0) && (
                    <div className="bg-[#f5c704]/90 backdrop-blur-sm rounded-lg px-4 py-2">
                      <span className="text-[#204462] font-medium">
                        Sale Items Available
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-[#e0e6ed] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[#204462] font-medium">
                {category.products.length} Product
                {category.products.length !== 1 ? "s" : ""}
              </span>
              <div className="hidden md:flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#204462]/70" />
                <span className="text-sm text-[#204462]/80">Filters</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-[#204462]/70" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm text-[#204462] border-none focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="hidden md:flex items-center border border-[#e0e6ed] rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-[#f5f7fa]" : ""
                  } rounded-l-lg transition-colors`}
                >
                  <Grid3X3 className="w-4 h-4 text-[#204462]" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-[#f5f7fa]" : ""
                  } rounded-r-lg transition-colors`}
                >
                  <List className="w-4 h-4 text-[#204462]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-[#204462]/30" />
            </div>
            <h2 className="text-2xl font-semibold text-[#204462] mb-4">
              No Products Found
            </h2>
            <p className="text-[#204462]/80 mb-8">
              This category doesn't have any products yet. Check back soon!
            </p>
            <Link
              href="/categories"
              className="bg-gradient-to-r from-[#204462] to-[#1a3a52] hover:from-[#1a3a52] hover:to-[#153046] text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-md inline-flex items-center gap-2"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div
            className={`grid gap-4 md:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Similar Categories */}
        <SimilarCategories categories={category.similarCategories} />
      </div>
    </div>
  );
}
