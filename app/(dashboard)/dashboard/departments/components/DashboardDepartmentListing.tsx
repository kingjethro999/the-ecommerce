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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, Users } from "lucide-react";
import DepartmentForm from "./DepartmentCreateForm";
import { Department } from "@/types/departments";
import { useQuery } from "@tanstack/react-query";
import { useDeleteDepartment, useDepartments } from "@/hooks/useDepartments";
import TableError from "@/components/ui/data-table/table-error";

export default function DashboardDepartmentListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const {
    departments = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useDepartments();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Department | null>(null);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  console.log(deleteItem);
  const deleteDepartmentMutation = useDeleteDepartment();

  if (isError) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableError
          title="Failed to load departments"
          subtitle="Unable to fetch department data"
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

  const columns: Column<Department>[] = [
    {
      accessorKey: "title",
      header: "Department",
      cell: (row) => {
        const department = row;
        const image = department.bannerImage || "/default-image.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt={department.title}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-image.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{department.title}</span>
              <span className="text-sm text-gray-500">/{department.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row) => {
        const department = row;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-2">
              {department.description || "No description available"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const department = row;
        return (
          <Badge variant={department.isActive ? "default" : "secondary"}>
            {department.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const department = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(department.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    setCurrentDepartment(null);
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredDepartments: Department[]) => {
    try {
      // Prepare data for export
      const exportData = filteredDepartments.map((department) => ({
        ID: department.id,
        Title: department.title,
        Slug: department.slug,
        Description: department.description || "No description",
        Status: department.isActive ? "Active" : "Inactive",
        "Banner Image": department.bannerImage,
        "Created At": format(
          new Date(department.createdAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
        "Updated At": format(
          new Date(department.updatedAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");

      // Generate filename with current date
      const fileName = `Departments_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Departments exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (department: Department) => {
    // router.push(`/dashboard/departments/${department.id}/edit`);
    setCurrentDepartment(department);
    setModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (department: Department) => {
    setDeleteItem(department);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsDeleting(true);

      // Check if department is active before allowing deletion
      // if (deleteItem.isActive) {
      //   toast.error("Delete Failed", {
      //     description:
      //       "Cannot delete an active department. Please deactivate it first.",
      //   });
      //   setDeleteDialogOpen(false);
      //   setIsDeleting(false);
      //   return;
      // }

      try {
        await deleteDepartmentMutation.mutateAsync(deleteItem.id);

        toast.success("Department deleted", {
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
      <DepartmentForm
        initialData={currentDepartment}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <DataTable<Department>
        title={`${title}(${departments.length})`}
        subtitle={subtitle}
        data={departments}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing departments")}
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

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Department"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete{" "}
              <strong>{deleteItem.title}</strong>? This action cannot be undone.
              {deleteItem.isActive && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Warning:</strong> This department is currently active.
                  Please deactivate it before deletion.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this department?"
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
