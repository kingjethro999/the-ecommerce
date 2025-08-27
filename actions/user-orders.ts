"use server";

import { API_BASE_URL } from "@/config/axios";
import { auth } from "@clerk/nextjs/server";

export interface UserOrderItem {
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

export interface UserOrder {
  id: string;
  orderNumber: string;
  paymentStatus: "SUCCEEDED" | "PENDING" | "FAILED";
  totalOrderAmount: number;
  createdAt: string;
  orderItems: UserOrderItem[];
  user: {
    name: string;
    email: string;
    id: string;
    clerkUserId: string;
    image: string;
  };
}

export async function fetchUserOrders(): Promise<UserOrder[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  console.log(userId);
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/users/${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user orders: ${response.statusText}`);
    }

    const orders: UserOrder[] = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}
