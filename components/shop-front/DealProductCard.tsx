import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { useCartStore } from "@/store/useCart";
import { DealProduct } from "@/types/products";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const DealProductCard: React.FC<{
  product: DealProduct;
}> = ({ product }) => {
  const originalPrice = product.price;
  const discountPrice = product.discount ?? 0;
  const diff = originalPrice - discountPrice;
  const discountPercentage = Math.round((diff / originalPrice) * 100);
  const inCart = false;
  const { addToCart } = useCartStore();

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

  const { addToRecentlyViewed } = useRecentlyViewedStore();

  function handleProductClick() {
    addToRecentlyViewed({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      discount: product?.discount ?? 0,
      slug: product.slug,
    });
  }

  return (
    <div className="group relative flex flex-col h-full rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 border border-gray-100 hover:shadow-md">
      {/* Image container */}
      <div className="relative w-full h-28 md:h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-28 md:h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="px-2 py-1 bg-[#f5c704] text-[#204462] text-xs font-bold rounded-md shadow-sm hidden md:block">
              {discountPercentage}% OFF
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="md:hidden px-2 py-1 bg-[#f5c704] text-[#204462] text-xs font-bold rounded-md shadow-sm">
              $ {product.discount}
            </span>
          )}
        </div>

        {/* Stock badge */}
        <div className="hidden md:block absolute top-3 right-3">
          {product.stockQty <= 10 && (
            <span className="px-2 py-1 bg-[#204462] text-white text-xs font-bold rounded-md shadow-sm">
              Only {product.stockQty} left
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Link
              onClick={handleProductClick}
              href={`/products/${product.slug}`}
              className="flex items-center gap-1 py-2 px-3 bg-white text-gray-800 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 shadow"
            >
              <Eye size={16} />
              <span>Quick View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-col p-3 flex-grow">
        <div className="mb-2">
          <Link
            onClick={handleProductClick}
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#204462] transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2 hidden md:block">
          {product.summary}
        </p>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
          <div className="hidden md:flex flex-col">
            {discountPercentage > 0 && (
              <span className="text-xs text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-[#204462]">
                $
                {product.discount
                  ? product.discount.toFixed(2)
                  : product.price.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs text-[#f5c704] font-bold">
                  (Save {discountPercentage}%)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full md:w-auto flex justify-center items-center gap-1 py-2 px-3 rounded-md transition-all duration-200 ${
              inCart
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-[#204462] hover:bg-[#204462]/90 text-white"
            }`}
          >
            <ShoppingCart size={16} />
            <span className="text-xs font-medium">
              {inCart ? "Added" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealProductCard;
