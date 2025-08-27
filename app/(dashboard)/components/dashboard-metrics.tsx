"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/use-stats";
import {
  Users,
  ShoppingCart,
  Package,
  FolderOpen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "today" | "last7days" | "last28days" | "total";

const periodLabels = {
  today: "Today",
  last7days: "7 Days",
  last28days: "28 Days",
  total: "Total",
};

const metrics = [
  {
    key: "customers" as const,
    title: "Total Customers",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500",
  },
  {
    key: "orders" as const,
    title: "Total Orders",
    icon: ShoppingCart,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500",
  },
  {
    key: "products" as const,
    title: "Total Products",
    icon: Package,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500",
  },
  {
    key: "categories" as const,
    title: "Total Categories",
    icon: FolderOpen,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500",
  },
];

export function DashboardMetrics() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("today");
  const { data: stats, isLoading, error } = useStats(selectedPeriod);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Time Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(periodLabels) as Period[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                disabled={isLoading}
              >
                {periodLabels[period]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const value = stats?.[metric.key]?.value ?? 0;
          const change = stats?.[metric.key]?.change ?? 0;
          const isPositive = change >= 0;

          return (
            <Card key={metric.key} className="relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`}
              />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      value.toLocaleString()
                    )}
                  </div>

                  {selectedPeriod !== "total" && (
                    <div className="flex items-center space-x-1 text-sm">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          isPositive ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {isLoading ? (
                          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                        ) : (
                          `${isPositive ? "+" : ""}${change.toFixed(1)}%`
                        )}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {periodLabels[selectedPeriod]}'s value
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
