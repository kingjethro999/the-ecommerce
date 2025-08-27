import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "@/actions/brands";
import { BrandCreateDTO } from "@/types/brands";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters: any) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export function useBrands() {
  const {
    data: brands,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: brandKeys.lists(),
    queryFn: () => getBrands(),
  });

  return {
    brands: brands,
    refetch,
    isError,
    error,
    isLoading,
  };
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandCreateDTO) => createBrand(data),
    onSuccess: () => {
      toast.success("Brand created successfully");
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to add Brand", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandCreateDTO> }) =>
      updateBrand(id, data),
    onSuccess: (result, variables) => {
      toast.success("Brand updated successfully");
      // Invalidate and refetch brand lists
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      // If you have individual brand queries, invalidate those too
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update Brand", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      // toast.success("Brand deleted successfully");
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete brand", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
