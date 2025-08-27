import { getCustomers } from "@/actions/users";

import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: any) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export function useCustomers() {
  const {
    data: customers,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => getCustomers(),
  });

  return {
    customers: customers,
    refetch,
    isError,
    error,
    isLoading,
  };
}
