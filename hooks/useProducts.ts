import {
  createProduct,
  deleteProduct,
  getBriefItems,
  getDashboardProducts,
  getProductById,
  updateProduct,
} from "@/actions/items";
import { ProductFormData } from "@/app/(dashboard)/dashboard/products/components/ProductForm";
import { ProductCreateDTO, Product } from "@/types/item";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts() {
  const {
    data: products,
    refetch,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => getDashboardProducts(),
  });

  return {
    products: products,
    refetch,
    isError,
    error,
    isLoading,
  };
}
export function useBriefItems() {
  const {
    data: items,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: ["items"],
    queryFn: () => getBriefItems(),
  });

  return {
    items: items,
    refetch,
    isError,
    error,
    isLoading,
  };
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to add Product", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductCreateDTO>;
    }) => updateProduct(id, data),
    onSuccess: (result, variables) => {
      toast.success("Product updated successfully");
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // If you have individual product queries, invalidate those too
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update Product", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      // toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
