"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  type Column,
  ConfirmationDialog,
  DataTable,
  TableActions,
  TableLoading,
} from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/types/brands";
import { useDeleteBrand, useBrands } from "@/hooks/useBrands";
import TableError from "@/components/ui/data-table/table-error";
import BrandForm from "./BrandForm";

export default function BrandListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const { brands = [], refetch, isError, error, isLoading } = useBrands();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Brand | null>(null);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteBrandMutation = useDeleteBrand();

  if (isError) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableError
          title="Failed to load brands"
          subtitle="Unable to fetch brands data"
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableLoading />
      </div>
    );
  }

  const columns: Column<Brand>[] = [
    {
      accessorKey: "title",
      header: "Brand",
      cell: (row) => {
        const brand = row;
        const logo = brand.logo || "/default-image.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={logo || "/default-image.png"}
              alt={brand.title}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-image.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{brand.title}</span>
              <span className="text-sm text-gray-500">/{brand.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row) => {
        const brand = row;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-2">
              {brand.description || "No description available"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const brand = row;
        return (
          <Badge variant={brand.isActive ? "default" : "secondary"}>
            {brand.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const brand = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(brand.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    setCurrentBrand(null);
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredBrands: Brand[]) => {
    try {
      // Prepare data for export
      const exportData = filteredBrands.map((brand) => ({
        ID: brand.id,
        Title: brand.title,
        Slug: brand.slug,
        Description: brand.description || "No description",
        Status: brand.isActive ? "Active" : "Inactive",
        "Banner Image": brand.bannerImage,
        Logo: brand.logo,
        "Created At": format(new Date(brand.createdAt), "yyyy-MM-dd HH:mm:ss"),
        "Updated At": format(new Date(brand.updatedAt), "yyyy-MM-dd HH:mm:ss"),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");

      // Generate filename with current date
      const fileName = `Brands_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);
      toast.success("Export successful", {
        description: `Brands exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (brand: Brand) => {
    setCurrentBrand(brand);
    setModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (brand: Brand) => {
    setDeleteItem(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsDeleting(true);
      try {
        await deleteBrandMutation.mutateAsync(deleteItem.id);
        toast.success("Brand deleted", {
          description: `${deleteItem.title} has been successfully deleted.`,
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
      {isError ? (
        <TableError
          title="Failed to load brands"
          subtitle="Unable to fetch brand data"
          error={error}
          onRetry={refetch}
        />
      ) : (
        <>
          <BrandForm
            initialData={currentBrand}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
          <DataTable<Brand>
            title={`${title}(${brands.length})`}
            subtitle={subtitle}
            data={brands}
            columns={columns}
            keyField="id"
            isLoading={false}
            onRefresh={() => refetch()}
            actions={{
              onAdd: handleAddNew,
              onExport: handleExport,
            }}
            filters={{
              searchFields: ["title"],
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
        </>
      )}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Brand"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete{" "}
              <strong>{deleteItem.title}</strong>? This action cannot be undone.
              {deleteItem.isActive && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Warning:</strong> This brand is currently active.
                  Please deactivate it before deletion.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this brand?"
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
