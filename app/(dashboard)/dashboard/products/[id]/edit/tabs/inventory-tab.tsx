"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Product } from "@/types/item";
import { useUpdateProduct } from "@/hooks/useProducts";

export function PricingInventoryTab({ product }: { product: Product }) {
  return (
    <div className="grid gap-6 mt-6">
      <MainPricingCard product={product} />
      <BuyingDealPriceCard product={product} />
      <StockManagementCard product={product} />
      <FeaturesCard product={product} />
    </div>
  );
}

// Main Pricing Card (Price & Discount)
function MainPricingCard({ product }: { product: Product }) {
  const [price, setPrice] = useState(product.price.toString());
  const [discount, setDiscount] = useState(product.discount?.toString() || "");
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    if (!price.trim()) {
      toast.error("Price is required");
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      const data: any = {};
      if (priceValue !== product.price) data.price = priceValue;

      const discountValue = discount ? parseFloat(discount) : null;
      if (discountValue !== product.discount) {
        data.discount = discountValue;
      }

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Pricing</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="price">Selling Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending ? "Updating..." : "Update Pricing"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Buying & Deal Price Card
function BuyingDealPriceCard({ product }: { product: Product }) {
  const [buyingPrice, setBuyingPrice] = useState(
    product.buyingPrice?.toString() || ""
  );
  const [dealPrice, setDealPrice] = useState(
    product.dealPrice?.toString() || ""
  );
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      const data: any = {};

      const buyingPriceValue = buyingPrice ? parseFloat(buyingPrice) : null;
      if (buyingPriceValue !== product.buyingPrice) {
        data.buyingPrice = buyingPriceValue;
      }

      const dealPriceValue = dealPrice ? parseFloat(dealPrice) : null;
      if (dealPriceValue !== product.dealPrice) {
        data.dealPrice = dealPriceValue;
      }

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost & Deal Pricing</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="buyingPrice">Buying/Cost Price</Label>
          <Input
            id="buyingPrice"
            type="number"
            step="0.01"
            min="0"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="dealPrice">Deal Price</Label>
          <Input
            id="dealPrice"
            type="number"
            step="0.01"
            min="0"
            value={dealPrice}
            onChange={(e) => setDealPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Cost & Deal Pricing"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Stock Management Card
function StockManagementCard({ product }: { product: Product }) {
  const [stockQty, setStockQty] = useState(product.stockQty?.toString() || "");
  const [lowStockAlert, setLowStockAlert] = useState(
    product.lowStockAlert?.toString() || "5"
  );
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      const data: any = {};

      const stockQtyValue = stockQty ? parseInt(stockQty) : null;
      if (stockQtyValue !== product.stockQty) {
        data.stockQty = stockQtyValue;
      }

      const lowStockAlertValue = lowStockAlert ? parseInt(lowStockAlert) : null;
      if (lowStockAlertValue !== product.lowStockAlert) {
        data.lowStockAlert = lowStockAlertValue;
      }

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Management</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="stockQty">Stock Quantity</Label>
          <Input
            id="stockQty"
            type="number"
            min="0"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lowStockAlert">Low Stock Alert Level</Label>
          <Input
            id="lowStockAlert"
            type="number"
            min="0"
            value={lowStockAlert}
            onChange={(e) => setLowStockAlert(e.target.value)}
            placeholder="5"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Stock Management"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Features Card
function FeaturesCard({ product }: { product: Product }) {
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [isDeal, setIsDeal] = useState(product.isDeal);
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      const data: any = {};
      if (isFeatured !== product.isFeatured) data.isFeatured = isFeatured;
      if (isDeal !== product.isDeal) data.isDeal = isDeal;

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Features</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Featured Product
          </Label>
          <Switch
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="isDeal" className="cursor-pointer">
            Deal Product
          </Label>
          <Switch id="isDeal" checked={isDeal} onCheckedChange={setIsDeal} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending ? "Updating..." : "Update Features"}
        </Button>
      </CardFooter>
    </Card>
  );
}
