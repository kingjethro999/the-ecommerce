"use client";
// types.ts
export interface ICartItem {
  id: string;
  name: string;
  model: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

// CheckoutPage.tsx
import { useState } from "react";
import Image from "next/image";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PayForm from "@/components/stripe/stripe-elements/PayForm";
import { useCartStore } from "@/store/useCart";
import { Trash, Trash2 } from "lucide-react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}
const CheckoutPage = () => {
  const { items: cartItems, removeFromCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">(
    "credit-card"
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shopping Cart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 pb-4 border-b"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="font-semibold">${item.price}</p>
                  </div>

                  <div className="flex justify-between mt-2">
                    <p className="text-gray-600">
                      QTY: {item.quantity.toString().padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">ID: {item.id}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery and Payment */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-6">Delivery Info</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Robert"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Damas"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                defaultValue="8729 Bay Ave Brooklyn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="New York"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Hudson"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2">Zip *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="NY 11218"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="+1 262-872-0778"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-6">Payment</h2>
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(total),
                currency: "usd",
              }}
            >
              <PayForm cartItems={cartItems} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
