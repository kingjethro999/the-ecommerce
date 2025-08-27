"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCustomerData, type Customer } from "@/actions/customer-actions";

export function useCustomerData(userId: string) {
  return useQuery<Customer, Error>({
    queryKey: ["customer", userId],
    queryFn: () => fetchCustomerData(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
