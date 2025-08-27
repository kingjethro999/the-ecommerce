"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getSearchProducts } from "@/actions/products";

export interface DealProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  summary: string;
  imageUrl: string;
  stockQty: number;
}

export default function SearchInput({
  className = "",
  initialQuery = "",
}: {
  className?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: suggestions = [],
    isLoading: isSearching,
    error,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearchProducts(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log(`Searching for: ${query}`);
      setIsFocused(false);
    }
  };

  const formatPrice = (price: number, discount: number | null) => {
    if (discount) {
      const discountedPrice = price - (price * discount) / 100;
      return {
        original: `UGX ${price.toLocaleString()}`,
        discounted: `UGX ${discountedPrice.toLocaleString()}`,
        hasDiscount: true,
      };
    }
    return {
      original: `UGX ${price.toLocaleString()}`,
      discounted: null,
      hasDiscount: false,
    };
  };

  return (
    <div ref={searchRef} className={`relative ${className} text-black`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="What are you looking for?"
            className="w-full border rounded-lg outline-none  border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-0  focus:border-slate-800 transition-all"
            aria-label="Search"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <div className="py-1 max-h-60 overflow-auto">
              {suggestions.map((item) => {
                const priceInfo = formatPrice(item.price, item.discount);
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="flex items-center px-4 py-3 hover:bg-yellow-50 transition-colors"
                    onClick={() => setIsFocused(false)}
                  >
                    <div className="flex-shrink-0 h-12 w-12 mr-3">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-2">
                        {priceInfo.hasDiscount ? (
                          <>
                            <span className="text-sm font-semibold text-green-600">
                              {priceInfo.discounted}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {priceInfo.original}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                              -{item.discount}%
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">
                            {priceInfo.original}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isFocused && isSearching && debouncedQuery.trim().length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div className="py-4 px-4 text-center text-sm text-gray-500">
            Searching...
          </div>
        </motion.div>
      )}

      {isFocused &&
        !isSearching &&
        debouncedQuery.trim().length >= 2 &&
        suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <div className="py-4 px-4 text-center text-sm text-gray-500">
              No matches found
            </div>
          </motion.div>
        )}
    </div>
  );
}
