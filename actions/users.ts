// lib/actions/user-actions.ts
"use server";

import { api, API_BASE_URL, getAuthenticatedApi } from "@/config/axios";
import { Customer, User, UserDetails } from "@/types/user";
import axios from "axios";

interface RegistrationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function registerUser(
  data: UserDetails
): Promise<RegistrationResult> {
  try {
    if (!data.email) {
      return {
        success: false,
        error: "Missing required user information",
      };
    }

    const authedApi = await getAuthenticatedApi();
    const response = await authedApi.post("/users/register", data);
    if (response.status !== 200) {
      return {
        success: false,
        error: `Registration failed with status: ${response.status}`,
      };
    }
    const res = await response.data;
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error:
        axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to register user."
          : "Failed to register user. Please try again.",
    };
  }
}

// Get optimized category list
export async function getUsers(): Promise<User[]> {
  try {
    const authedApi = await getAuthenticatedApi();
    const res = await authedApi.get("/users");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("An unexpected error occurred");
  }
}
export async function getCustomers(): Promise<Customer[]> {
  try {
    const authedApi = await getAuthenticatedApi();
    const res = await authedApi.get("/customers");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("An unexpected error occurred");
  }
}
