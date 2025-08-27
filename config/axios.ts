// config/axios.ts
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

// Add validation and fallback
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not set in environment variables");
}

// Create a base axios instance without authentication
const baseApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { baseApi as api };

export async function getAuthenticatedApi() {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  const authResult = await auth();
  const token = await authResult.getToken();

  return axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
