// lib/actions/user-actions.ts
"use server";

import { api, API_BASE_URL } from "@/config/axios";
import { Customer, User, UserDetails } from "@/types/user";
import axios from "axios";
import { z } from "zod";

const ClerkUserSchema = z.object({
  clerkUserId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  image: z.string(),
});
type ClerkUser = z.infer<typeof ClerkUserSchema>;

interface RegistrationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function registerUser(
  data: UserDetails
): Promise<RegistrationResult> {
  try {
    // Validate required fields
    if (!data.clerkUserId || !data.email) {
      return {
        success: false,
        error: "Missing required user information",
      };
    }

    // Call your API endpoint
    const response = await api.post("/users/register", data);
    // const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     clerkUserId: userDetails.clerkUserId,
    //     email: userDetails.email,
    //     firstName: userDetails.firstName,
    //     lastName: userDetails.lastName,
    //     name: userDetails.name,
    //   }),
    // });
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
      error: "Failed to register user. Please try again.",
    };
  }
}

// Get optimized category list
export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get("/users");
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
    const res = await api.get("/customers");
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("An unexpected error occurred");
  }
}
