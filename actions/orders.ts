"use server";

import { API_BASE_URL } from "@/config/axios";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  clerkUserId: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  paymentStatus: "SUCCEEDED" | "PENDING" | "FAILED";
  totalOrderAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  user: User;
}

export interface OrdersResponse {
  orders: Order[];
}

export async function fetchOrders(period = "today"): Promise<OrdersResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orders?period=${period}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const orders: Order[] = await response.json();

    return {
      orders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
