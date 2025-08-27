"use server";

import { ProductFormData } from "@/app/(dashboard)/dashboard/products/components/ProductForm";
import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";

import {
  Product,
  ProductCreateDTO,
  ProductDetail,
  ProductsWithCategories,
  NavigationProduct,
  DashboardProduct,
  BriefItemsObject,
} from "@/types/item";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/dashboard`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
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

export async function createProduct(data: ProductFormData) {
  console.log(data);

  const api = await getAuthenticatedApi();
  try {
    const res = await api.post("/products", data);
    console.log(res.data);
    return {
      success: true,
      data: res.data.data, // Return created product ID
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to Create Product",
      data: null,
    };
  }
}

// Get optimized product list (SOAPI: Optimized Queries)
export async function getDashboardProducts(): Promise<DashboardProduct[]> {
  try {
    const res = await api.get("/products/dashboard");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
export async function getBriefItems(): Promise<BriefItemsObject> {
  try {
    const res = await api.get("/stats/brief-items");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateProduct(
  id: string,
  data: Partial<ProductCreateDTO>
) {
  console.log("Updating product:", id, "with changes:", data);

  const api = await getAuthenticatedApi();
  try {
    // Use PATCH instead of PUT for partial updates
    const res = await api.patch(`/products/${id}`, data);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated product
      error: null,
    };
  } catch (error) {
    console.log("Update error:", error);
    return {
      success: false,
      error: "Failed to Update Product",
      data: null,
    };
  }
}

export async function deleteProduct(id: string) {
  const api = await getAuthenticatedApi();
  try {
    const res = await api.delete(`/products/${id}`);
    console.log("Delete response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return response data
      error: null,
    };
  } catch (error) {
    console.log("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete Product",
      data: null,
    };
  }
}
