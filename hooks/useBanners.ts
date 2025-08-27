import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
  getActiveBanners,
} from "@/actions/banners";
import type { BannerCreateDTO } from "@/types/banners";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for caching
export const bannerKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerKeys.all, "list"] as const,
  list: (filters: any) => [...bannerKeys.lists(), { filters }] as const,
  details: () => [...bannerKeys.all, "detail"] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
  active: () => [...bannerKeys.all, "active"] as const,
};

export function useBanners() {
  const {
    data: banners,
    refetch,
    isError,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: bannerKeys.lists(),
    queryFn: () => getBanners(),
  });

  return {
    banners: banners,
    refetch,
    isError,
    error,
    isLoading,
  };
}

export function useActiveBanners() {
  return useQuery({
    queryKey: bannerKeys.active(),
    queryFn: () => getActiveBanners(),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BannerCreateDTO) => createBanner(data),
    onSuccess: () => {
      toast.success("Banner created successfully");
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
    },
    onError: (error: Error) => {
      toast.error("Failed to add Banner", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BannerCreateDTO>;
    }) => updateBanner(id, data),
    onSuccess: (result, variables) => {
      toast.success("Banner updated successfully");
      // Invalidate and refetch banner lists
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
      // If you have individual banner queries, invalidate those too
      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update Banner", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete banner", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
