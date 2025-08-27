"use server";

import { API_BASE_URL } from "@/config/axios";

export type StatsData = {
  customers: { value: number; change: number };
  orders: { value: number; change: number };
  products: { value: number; change: number };
  categories: { value: number; change: number };
  period: string;
};

export async function getStats(period = "today"): Promise<StatsData> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/dashboard-stats?period=${period}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getStats server action:", error);
    throw new Error("Failed to fetch statistics");
  }
}
