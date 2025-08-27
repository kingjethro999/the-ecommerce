import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Package, CreditCard } from "lucide-react";
import type { Order } from "@/actions/orders";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={order.user.image || "/placeholder.svg"}
                alt={order.user.name}
              />
              <AvatarFallback>
                {order.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{order.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {order.user.email}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(order.paymentStatus)}>
            {order.paymentStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{order.orderNumber}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            Order Items ({order.orderItems.length})
          </h4>
          <div className="space-y-2">
            {order.orderItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-10 w-10 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${item.price}
                  </p>
                </div>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{order.orderItems.length - 2} more items
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <span className="font-bold text-lg">${order.totalOrderAmount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
