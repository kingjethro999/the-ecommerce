"use server";

import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";

import {
  Brand,
  BrandCreateDTO,
  BrandDetail,
  BrandsWithCategories,
  NavigationBrand,
} from "@/types/brands";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function getAllBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/brands`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

export async function getBrandBySlug(slug: string): Promise<BrandDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/brands/brand/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brand");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

export async function createBrand(data: BrandCreateDTO) {
  console.log(data);

  const api = await getAuthenticatedApi();
  try {
    const res = await api.post("/brands", data);
    console.log(res.data);
    return {
      success: true,
      data: res.data.data, // Return created brand ID
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to Create Brand",
      data: null,
    };
  }
}

// Get optimized brand list (SOAPI: Optimized Queries)
export async function getBrands(): Promise<Brand[]> {
  try {
    const res = await api.get("/brands");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch brands");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateBrand(id: string, data: Partial<BrandCreateDTO>) {
  console.log("Updating brand:", id, "with changes:", data);

  const api = await getAuthenticatedApi();
  try {
    // Use PATCH instead of PUT for partial updates
    const res = await api.patch(`/brands/${id}`, data);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated brand
      error: null,
    };
  } catch (error) {
    console.log("Update error:", error);
    return {
      success: false,
      error: "Failed to Update Brand",
      data: null,
    };
  }
}

export async function deleteBrand(id: string) {
  const api = await getAuthenticatedApi();
  try {
    const res = await api.delete(`/brands/${id}`);
    console.log("Delete response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return deleted brand
      error: null,
    };
  } catch (error) {
    console.log("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete Brand",
      data: null,
    };
  }
}
