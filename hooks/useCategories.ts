import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoriesByDepartment,
} from "@/actions/categories";
import type { CategoryCreateDTO } from "@/types/categories";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  byDepartment: (departmentId: string) =>
    [...categoryKeys.all, "department", departmentId] as const,
};

export function useCategories() {
  const {
    data: categories,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => getCategories(),
  });

  return {
    categories: categories,
    refetch,
    isError,
    error,
    isLoading,
  };
}

export function useCategoriesByDepartment(departmentId: string) {
  return useQuery({
    queryKey: categoryKeys.byDepartment(departmentId),
    queryFn: () => getCategoriesByDepartment(departmentId),
    enabled: !!departmentId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreateDTO) => createCategory(data),
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to add Category", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CategoryCreateDTO>;
    }) => updateCategory(id, data),
    onSuccess: (result, variables) => {
      toast.success("Category updated successfully");
      // Invalidate and refetch category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // If you have individual category queries, invalidate those too
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update Category", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete category", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
