// File: lib/server-actions.ts
"use server";

import { API_BASE_URL } from "@/config/axios";
import { paginateArray } from "@/lib/paginateArray";
import { HomeBanner } from "@/types/banners";
import { NavigationDepartment } from "@/types/departments";
import { DealProduct, DetailProduct } from "@/types/products";
import {
  Category,
  Product,
  CreateCategoryRequest,
  PaginatedResponse,
  StatsData,
} from "@/types/types";

export async function getDealProducts(): Promise<DealProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product-deals`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
export async function getSearchProducts(
  query: string | null | undefined
): Promise<DealProduct[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/search-products?query=${query}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getProductBySlug(slug: string): Promise<DetailProduct> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/product/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getAllProductDeals(
  cursor?: string,
  limit = 4
): Promise<PaginatedResponse<DealProduct>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product-deals/all`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = (await response.json()) as DealProduct[];
    const paginatedData = paginateArray(products, cursor, limit);
    return paginatedData;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
