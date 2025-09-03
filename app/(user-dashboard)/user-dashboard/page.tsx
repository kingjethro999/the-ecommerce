"use client";
import Image from "next/image";
import { Download, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserOrders } from "@/hooks/use-user-orders";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF, InvoicePDFProps } from "./components/invoice-pdf";
import { UserOrder } from "@/actions/user-orders";
import { useAuth } from "@/providers/AuthProvider";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const {
    orders,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useUserOrders(user?.id ?? "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const OrderCard = ({ order }: { order: UserOrder }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">
              Order #: {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {order.orderItems.length} Products | {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <PDFDownloadLink
              document={<InvoicePDF order={order as any} />}
              fileName={`invoice-${order.orderNumber}.pdf`}
            >
              {({ blob, url, loading, error }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Download invoice"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <Badge className={`ml-2 ${getStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </Badge>
          </div>
          <div>
            <span className="text-gray-600">Order Date:</span>
            <span className="ml-2">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-semibold">
              {formatCurrency(order.totalOrderAmount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
            >
              <Image
                src={item.imageUrl || "/placeholder.svg?height=60&width=60"}
                alt={item.title}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    Quantity: {item.quantity}x ={" "}
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <div>Unit Price: {formatCurrency(item.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container max-w-5xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading orders: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-4">My Orders</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="current"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
            >
              Current
            </TabsTrigger>
            <TabsTrigger
              value="unpaid"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
            >
              Unpaid
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
            >
              All orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-0">
            <div className="space-y-6 p-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <Skeleton key={j} className="h-4 w-32" />
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, k) => (
                          <div
                            key={k}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-48 mb-2" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}

              {!isLoading && orders.length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Showing {orders.length} of {totalItems} orders
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!hasPreviousPage}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="unpaid">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div className="space-y-6">
                  {orders.filter(
                    (order) =>
                      order.paymentStatus === "PENDING" ||
                      order.paymentStatus === "FAILED"
                  ).length === 0 ? (
                    <div className="text-center text-gray-500">
                      No unpaid orders found.
                    </div>
                  ) : (
                    orders
                      .filter(
                        (order) =>
                          order.paymentStatus === "PENDING" ||
                          order.paymentStatus === "FAILED"
                      )
                      .map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="space-y-6 p-6">
              {isLoading ? (
                <div className="text-center">Loading all orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
