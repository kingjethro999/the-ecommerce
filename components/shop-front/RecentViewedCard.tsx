import { SimilarProduct } from "@/types/products";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ShoppingBag, X, Eye } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatPrice";

export default function RecentViewedCard({
  product,
  showRemoveButton = false,
}: {
  product: SimilarProduct;
  showRemoveButton?: boolean;
}) {
  const { addToCart } = useCartStore();
  const { removeFromRecentlyViewed, addToRecentlyViewed } =
    useRecentlyViewedStore();

  function handleAddToCart() {
    addToCart({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      discount: product?.discount ?? 0,
    });

    toast.success("Success", {
      description: "Item added to cart successfully",
    });
  }

  function handleRemoveFromRecentlyViewed() {
    removeFromRecentlyViewed(product.id);
    toast.success("Removed", {
      description: "Item removed from recently viewed",
    });
  }

  function handleProductClick() {
    addToRecentlyViewed(product);
  }

  const calculateOriginalPrice = (price: number, discount: number) => {
    return price / (1 - discount / 100);
  };

  const originalPrice = product.discount
    ? calculateOriginalPrice(product.price, product.discount)
    : null;

  return (
    <div className="group rounded-lg overflow-hidden border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-200 relative">
      {showRemoveButton && (
        <button
          onClick={handleRemoveFromRecentlyViewed}
          className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
          title="Remove from recently viewed"
        >
          <X className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      )}

      {showRemoveButton && (
        <div className="absolute top-2 left-2 z-10 bg-[#204462] rounded-full p-1.5">
          <Eye className="w-3 h-3 text-white" />
        </div>
      )}

      <Link
        href={`/products/${product.slug}`}
        onClick={handleProductClick}
        className="relative aspect-square overflow-hidden bg-gray-50 block"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.discount && (
          <div className="absolute top-2 right-2 bg-[#f5c704] text-[#204462] text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </Link>

      <div className="px-1 md:px-4 py-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link
              href={`/products/${product.slug}`}
              onClick={handleProductClick}
              className="font-medium text-base text-gray-900 mb-1 line-clamp-2 hover:text-[#204462] transition-colors"
            >
              {product.name}
            </Link>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-[#204462]">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="text-gray-400 line-through text-sm hidden md:block">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {product.discount && (
              <span className="text-[#f5c704] text-xs font-medium">
                Save {product.discount}%
              </span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-[#204462] hover:bg-[#204462]/90 text-white"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline ml-1">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
