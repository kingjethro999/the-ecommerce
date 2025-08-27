// import {
//   createProduct,
//   getBriefProducts,
//   getProductById,
//   updateProductById,
//   deleteProduct,
// } from "@/services/products";
// import { ProductCreateDTO } from "@/types/product";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "@/actions/departments";
import { DepartmentCreateDTO } from "@/types/departments";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters: any) => [...departmentKeys.lists(), { filters }] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

export function useDepartments() {
  const {
    data: departments,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => getDepartments(),
  });

  return {
    departments: departments,
    refetch,
    isError,
    error,
    isLoading,
  };
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentCreateDTO) => createDepartment(data),
    onSuccess: () => {
      toast.success("Department created successfully");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to add Department", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DepartmentCreateDTO>;
    }) => updateDepartment(id, data),
    onSuccess: (result, variables) => {
      toast.success("Department updated successfully");
      // Invalidate and refetch department lists
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      // If you have individual department queries, invalidate those too
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update Department", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      // toast.success("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete department", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
