"use server";

import { api, getAuthenticatedApi } from "@/config/axios";

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

export async function getOrders() {
  const authedApi = await getAuthenticatedApi();
  const res = await authedApi.get("/orders");
  return res.data;
}
