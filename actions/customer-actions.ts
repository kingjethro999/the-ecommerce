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

export interface Order {
  id: string;
  orderNumber: string;
  totalOrderAmount: number;
  transactionId: string | null;
  paymentStatus: string;
  orderStatus: string;
  userId: string;
  trackingNumber: string;
  stripeCustomerId: string | null;
  stripePaymentIntentId: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  clerkUserId: string;
  image: string;
  orders: Order[];
}

export async function fetchCustomerData(userId: string): Promise<Customer> {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${API_BASE_URL}/api/customers/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw new Error("Failed to fetch customer data");
  }
}
