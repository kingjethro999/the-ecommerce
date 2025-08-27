"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Tag, Type, Building2 } from "lucide-react";
import { primaryColor } from "@/config/colors";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useDepartments } from "@/hooks/useDepartments";
import {
  CreateCategorySchema,
  type Category,
  type CategoryCreateDTO,
  type DepartmentOption,
} from "@/types/categories";

type CategoryFormData = CategoryCreateDTO;

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function CategoryForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData: Category | null;
}) {
  const [imageUrl, setImageUrl] = useState("/default-image.png");
  const [originalImageUrl, setOriginalImageUrl] =
    useState("/default-image.png");
  const [bannerImageUrl, setBannerImageUrl] = useState("/default-image.png");
  const [originalBannerImageUrl, setOriginalBannerImageUrl] =
    useState("/default-image.png");

  // Get departments for the select dropdown
  const { departments } = useDepartments();

  // Memoize department options to prevent re-computation on every render
  const departmentOptions: DepartmentOption[] = useMemo(() => {
    return (
      departments?.map((dept) => ({
        value: dept.id,
        label: dept.title,
      })) || []
    );
  }, [departments]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  // Use the mutation hooks
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
      bannerImage: "",
      description: "",
      isActive: true,
      departmentId: "",
    },
  });

  // Get dirty state and dirty fields from React Hook Form
  const {
    formState: { isDirty, dirtyFields },
  } = form;

  // Check if images have changed
  const imageChanged = imageUrl !== originalImageUrl;
  const bannerImageChanged = bannerImageUrl !== originalBannerImageUrl;
  const departmentChanged =
    selectedDepartment?.value !== initialData?.departmentId;

  // Overall change detection
  const hasChanges =
    isDirty || imageChanged || bannerImageChanged || departmentChanged;

  // Reset form when modal opens - use useCallback to prevent unnecessary re-renders
  const resetForm = useCallback(() => {
    if (isOpen) {
      const formData = {
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        image: initialData?.image || "",
        bannerImage: initialData?.bannerImage || "",
        description: initialData?.description || "",
        isActive: initialData?.isActive ?? true,
        departmentId: initialData?.departmentId || "",
      };

      // Reset form with new data and mark as pristine
      form.reset(formData);

      // Set image URLs and mark original
      const imageUrlToSet = initialData?.image || "/default-image.png";
      const bannerImageUrlToSet =
        initialData?.bannerImage || "/default-image.png";
      setImageUrl(imageUrlToSet);
      setOriginalImageUrl(imageUrlToSet);
      setBannerImageUrl(bannerImageUrlToSet);
      setOriginalBannerImageUrl(bannerImageUrlToSet);

      // Set selected department - find from options only when they're available
      if (departmentOptions.length > 0) {
        const initialDept = departmentOptions.find(
          (item) => item.value === initialData?.departmentId
        );
        setSelectedDepartment(initialDept || null);
      }
    }
  }, [isOpen, initialData, form, departmentOptions]);

  // Separate useEffect for form reset to prevent infinite loops
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Handle title change with debouncing to prevent excessive slug generation
  const handleTitleChange = useCallback(
    (value: string) => {
      // Auto-generate slug from name only if not in edit mode or slug hasn't been manually changed
      if (!initialData || !dirtyFields.slug) {
        const slug = generateSlug(value);
        form.setValue("slug", slug, { shouldDirty: false }); // Don't mark as dirty for auto-generated slug
      }
    },
    [initialData, dirtyFields.slug, form]
  );

  const onSubmit: SubmitHandler<CategoryFormData> = async (
    data: CategoryFormData
  ) => {
    // If in edit mode and no changes, just close the modal
    if (initialData && !hasChanges) {
      onClose();
      return;
    }

    // Validate department selection
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    try {
      if (initialData) {
        // Update existing category - only send changed fields
        const changedData: Partial<CategoryCreateDTO> = {};

        // Add dirty fields
        if (dirtyFields.name) changedData.name = data.name;
        if (dirtyFields.slug) changedData.slug = data.slug;
        if (dirtyFields.description)
          changedData.description = data.description || null;
        if (dirtyFields.isActive) changedData.isActive = data.isActive;

        // Add images if changed
        if (imageChanged) changedData.image = imageUrl;
        if (bannerImageChanged) changedData.bannerImage = bannerImageUrl;

        // Add department if changed
        if (departmentChanged)
          changedData.departmentId = selectedDepartment.value;

        // If slug is not dirty but name is, auto-generate slug
        if (dirtyFields.name && !dirtyFields.slug) {
          changedData.slug = generateSlug(data.name);
        }

        // Only proceed if there are actual changes
        if (Object.keys(changedData).length === 0) {
          onClose();
          return;
        }

        console.log("Sending changed fields:", changedData);
        await updateCategoryMutation.mutateAsync({
          id: initialData.id,
          data: changedData,
        });
      } else {
        // Create new category - send all fields
        const category: CategoryCreateDTO = {
          name: data.name,
          slug: generateSlug(data.name) || data.slug,
          image: imageUrl || "",
          bannerImage: bannerImageUrl || "",
          description: data.description || null,
          isActive: data.isActive,
          departmentId: selectedDepartment.value,
        };
        await createCategoryMutation.mutateAsync(category);
      }

      // Reset form and close modal
      handleFormReset();
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Separate function to handle form reset
  const handleFormReset = useCallback(() => {
    form.reset();
    setImageUrl("/default-image.png");
    setOriginalImageUrl("/default-image.png");
    setBannerImageUrl("/default-image.png");
    setOriginalBannerImageUrl("/default-image.png");
    setSelectedDepartment(null);
  }, [form]);

  // Get loading state from mutations
  const isLoading =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          handleFormReset();
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
                <Tag className="h-5 w-5" />
                {initialData ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                {initialData
                  ? "Update the category details below"
                  : "Fill in the details below to create a new category"}
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
                {/* Category Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        Category Name *
                        {dirtyFields.name && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category name..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleTitleChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Department *
                    {departmentChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <FormSelectInput
                    label=""
                    options={departmentOptions}
                    option={selectedDepartment}
                    setOption={setSelectedDepartment}
                    toolTipText="Add New Department"
                    href="/dashboard/departments"
                  />
                </div>

                {/* Category Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    Category Image *
                    {imageChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Category Image"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    endpoint="categoryImage"
                  />
                </div>

                {/* Banner Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    Banner Image
                    {bannerImageChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Banner Image"
                    imageUrl={bannerImageUrl}
                    setImageUrl={setBannerImageUrl}
                    endpoint="categoryImage"
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
                          placeholder="Describe the category... (optional)"
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
                          Active Category
                          {dirtyFields.isActive && (
                            <span className="text-xs text-amber-600 ml-1">
                              ●
                            </span>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Active categories are visible and can be accessed by
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
                            ...(bannerImageChanged ? ["bannerImage"] : []),
                            ...(departmentChanged ? ["department"] : []),
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
                        ? "Update Category"
                        : "No Changes"
                      : "Create Category"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleFormReset}
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
