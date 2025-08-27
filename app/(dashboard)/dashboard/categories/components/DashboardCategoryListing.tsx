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
import { Building2 } from "lucide-react";
import CategoryForm from "./CategoryForm";
import type { Category } from "@/types/categories";
import { useDeleteCategory, useCategories } from "@/hooks/useCategories";
import TableError from "@/components/ui/data-table/table-error";

export default function DashboardCategoryListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const {
    categories = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useCategories();

  // console.log(categories);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteCategoryMutation = useDeleteCategory();

  if (isError) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableError
          title="Failed to load categories"
          subtitle="Unable to fetch categories data"
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

  const columns: Column<Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: (row) => {
        const category = row;
        const image = category.image || "/default-image.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={image || "/placeholder.svg"}
              alt={category.name}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-image.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{category.name}</span>
              <span className="text-sm text-gray-500">/{category.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (row) => {
        const category = row;
        return (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {category.department?.title || "No Department"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row) => {
        const category = row;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-2">
              {category.description || "No description available"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const category = row;
        return (
          <Badge variant={category.isActive ? "default" : "secondary"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const category = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(category.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    setCurrentCategory(null);
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredCategories: Category[]) => {
    try {
      // Prepare data for export
      const exportData = filteredCategories.map((category) => ({
        ID: category.id,
        Name: category.name,
        Slug: category.slug,
        Department: category.department?.title || "No Department",
        Description: category.description || "No description",
        Status: category.isActive ? "Active" : "Inactive",
        Image: category.image,
        "Banner Image": category.bannerImage,
        "Created At": format(
          new Date(category.createdAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
        "Updated At": category.updatedAt
          ? format(new Date(category.updatedAt), "yyyy-MM-dd HH:mm:ss")
          : "Never",
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

      // Generate filename with current date
      const fileName = `Categories_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Categories exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (category: Category) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (category: Category) => {
    setDeleteItem(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsDeleting(true);
      try {
        await deleteCategoryMutation.mutateAsync(deleteItem.id);
        toast.success("Category deleted", {
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
      {isError && (
        <TableError
          title="Failed to load categories"
          subtitle="Unable to fetch category data"
          error={error}
          onRetry={refetch}
        />
      )}

      <CategoryForm
        initialData={currentCategory}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <DataTable<Category>
        title={`${title}(${categories.length})`}
        subtitle={subtitle}
        data={categories}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing categories")}
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
        title="Delete Category"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete <strong>{deleteItem.name}</strong>
              ? This action cannot be undone.
              {deleteItem.isActive && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Warning:</strong> This category is currently active.
                  Please deactivate it before deletion.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this category?"
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
