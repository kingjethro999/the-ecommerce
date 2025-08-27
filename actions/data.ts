// File: lib/server-actions.ts
"use server";

import { API_BASE_URL } from "@/config/axios";
import { paginateArray } from "@/lib/paginateArray";
import {
  Category,
  Product,
  CreateCategoryRequest,
  PaginatedResponse,
  StatsData,
} from "@/types/types";

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
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

export async function getProducts(
  cursor?: string,
  limit = 10,
  categoryId?: string,
  search?: string
): Promise<PaginatedResponse<Product>> {
  try {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    if (cursor) {
      params.set("cursor", cursor);
    }
    if (categoryId) {
      params.set("categoryId", categoryId);
    }
    if (search) {
      params.set("search", search);
    }

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = (await response.json()) as Product[];
    const paginatedData = paginateArray(products, cursor, limit);
    return paginatedData;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createCategory(
  data: CreateCategoryRequest
): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create category"
    );
  }
}

export async function getProductsByCategory(
  categoryId: string,
  cursor?: string,
  limit = 10
): Promise<PaginatedResponse<Product>> {
  try {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    if (cursor) {
      params.set("cursor", cursor);
    }

    const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }

    const products = (await response.json()) as Product[];
    const paginatedData = paginateArray(products, cursor, limit);
    return paginatedData;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
}

export async function getStats(): Promise<StatsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch stats");
  }
}
