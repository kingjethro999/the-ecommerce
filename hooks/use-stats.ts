"use client";

import { useQuery } from "@tanstack/react-query";
import { getStats, type StatsData } from "@/actions/stats";

export function useStats(period = "today") {
  return useQuery<StatsData>({
    queryKey: ["stats", period],
    queryFn: () => getStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
