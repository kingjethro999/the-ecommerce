"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  ChevronRight,
  ShoppingBag,
  Heart,
  Star,
  Gift,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items: cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getCartTotalItems,
    getCartTotalPrice,
    clearCart,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoDiscount(0.1);
    } else if (promoCode.toLowerCase() === "welcome20") {
      setPromoDiscount(0.2);
    } else {
      setPromoDiscount(0);
    }
  };

  const getSubtotal = () => getCartTotalPrice();
  const getDiscount = () => getSubtotal() * promoDiscount;
  const getTotal = () => getSubtotal() - getDiscount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#e0e6ed] rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e6ed]"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-[#e0e6ed] rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#e0e6ed] rounded w-3/4"></div>
                        <div className="h-4 bg-[#e0e6ed] rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e6ed]">
                  <div className="h-6 bg-[#e0e6ed] rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-[#e0e6ed] rounded"></div>
                    <div className="h-4 bg-[#e0e6ed] rounded"></div>
                    <div className="h-10 bg-[#e0e6ed] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-[#204462]/30" />
            </div>
            <h1 className="text-4xl font-light text-[#204462] mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-[#204462]/80 mb-8 text-lg">
              Discover amazing products and start shopping
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-[#204462] to-[#1a3a52] hover:from-[#1a3a52] hover:to-[#153046] text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e8f0f7] pt-16 md:pt-24 pb-8 md:px-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-[#204462] tracking-wide">
              Shopping Cart
            </h1>
            <p className="text-[#204462]/80 mt-2">
              {getCartTotalItems()}{" "}
              {getCartTotalItems() === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button onClick={clearCart} variant={"destructive"}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-8 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow border border-[#e0e6ed] overflow-hidden transition-all duration-300"
              >
                {/* Desktop Layout */}
                <div className="hidden lg:block p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-[#f5f7fa] to-[#e8edf4] rounded-2xl overflow-hidden flex-shrink-0 group">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#204462] mb-2 text-lg">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4
                                  ? "text-[#f5c704] fill-current"
                                  : "text-[#e0e6ed]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-[#204462]/70">(4.0)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#204462]">
                          {formatPrice(item.price)}
                        </span>
                        {item.discount && (
                          <span className="text-lg text-[#204462]/50 line-through">
                            {formatPrice(
                              item.price / (1 - item.discount / 100)
                            )}
                          </span>
                        )}
                        {item.discount && (
                          <span className="bg-[#f5c704]/20 text-[#204462] px-2 py-1 rounded-lg text-sm font-medium">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#f5f7fa] rounded-xl border border-[#e0e6ed]">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="px-4 py-3 hover:bg-[#e0e6ed] transition-colors rounded-l-xl"
                        >
                          <Minus className="w-4 h-4 text-[#204462]" />
                        </button>
                        <span className="px-6 py-3 font-medium min-w-[60px] text-center text-[#204462]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="px-4 py-3 hover:bg-[#e0e6ed] transition-colors rounded-r-xl"
                        >
                          <Plus className="w-4 h-4 text-[#204462]" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#f5f7fa] rounded-xl transition-colors">
                          <Heart className="w-5 h-5 text-[#204462]/70 hover:text-red-500" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-[#204462]/70 hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#204462]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#f5f7fa] to-[#e8edf4] rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-[#204462] text-sm leading-tight">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-[#204462]">
                            {formatPrice(item.price)}
                          </span>
                          {item.discount && (
                            <span className="text-sm text-[#204462]/50 line-through">
                              {formatPrice(
                                item.price / (1 - item.discount / 100)
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="text-[#204462]/70 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center bg-[#f5f7fa] rounded-xl border border-[#e0e6ed]">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="px-3 py-2 hover:bg-[#e0e6ed] transition-colors rounded-l-xl"
                          >
                            <Minus className="w-4 h-4 text-[#204462]" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[50px] text-center text-sm text-[#204462]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.id)}
                            className="px-3 py-2 hover:bg-[#e0e6ed] transition-colors rounded-r-xl"
                          >
                            <Plus className="w-4 h-4 text-[#204462]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-[#e0e6ed] text-[#204462] hover:border-[#204462] hover:text-[#204462] rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e6ed] p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-[#204462] mb-6">
                Order Summary
              </h2>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-[#f5f7fa] to-[#e8edf4] rounded-xl">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-[#204462] mx-auto mb-1" />
                  <span className="text-xs text-[#204462]/80">
                    Free Shipping
                  </span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-[#204462] mx-auto mb-1" />
                  <span className="text-xs text-[#204462]/80">Secure</span>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-[#204462] mx-auto mb-1" />
                  <span className="text-xs text-[#204462]/80">
                    Fast Delivery
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#204462] mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border border-[#e0e6ed] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#204462] focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-3 bg-[#f5f7fa] hover:bg-[#e0e6ed] text-[#204462] rounded-xl transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p className="text-[#f5c704] text-sm mt-2">
                    ✓ Promo code applied! {promoDiscount * 100}% off
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#204462]/80">
                  <span>Subtotal ({getCartTotalItems()} items)</span>
                  <span className="font-medium">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>

                <div className="flex justify-between text-[#204462]/80">
                  <span>Shipping</span>
                  <span className="font-medium text-[#f5c704]">Free</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#f5c704]">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{formatPrice(getDiscount())}
                    </span>
                  </div>
                )}

                <div className="border-t border-[#e0e6ed] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#204462]">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#204462] to-[#1a3a52] hover:from-[#1a3a52] hover:to-[#153046] text-white py-4 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Payment Methods */}
              <div className="mt-4 text-center">
                <p className="text-sm text-[#204462]/70 mb-3">We accept</p>
                <div className="flex justify-center gap-2">
                  {["Visa", "MC", "PayPal", "Apple Pay"].map((method) => (
                    <div
                      key={method}
                      className="px-3 py-1 bg-[#f5f7fa] rounded text-xs font-medium text-[#204462]"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Checkout */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#204462] to-[#1a3a52] text-white p-4 shadow-2xl">
        <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-between"
        >
          <div className="text-left">
            <div className="text-sm opacity-90">
              {getCartTotalItems()} Items
            </div>
            <div className="font-bold text-lg">{formatPrice(getTotal())}</div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <span className="font-semibold">Checkout</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="xl:hidden h-20"></div>
    </div>
  );
}
