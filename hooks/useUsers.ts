import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoriesByDepartment,
} from "@/actions/categories";
import { getUsers } from "@/actions/users";
import type { CategoryCreateDTO } from "@/types/categories";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: any) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers() {
  const {
    data: users,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: userKeys.lists(),
    queryFn: () => getUsers(),
  });

  return {
    users: users,
    refetch,
    isError,
    error,
    isLoading,
  };
}
