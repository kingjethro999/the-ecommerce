"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { useBriefItems, useProduct } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import TableError from "@/components/ui/data-table/table-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { BasicInfoTab } from "./tabs/basic-info-tab";
import { PricingInventoryTab } from "./tabs/inventory-tab";
import { AdditionalDetailsTab } from "./tabs/additional-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// export interface Option {
//   label: string;
//   value: string;
// }

export function ProductUpdateForm({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState("basic-info");

  // Fetch product data
  const {
    data: product,
    refetch: refetchProduct,
    isError: isProductError,
    error: productError,
    isLoading: isProductLoading,
  } = useProduct(id);
  // const {
  //   brands = [],
  //   isError: isBrandsError,
  //   error: brandsError,
  //   isLoading: isBrandsLoading,
  // } = useBrands();
  const {
    items,
    isError: isItemsError,
    error: itemsError,
    isLoading: isItemsLoading,
  } = useBriefItems();

  // // Fetch categories data
  // const {
  //   categories = [],
  //   isError: isCategoriesError,
  //   error: categoriesError,
  //   isLoading: isCategoriesLoading,
  // } = useCategories();

  // Handle loading states
  if (isProductLoading || isItemsLoading) {
    return <ProductUpdateFormSkeleton />;
  }

  // Handle error states
  if (isProductError) {
    return (
      <TableError
        title="Failed to load product"
        subtitle="Unable to fetch product data"
        error={productError}
        onRetry={refetchProduct}
      />
    );
  }

  if (isItemsError) {
    return (
      <TableError
        title="Failed to load form data"
        subtitle="Unable to fetch brands or categories"
        error={itemsError}
        onRetry={() => {
          // You might want to refetch both brands and categories here
          window.location.reload();
        }}
      />
    );
  }

  if (!product || !items) {
    return (
      <TableError
        title="Product not found"
        subtitle="The requested product could not be found"
        error={new Error("Product not found")}
        onRetry={refetchProduct}
      />
    );
  }
  // const brandOptions =
  //   brands.map((item) => {
  //     return {
  //       label: item.title,
  //       value: item.id,
  //     };
  //   }) || [];
  // const categoryOptions =
  //   categories.map((item) => {
  //     return {
  //       label: item.name,
  //       value: item.id,
  //     };
  //   }) || [];
  const { brandOptions, categoryOptions, productOptions } = items;
  return (
    <div className="container mx-auto py-6 p-8 md:p-16">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to products</span>
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard/products" className="hover:underline">
              Products
            </Link>{" "}
            / <span>Edit</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Slug: {product.slug} • Last updated:{" "}
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleDateString()
                : new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button href={`/products/${product.slug}`} variant="outline">
              Preview
            </Button>
          </div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full p-0 bg-transparent border-b rounded-none mb-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted"></div>
          <TabsTrigger
            value="basic-info"
            className={cn(
              "py-3 px-6 rounded-none data-[state=active]:shadow-none relative",
              "data-[state=active]:text-primary data-[state=active]:font-medium",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
            )}
          >
            Basic Information
          </TabsTrigger>
          <TabsTrigger
            value="pricing-inventory"
            className={cn(
              "py-3 px-6 rounded-none data-[state=active]:shadow-none relative",
              "data-[state=active]:text-primary data-[state=active]:font-medium",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
            )}
          >
            Pricing & Inventory
          </TabsTrigger>
          <TabsTrigger
            value="additional-details"
            className={cn(
              "py-3 px-6 rounded-none data-[state=active]:shadow-none relative",
              "data-[state=active]:text-primary data-[state=active]:font-medium",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
            )}
          >
            Additional Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <BasicInfoTab
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
            product={product}
          />
        </TabsContent>

        <TabsContent value="pricing-inventory">
          <PricingInventoryTab product={product} />
        </TabsContent>

        <TabsContent value="additional-details">
          <AdditionalDetailsTab
            productOptions={productOptions}
            product={product}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading skeleton component
function ProductUpdateFormSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Tabs skeleton */}
      <div className="w-full p-0 border-b rounded-none mb-6 relative">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted"></div>
        <div className="flex">
          <div className="py-3 px-6 relative">
            <Skeleton className="h-5 w-32" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          </div>
          <div className="py-3 px-6">
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="py-3 px-6">
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid gap-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
