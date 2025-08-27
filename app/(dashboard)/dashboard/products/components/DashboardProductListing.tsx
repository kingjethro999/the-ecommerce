"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Column,
  ConfirmationDialog,
  DataTable,
  TableActions,
  TableLoading,
} from "@/components/ui/data-table";

import { Badge } from "@/components/ui/badge";

import { useDeleteProduct, useProducts } from "@/hooks/useProducts";
import TableError from "@/components/ui/data-table/table-error";
import { DashboardProduct } from "@/types/item";
import ProductForm from "./ProductForm";

export default function DashboardProductListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // All hooks must be called at the top level, before any conditional returns
  const { products = [], isLoading, refetch, isError, error } = useProducts();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<DashboardProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  console.log(deleteItem);

  // Now handle conditional rendering after all hooks are called
  if (isError) {
    return (
      <TableError
        title="Failed to load products"
        subtitle="Unable to fetch product data"
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableLoading />
      </div>
    );
  }

  const columns: Column<DashboardProduct>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: (row) => {
        const product = row;
        const image = product.imageUrl || "/default-image.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-image.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              <span className="text-sm text-gray-500">/{product.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (row) => {
        const product = row;
        return (
          <div className="flex flex-col">
            <span className="font-medium">${product.price.toFixed(2)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "stockQty",
      header: "Stock",
      cell: (row) => {
        const product = row;
        const stockQty = product.stockQty || 0;
        const lowStockAlert = product.lowStockAlert || 5;

        return (
          <div className="flex flex-col">
            <span
              className={`font-medium ${
                stockQty <= lowStockAlert ? "text-red-600" : "text-gray-900"
              }`}
            >
              {stockQty} units
            </span>
            {stockQty <= lowStockAlert && (
              <span className="text-xs text-red-500">Low stock</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const product = row;
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const product = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(product.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredProducts: DashboardProduct[]) => {
    try {
      // Prepare data for export
      const exportData = filteredProducts.map((product) => ({
        ID: product.id,
        Name: product.name,
        Slug: product.slug,
        Price: product.price,
        "Stock Qty": product.stockQty || 0,
        "Low Stock Alert": product.lowStockAlert || 5,
        Discount: product.discount || "N/A",
        Status: product.isActive ? "Active" : "Inactive",
        "Image URL": product.imageUrl || "No image",
        "Created At": format(
          new Date(product.createdAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      // Generate filename with current date
      const fileName = `Products_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Products exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click - route to edit page instead of modal
  const handleEditClick = (product: DashboardProduct) => {
    router.push(`/dashboard/products/${product.id}/edit`);
  };

  // Handle delete click
  const handleDeleteClick = (product: DashboardProduct) => {
    setDeleteItem(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsDeleting(true);

      try {
        await deleteProductMutation.mutateAsync(deleteItem.id);

        toast.success("Product deleted", {
          description: `${deleteItem.name} has been successfully deleted.`,
        });

        setDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Delete failed", {
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <ProductForm isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <DataTable<DashboardProduct>
        title={`${title}(${products.length})`}
        subtitle={subtitle}
        data={products}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing products")}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["name"],
          enableDateFilter: true,
          getItemDate: (item) => item.createdAt,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
          />
        )}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete <strong>{deleteItem.name}</strong>
              ? This action cannot be undone.
              {deleteItem.isActive && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Warning:</strong> This product is currently active.
                  Please deactivate it before deletion.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this product?"
          )
        }
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
