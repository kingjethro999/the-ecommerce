// store/recentlyViewedStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SimilarProduct } from "@/types/products";

interface RecentlyViewedState {
  items: SimilarProduct[];
  addToRecentlyViewed: (product: SimilarProduct) => void;
  removeFromRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  getRecentlyViewedItems: () => SimilarProduct[];
  getRecentlyViewedCount: () => number;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addToRecentlyViewed: (product) => {
        set((state) => {
          // Remove the product if it already exists to avoid duplicates
          const filteredItems = state.items.filter(
            (item) => item.id !== product.id
          );

          // Add the product to the beginning of the array
          const newItems = [product, ...filteredItems];

          // Limit to last 20 viewed items
          const limitedItems = newItems.slice(0, 20);

          return {
            items: limitedItems,
          };
        });
      },

      removeFromRecentlyViewed: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearRecentlyViewed: () => {
        set({ items: [] });
      },

      getRecentlyViewedItems: () => {
        return get().items;
      },

      getRecentlyViewedCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "ecommerce-recently-viewed-storage", // Unique name for your storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
