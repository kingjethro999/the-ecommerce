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

import { UserIcon } from "lucide-react";

import TableError from "@/components/ui/data-table/table-error";
import { useUsers } from "@/hooks/useUsers";
import { Customer, User, UserDetails } from "@/types/user";
import { useCustomers } from "@/hooks/useCustomers";

export default function DashboardCustomerListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const { customers = [], isLoading, refetch, isError, error } = useCustomers();

  // console.log(categories);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

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

  const columns: Column<Customer>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: (row) => {
        const user = row;
        const image = user.image || "/default-avatar.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={image || "/placeholder.svg"}
              alt={`${user.name} `}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "email",
      header: "Email",
      cell: (row) => {
        const user = row;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "No. Orders",
      cell: (row) => {
        const user = row;
        return (
          <div className="text-sm text-gray-600 font-mono">
            {user.orderCount}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const user = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(user.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    // setCurrentCategory(null);
    // setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredUsers: Customer[]) => {
    try {
      // Prepare data for export
      const exportData = filteredUsers.map((user) => ({
        ID: user.id,
        // CLERK_ID removed after migration
        CLERK_ID: "",
        Name: user.name,
        Image: user.image,
        "Created At": format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss"),
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
  const handleEditClick = (user: Customer) => {
    console.log(user);
  };
  const handleViewClick = (user: Customer) => {
    router.push(`/dashboard/customers/${user.id}`);
  };

  // Handle delete click
  const handleDeleteClick = (user: Customer) => {
    // setDeleteItem(category);
    // setDeleteDialogOpen(true);
    console.log(user);
  };

  const handleConfirmDelete = async () => {
    // if (deleteItem) {
    //   setIsDeleting(true);
    //   try {
    //     await deleteCategoryMutation.mutateAsync(deleteItem.id);
    //     toast.success("Category deleted", {
    //       description: `${deleteItem.name} has been successfully deleted.`,
    //     });
    //     setDeleteDialogOpen(false);
    //   } catch (error) {
    //     toast.error("Delete failed", {
    //       description:
    //         error instanceof Error ? error.message : "Unknown error occurred",
    //     });
    //   } finally {
    //     setIsDeleting(false);
    //   }
    // }
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

      {/* <CategoryForm
        initialData={currentCategory}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      /> */}

      <DataTable<Customer>
        title={`${title}(${customers.length})`}
        subtitle={subtitle}
        data={customers}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing users")}
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
            // onEdit={() => handleEditClick(item)}
            onView={() => handleViewClick(item)}
            // onDelete={() => handleDeleteClick(item)}
          />
        )}
      />

      {/* <ConfirmationDialog
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
      /> */}
    </div>
  );
}
