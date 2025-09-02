"use server";

import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";

import {
  Department,
  DepartmentCreateDTO,
  DepartmentDetail,
  DepartmentsWithCategories,
  NavigationDepartment,
} from "@/types/departments";
import axios from "axios";

export async function getNavDepartments(): Promise<NavigationDepartment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nav-departments`, {
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
export async function getAllDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
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
export async function getDepartmentsWithCategories(): Promise<
  DepartmentsWithCategories[]
> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/departments/categories`, {
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

export async function getDepartmentBySlug(
  slug: string
): Promise<DepartmentDetail> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/departments/department/${slug}`,
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

export async function createDepartment(data: DepartmentCreateDTO) {
  console.log(data);

  const api = await getAuthenticatedApi();
  try {
    const res = await api.post("/departments", data);
    console.log(res.data);
    return {
      success: true,
      data: res.data.data, // Return created dep ID
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
export async function getDepartments(): Promise<Department[]> {
  try {
    const res = await api.get("/departments");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch departments"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateDepartment(
  id: string,
  data: Partial<DepartmentCreateDTO>
) {
  console.log("Updating department:", id, "with changes:", data);

  const api = await getAuthenticatedApi();
  try {
    // Use PATCH instead of PUT for partial updates
    const res = await api.patch(`/departments/${id}`, data);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated department
      error: null,
    };
  } catch (error) {
    console.log("Update error:", error);
    return {
      success: false,
      error: "Failed to Update Department",
      data: null,
    };
  }
}
export async function deleteDepartment(id: string) {
  const api = await getAuthenticatedApi();
  try {
    const res = await api.delete(`/departments/${id}`);
    console.log("Update response:", res.data);
    return {
      success: true,
      data: res.data.data, // Return updated department
      error: null,
    };
  } catch (error) {
    console.log("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete Department",
      data: null,
    };
  }
}
