"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ChevronRight,
  ChevronLeft,
  Check,
  PlusCircle,
  MinusCircle,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Home,
  ShoppingBasket,
} from "lucide-react";
import SimilarProducts from "./SimilarProducts";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/actions/products";
import FrequentlyBoughtTogetherItems from "./FrequentlyBoughtTogetherItems";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCart";
import { formatPrice } from "@/lib/formatPrice";
import { Button } from "@/components/ui/button";

// Loading Component
const ProductDetailLoading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      {/* Breadcrumb skeleton */}
      <nav className="flex mb-8 text-sm">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-300 self-center" />
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-300 self-center" />
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-300 self-center" />
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Skeleton */}
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300"></div>
          </div>

          <div className="flex space-x-4 overflow-auto pb-2">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 animate-pulse"
              >
                <div className="w-full h-full bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse mr-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          <div className="border-t pt-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component
const ProductDetailError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          We encountered an error while loading the product details. Please try
          again.
        </p>
        <div className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded border font-mono">
          {error.message}
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onRetry}
            className="bg-[#204462] hover:bg-[#204462]/90 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Product Not Found Component
const ProductNotFound = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 rounded-full p-6 mb-6">
          <ShoppingBasket className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            className="bg-[#204462] hover:bg-[#204462]/90 text-white"
          >
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailedPage = ({ slug }: { slug: string }) => {
  const {
    data: product,
    isLoading: productLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bundleItems, setBundleItems] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setBundleItems([product.id]);
    }
  }, [product]);

  const { addToCart } = useCartStore();

  const calculateOriginalPrice = (price: number, discount: number | null) => {
    if (!discount) return null;
    return price / (1 - discount / 100);
  };

  const toggleBundleItem = (id: string) => {
    if (bundleItems.includes(id)) {
      setBundleItems(bundleItems.filter((item) => item !== id));
    } else {
      setBundleItems([...bundleItems, id]);
    }
  };

  const calculateBundlePrice = () => {
    if (!product) return "0.00";

    let total = bundleItems.includes(product.id) ? product.price : 0;

    product.frequentlyBoughtTogether.forEach((item) => {
      if (bundleItems.includes(item.id)) {
        total += item.price;
      }
    });

    return total.toFixed(2);
  };

  // Handle sticky header
  const detailsRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (detailsRef.current) {
        const { top } = detailsRef.current.getBoundingClientRect();
        setIsSticky(top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (productLoading) {
    return <ProductDetailLoading />;
  }

  if (error) {
    return (
      <ProductDetailError error={error as Error} onRetry={() => refetch()} />
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  function handleAddToCart() {
    addToCart({
      id: product?.id ?? "",
      imageUrl: product?.imageUrl ?? "",
      name: product?.name ?? "",
      price: product?.price ?? 0,
      discount: product?.discount ?? 0,
    });

    toast.success("Success", {
      description: "Item added to cart successfully",
    });
  }

  function handleDecrement() {
    setQuantity(Math.max(1, quantity - 1));
  }

  function handleIncrement() {
    setQuantity(quantity + 1);
  }

  const images =
    product.productImages.length > 0
      ? product.productImages
      : [product.imageUrl];
  const originalPrice = calculateOriginalPrice(product.price, product.discount);
  const isInStock = product.stockQty > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded overflow-hidden">
              <Image
                src={images[0]}
                alt={product.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                {product.name}
              </h3>
              <p className="text-sm text-[#204462] font-medium">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-wrap flex-col gap-3">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={handleDecrement}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-3 py-1 text-sm">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="bg-[#204462] hover:bg-[#204462]/90 text-white"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <a href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </a>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
        <a href="/products" className="text-gray-500 hover:text-gray-700">
          Products
        </a>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex space-x-4 overflow-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${
                  selectedImage === index
                    ? "ring-2 ring-[#204462]"
                    : "ring-1 ring-gray-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div ref={detailsRef} className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <p className="text-sm text-gray-600">{product.summary}</p>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-center justify-between">
              <div className="mt-4 flex items-center">
                {product.discount && (
                  <div className="px-2 py-1 text-xs font-medium bg-[#f5c704] text-[#204462] rounded">
                    SAVE {product.discount}%
                  </div>
                )}
                <div className="ml-4 flex items-baseline">
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold text-[#204462]">
                    {formatPrice(product.price)}
                  </span>
                  {originalPrice && (
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    isInStock ? "bg-green-500" : "bg-red-500"
                  } mr-2`}
                ></div>
                <p
                  className={`text-sm ${
                    isInStock ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isInStock
                    ? `${product.stockQty} Items Left`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center border border-gray-200 rounded-md w-32">
              <button
                onClick={handleDecrement}
                className="px-3 cursor-pointer py-2 hover:text-gray-700 text-gray-600 hover:bg-gray-100"
              >
                <MinusCircle className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="cursor-pointer px-3 py-2 hover:text-gray-700 text-gray-600 hover:bg-gray-100"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex-1 bg-[#204462] hover:bg-[#204462]/90"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              disabled={!isInStock}
              className="bg-[#f5c704] hover:bg-[#f5c704]/90 text-[#204462]"
              size="lg"
            >
              Buy Now
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900">
              Product Description
            </h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {product.frequentlyBoughtTogether.length > 0 && (
        <FrequentlyBoughtTogetherItems
          toggleBundleItem={toggleBundleItem}
          calculateBundlePrice={calculateBundlePrice}
          bundleItems={bundleItems}
          product={{
            id: product.id,
            price: product.price,
            name: product.name,
            image: images[0],
          }}
          items={product.frequentlyBoughtTogether}
        />
      )}

      {/* Similar Products */}
      {product.similarProducts.length > 0 && (
        <SimilarProducts similarProducts={product.similarProducts} />
      )}
    </div>
  );
};

export default ProductDetailedPage;
