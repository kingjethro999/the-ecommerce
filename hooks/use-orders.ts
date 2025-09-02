"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders, type OrdersResponse } from "@/actions/orders";
import { useMemo } from "react";

interface UseOrdersParams {
  period?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useOrders(params: UseOrdersParams = {}) {
  const { period = "today", page = 1, limit = 10, search, status } = params;

  const query = useQuery<OrdersResponse, Error>({
    queryKey: ["orders", period],
    queryFn: () => getOrders(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const processedData = useMemo(() => {
    if (!query.data?.orders) {
      return {
        orders: [],
        total: 0,
        totalPages: 0,
        page,
        limit,
      };
    }

    let filteredOrders = query.data.orders;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.user.name.toLowerCase().includes(searchLower) ||
          order.user.email.toLowerCase().includes(searchLower) ||
          order.orderItems.some((item) =>
            item.title.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply status filter
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.paymentStatus === status
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / limit),
      page,
      limit,
    };
  }, [query.data?.orders, search, status, page, limit]);

  return {
    ...query,
    data: processedData,
  };
}
