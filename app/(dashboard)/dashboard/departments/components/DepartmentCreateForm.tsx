"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Building2,
  Users,
  MapPin,
  Plus,
  Image,
  Type,
  Loader2,
} from "lucide-react";
import { primaryColor } from "@/config/colors";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/hooks/useDepartments";
import {
  CreateDepartmentSchema,
  Department,
  DepartmentCreateDTO,
} from "@/types/departments";

type DepartmentFormData = DepartmentCreateDTO;

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function DepartmentForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData: Department | null;
}) {
  const [imageUrl, setImageUrl] = useState("/default-image.png");
  const [originalImageUrl, setOriginalImageUrl] =
    useState("/default-image.png");

  // Use the mutation hooks
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      title: "",
      slug: "",
      bannerImage: "",
      description: "",
      isActive: true,
    },
  });

  // Get dirty state and dirty fields from React Hook Form
  const {
    formState: { isDirty, dirtyFields },
  } = form;

  // Check if image has changed (since it's not part of the form)
  const imageChanged = imageUrl !== originalImageUrl;

  // Overall change detection: form is dirty OR image changed
  const hasChanges = isDirty || imageChanged;

  useEffect(() => {
    if (isOpen) {
      const formData = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        bannerImage: initialData?.bannerImage || "",
        description: initialData?.description || "",
        isActive: initialData?.isActive ?? true,
      };

      // Reset form with new data and mark as pristine
      form.reset(formData);

      // Set image URLs and mark original
      const imageUrlToSet = initialData?.bannerImage || "/default-image.png";
      setImageUrl(imageUrlToSet);
      setOriginalImageUrl(imageUrlToSet);
    }
  }, [initialData, isOpen, form]);

  const onSubmit: SubmitHandler<DepartmentFormData> = async (
    data: DepartmentFormData
  ) => {
    // If in edit mode and no changes, just close the modal
    if (initialData && !hasChanges) {
      onClose();
      return;
    }

    try {
      if (initialData) {
        // Update existing department - only send changed fields
        const changedData: Partial<DepartmentCreateDTO> = {};

        // Add dirty fields
        if (dirtyFields.title) changedData.title = data.title;
        if (dirtyFields.slug) changedData.slug = data.slug;
        if (dirtyFields.description)
          changedData.description = data.description || null;
        if (dirtyFields.isActive) changedData.isActive = data.isActive;

        // Add image if changed
        if (imageChanged) {
          changedData.bannerImage = imageUrl;
        }

        // If slug is not dirty but title is, auto-generate slug
        if (dirtyFields.title && !dirtyFields.slug) {
          changedData.slug = generateSlug(data.title);
        }

        // Only proceed if there are actual changes
        if (Object.keys(changedData).length === 0) {
          onClose();
          return;
        }

        console.log("Sending changed fields:", changedData);

        await updateDepartmentMutation.mutateAsync({
          id: initialData.id,
          data: changedData,
        });
      } else {
        // Create new department - send all fields
        const department: DepartmentCreateDTO = {
          title: data.title,
          slug: generateSlug(data.title) || data.slug,
          bannerImage: imageUrl || "",
          description: data.description || null,
          isActive: data.isActive,
        };

        await createDepartmentMutation.mutateAsync(department);
      }

      // Reset form and close modal
      form.reset();
      setImageUrl("/default-image.png");
      setOriginalImageUrl("/default-image.png");
      onClose();
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };

  // Get loading state from mutations
  const isLoading =
    createDepartmentMutation.isPending || updateDepartmentMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          form.reset();
          setImageUrl("/default-image.png");
          setOriginalImageUrl("/default-image.png");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader
          className={`bg-[${primaryColor}] text-white p-6 rounded-t-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5" />
                {initialData ? "Edit Department" : "Create New Department"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                {initialData
                  ? "Update the department details below"
                  : "Fill in the details below to create a new department"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Department Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        Department Title *
                        {dirtyFields.title && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter department title..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Auto-generate slug from title only if not in edit mode or slug hasn't been manually changed
                            if (!initialData || !dirtyFields.slug) {
                              const slug = generateSlug(e.target.value);
                              form.setValue("slug", slug);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    Department Banner Image
                    {imageChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Department Banner Image"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    endpoint="departmentImage"
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        Description
                        {dirtyFields.description && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the department's purpose and responsibilities... (optional)"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-16 resize-none"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional field - {field.value?.length || 0} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active Status */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          Active Department
                          {dirtyFields.isActive && (
                            <span className="text-xs text-amber-600 ml-1">
                              ●
                            </span>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Active departments are visible and can be accessed by
                          users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Show changes indicator in edit mode */}
                {initialData && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {hasChanges ? (
                      <div>
                        <span className="text-amber-600">
                          ● Unsaved changes detected
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Changed fields:{" "}
                          {[
                            ...Object.keys(dirtyFields).filter(
                              (key) =>
                                dirtyFields[key as keyof typeof dirtyFields]
                            ),
                            ...(imageChanged ? ["image"] : []),
                          ].join(", ") || "none"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-green-600">
                        ● No changes to save
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading || (!!initialData && !hasChanges)}
                    className={`flex-1 bg-[${primaryColor}] hover:bg-[${primaryColor}]/80 text-white font-semibold`}
                    isLoading={isLoading}
                    loadingText={initialData ? "Updating..." : "Creating..."}
                  >
                    {initialData
                      ? hasChanges
                        ? "Update Department"
                        : "No Changes"
                      : "Create Department"}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setImageUrl("/default-image.png");
                      setOriginalImageUrl("/default-image.png");
                      onClose();
                    }}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
