"use server";

import { API_BASE_URL } from "@/config/axios";

export interface TopProduct {
  id: string;
  name: string;
  total: number;
  count: number;
}

export interface RecentOrder {
  id: string;
  paymentStatus: string;
  orderNumber: string;
  totalOrderAmount: number;
  user: {
    name: string;
  };
}

export async function getTopProducts(): Promise<TopProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/top-products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recent-orders`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recent orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}
