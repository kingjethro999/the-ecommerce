import { FrequentlyBoughtTogether } from "@/types/products";
import Image from "next/image";
import React from "react";

export default function FrequentlyBoughtTogetherItems({
  bundleItems,
  product,
  items,
  toggleBundleItem,
  calculateBundlePrice,
}: {
  bundleItems: string[];
  toggleBundleItem: (id: string) => void;
  product: {
    id: string;
    image: string;
    name: string;
    price: number;
  };
  items: FrequentlyBoughtTogether[];
  calculateBundlePrice: () => string;
}) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900">
        Frequently Bought Together
      </h2>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={bundleItems.includes(product.id)}
                  onChange={() => toggleBundleItem(product.id)}
                  className="absolute top-2 left-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 z-10"
                />
                <Image
                  src={product.image || "/default-image.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
            <span className="text-xl font-medium">+</span>

            {items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={bundleItems.includes(item.id)}
                      onChange={() => toggleBundleItem(item.id)}
                      className="absolute top-2 left-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 z-10"
                    />
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                {item.id !== items[items.length - 1].id && (
                  <span className="text-xl font-medium ml-6">+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Buy selected items:
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {bundleItems.includes(product.id) && (
                <li className="flex justify-between">
                  <span>{product.name}</span>
                  <span>${product.price.toFixed(2)}</span>
                </li>
              )}
              {items.map(
                (item) =>
                  bundleItems.includes(item.id) && (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  )
              )}
            </ul>
            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold">
                ${calculateBundlePrice()}
              </span>
            </div>
          </div>
          <button className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200">
            Add Selected to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
