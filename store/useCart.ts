import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CartItem } from "@/types/cart";
import { ProductBrief } from "@/types/products";
interface CartState {
  items: CartItem[];
  addToCart: (product: ProductBrief) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getCartTotalItems: () => number;
  getCartTotalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          }
        });
      },
      incrementQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },
      decrementQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map(
              (item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                  : item // Ensure quantity doesn't go below 0
            )
            .filter((item) => item.quantity > 0), // Remove if quantity becomes 0
        }));
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      getCartTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getCartTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "ecommerce-cart-storage", // Unique name for your storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
