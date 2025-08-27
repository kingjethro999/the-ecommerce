"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopProducts, getRecentOrders } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "succeeded":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

export function DashboardOverview() {
  const {
    data: topProducts,
    isLoading: topProductsLoading,
    error: topProductsError,
  } = useQuery({
    queryKey: ["top-products"],
    queryFn: getTopProducts,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: recentOrders,
    isLoading: recentOrdersLoading,
    error: recentOrdersError,
  } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrdersLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : recentOrdersError ? (
              <div className="text-center py-4 text-muted-foreground">
                Failed to load recent orders
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(order.totalOrderAmount)}
                    </p>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(order.paymentStatus)}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent orders found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProductsLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
            ) : topProductsError ? (
              <div className="text-center py-4 text-muted-foreground">
                Failed to load top products
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.count} {product.count === 1 ? "sale" : "sales"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(product.total)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No top products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
