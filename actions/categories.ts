"use server";

import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";
import type {
  Category,
  CategoryCreateDTO,
  CategoryDetail,
} from "@/types/categories";
import axios from "axios";

// export async function getCategoryBySlug(slug: string): Promise<CategoryDetail> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/categories/${slug}`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch categories");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw new Error("Failed to fetch categories");
//   }
// }

export async function getAllCategories(): Promise<Category[]> {
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

export async function getCategoryBySlug(slug: string): Promise<CategoryDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function createCategory(data: CategoryCreateDTO) {
  console.log(data);
  const api = await getAuthenticatedApi();
  try {
    const res = await api.post("/categories", data);
    console.log(res.data);
    return {
      success: true,
      data: res.data.data, // Return created category ID
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to Create Category",
      data: null,
    };
  }
}

// Get optimized category list
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get("/categories");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch categories"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryCreateDTO>
) {
  console.log("Updating category:", id, "with changes:", data);
  const api = await getAuthenticatedApi();
  try {
    // Use PATCH instead of PUT for partial updates
    const res = await api.patch(`/categories/${id}`, data);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated category
      error: null,
    };
  } catch (error) {
    console.log("Update error:", error);
    return {
      success: false,
      error: "Failed to Update Category",
      data: null,
    };
  }
}

export async function deleteCategory(id: string) {
  const api = await getAuthenticatedApi();
  try {
    const res = await api.delete(`/categories/${id}`);
    console.log("Delete response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return deleted category
      error: null,
    };
  } catch (error) {
    console.log("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete Category",
      data: null,
    };
  }
}

// Get categories by department
export async function getCategoriesByDepartment(
  departmentId: string
): Promise<Category[]> {
  try {
    const res = await api.get(`/categories/department/${departmentId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch categories by department"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
