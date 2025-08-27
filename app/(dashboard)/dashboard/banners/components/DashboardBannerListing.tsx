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
import { ExternalLink, Smartphone, Monitor } from "lucide-react";
import BannerForm from "./BannerForm";
import type { Banner } from "@/types/banners";
import { useDeleteBanner, useBanners } from "@/hooks/useBanners";
import TableError from "@/components/ui/data-table/table-error";

export default function DashboardBannerListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const { banners = [], refetch, isLoading, isError, error } = useBanners();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Banner | null>(null);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteBannerMutation = useDeleteBanner();
  if (isError) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableError
          title="Failed to load banners"
          subtitle="Unable to fetch banners data"
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

  const columns: Column<Banner>[] = [
    {
      accessorKey: "title",
      header: "Banner",
      cell: (row) => {
        const banner = row;
        const image = banner.imageUrl || "/default-image.png";
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={image || "/placeholder.svg"}
                alt={banner.title}
                className="h-12 w-20 rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-image.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Monitor className="h-2 w-2" />
                </div>
                {banner.mobileImageUrl && (
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <Smartphone className="h-2 w-2" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{banner.title}</span>
              {banner.linkUrl && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate max-w-32">{banner.linkUrl}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row) => {
        const banner = row;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-2">
              {banner.description || "No description available"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "imageUrl",
      header: "Images",
      cell: (row) => {
        const banner = row;
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <Monitor className="h-3 w-3" />
              Desktop
            </div>
            {banner.mobileImageUrl && (
              <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                <Smartphone className="h-3 w-3" />
                Mobile
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const banner = row;
        return (
          <Badge variant={banner.isActive ? "default" : "secondary"}>
            {banner.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created",
    //   cell: (row) => {
    //     const banner = row;
    //     return (
    //       <div className="text-sm text-gray-600">
    //         {format(new Date(banner.createdAt), "MMM d, yyyy")}
    //       </div>
    //     );
    //   },
    // },
  ];

  const handleAddNew = () => {
    setCurrentBanner(null);
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredBanners: Banner[]) => {
    try {
      // Prepare data for export
      const exportData = filteredBanners.map((banner) => ({
        ID: banner.id,
        Title: banner.title,
        Description: banner.description || "No description",
        "Desktop Image": banner.imageUrl,
        "Mobile Image": banner.mobileImageUrl || "Not provided",
        "Link URL": banner.linkUrl || "No link",
        Status: banner.isActive ? "Active" : "Inactive",
        "Created At": format(new Date(banner.createdAt), "yyyy-MM-dd HH:mm:ss"),
        "Updated At": format(new Date(banner.updatedAt), "yyyy-MM-dd HH:mm:ss"),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Banners");

      // Generate filename with current date
      const fileName = `Banners_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Banners exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (banner: Banner) => {
    setCurrentBanner(banner);
    setModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (banner: Banner) => {
    setDeleteItem(banner);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsDeleting(true);
      try {
        await deleteBannerMutation.mutateAsync(deleteItem.id);
        toast.success("Banner deleted", {
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

  if (isError) {
    return (
      <TableError
        title="Failed to load banners"
        subtitle="Unable to fetch banner data"
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="container mx-auto py-6">
      <BannerForm
        initialData={currentBanner}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <DataTable<Banner>
        title={`${title}(${banners.length})`}
        subtitle={subtitle}
        data={banners}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing banners")}
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
        title="Delete Banner"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete{" "}
              <strong>{deleteItem.title}</strong>? This action cannot be undone.
              {deleteItem.isActive && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Warning:</strong> This banner is currently active and
                  visible to users.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this banner?"
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
