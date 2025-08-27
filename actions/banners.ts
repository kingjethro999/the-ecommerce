"use server";

import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";
import { HomeBanner } from "@/types/banners";
import type { Banner, BannerCreateDTO, BannerDetail } from "@/types/banners";
import axios from "axios";

export async function getHomeBanners(): Promise<HomeBanner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners`, {
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

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch banners");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw new Error("Failed to fetch banners");
  }
}

export async function getBannerById(id: string): Promise<BannerDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch banner");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw new Error("Failed to fetch banner");
  }
}

export async function createBanner(data: BannerCreateDTO) {
  console.log(data);
  const api = await getAuthenticatedApi();
  try {
    const res = await api.post("/banners", data);
    console.log(res.data);
    return {
      success: true,
      data: res.data.data, // Return created banner ID
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to Create Banner",
      data: null,
    };
  }
}

// Get optimized banner list
export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await api.get("/banners");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch banners");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateBanner(id: string, data: Partial<BannerCreateDTO>) {
  console.log("Updating banner:", id, "with changes:", data);
  const api = await getAuthenticatedApi();
  try {
    // Use PATCH instead of PUT for partial updates
    const res = await api.patch(`/banners/${id}`, data);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated banner
      error: null,
    };
  } catch (error) {
    console.log("Update error:", error);
    return {
      success: false,
      error: "Failed to Update Banner",
      data: null,
    };
  }
}

export async function deleteBanner(id: string) {
  const api = await getAuthenticatedApi();
  try {
    const res = await api.delete(`/banners/${id}`);
    console.log("Delete response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return deleted banner
      error: null,
    };
  } catch (error) {
    console.log("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete Banner",
      data: null,
    };
  }
}

// Get active banners for public display
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const res = await api.get("/banners/active");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch active banners"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
