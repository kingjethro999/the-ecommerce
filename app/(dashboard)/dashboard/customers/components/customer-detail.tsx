"use client";

import { useState, useMemo } from "react";
import { useCustomerData } from "@/hooks/use-customer-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Package,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Order } from "@/actions/customer-actions";

interface CustomerDetailProps {
  userId: string;
}

const ORDERS_PER_PAGE = 5;

export function CustomerDetail({ userId }: CustomerDetailProps) {
  const { data: customer, isLoading, error } = useCustomerData(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and paginate orders
  const filteredOrders = useMemo(() => {
    if (!customer?.orders) return [];

    return customer.orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [customer?.orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load customer data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert>
        <AlertDescription>Customer not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={customer.image || "/placeholder.svg"}
                alt={customer.name}
              />
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <p className="text-muted-foreground">{customer.email}</p>
              <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Total Orders: {customer.orders.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Total Spent: $
                {customer.orders.reduce(
                  (sum, order) => sum + order.totalOrderAmount,
                  0
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Clerk ID: {customer.clerkUserId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, tracking, or products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No orders found matching your search."
                : "No orders found."}
            </div>
          ) : (
            <>
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getStatusColor={getStatusColor}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ORDERS_PER_PAGE,
                      filteredOrders.length
                    )}{" "}
                    of {filteredOrders.length} orders
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderCard({
  order,
  getStatusColor,
}: {
  order: Order;
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{order.orderNumber}</h3>
              <Badge className={getStatusColor(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
              <Badge className={getStatusColor(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Tracking: {order.trackingNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">${order.totalOrderAmount}</p>
            <p className="text-sm text-muted-foreground">
              {order.orderItems.length} item
              {order.orderItems.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm">Order Items:</h4>
          <div className="grid gap-2">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg"
              >
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-12 w-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${item.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">
                    ${item.quantity * item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
