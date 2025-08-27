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

import { Tag, Image, Type, Loader2 } from "lucide-react";
import { primaryColor } from "@/config/colors";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrands";
import { CreateBrandSchema, Brand, BrandCreateDTO } from "@/types/brands";

type BrandFormData = BrandCreateDTO;

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function BrandForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData: Brand | null;
}) {
  const [bannerImageUrl, setBannerImageUrl] = useState("/default-image.png");
  const [logoUrl, setLogoUrl] = useState("/default-image.png");
  const [originalBannerImageUrl, setOriginalBannerImageUrl] =
    useState("/default-image.png");
  const [originalLogoUrl, setOriginalLogoUrl] = useState("/default-image.png");

  // Use the mutation hooks
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(CreateBrandSchema),
    defaultValues: {
      title: "",
      slug: "",
      bannerImage: "",
      logo: "",
      description: "",
      isActive: true,
    },
  });

  // Get dirty state and dirty fields from React Hook Form
  const {
    formState: { isDirty, dirtyFields },
  } = form;

  // Check if images have changed (since they're not part of the form)
  const bannerImageChanged = bannerImageUrl !== originalBannerImageUrl;
  const logoChanged = logoUrl !== originalLogoUrl;

  // Overall change detection: form is dirty OR images changed
  const hasChanges = isDirty || bannerImageChanged || logoChanged;

  useEffect(() => {
    if (isOpen) {
      const formData = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        bannerImage: initialData?.bannerImage || "",
        logo: initialData?.logo || "",
        description: initialData?.description || "",
        isActive: initialData?.isActive ?? true,
      };

      // Reset form with new data and mark as pristine
      form.reset(formData);

      // Set image URLs and mark original
      const bannerUrlToSet = initialData?.bannerImage || "/default-image.png";
      const logoUrlToSet = initialData?.logo || "/default-image.png";

      setBannerImageUrl(bannerUrlToSet);
      setLogoUrl(logoUrlToSet);
      setOriginalBannerImageUrl(bannerUrlToSet);
      setOriginalLogoUrl(logoUrlToSet);
    }
  }, [initialData, isOpen, form]);

  const onSubmit: SubmitHandler<BrandFormData> = async (
    data: BrandFormData
  ) => {
    // If in edit mode and no changes, just close the modal
    if (initialData && !hasChanges) {
      onClose();
      return;
    }

    try {
      if (initialData) {
        // Update existing brand - only send changed fields
        const changedData: Partial<BrandCreateDTO> = {};

        // Add dirty fields
        if (dirtyFields.title) changedData.title = data.title;
        if (dirtyFields.slug) changedData.slug = data.slug;
        if (dirtyFields.description)
          changedData.description = data.description || null;
        if (dirtyFields.isActive) changedData.isActive = data.isActive;

        // Add images if changed
        if (bannerImageChanged) {
          changedData.bannerImage = bannerImageUrl;
        }
        if (logoChanged) {
          changedData.logo = logoUrl;
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

        await updateBrandMutation.mutateAsync({
          id: initialData.id,
          data: changedData,
        });
      } else {
        // Create new brand - send all fields
        const brand: BrandCreateDTO = {
          title: data.title,
          slug: generateSlug(data.title) || data.slug,
          bannerImage: bannerImageUrl || "",
          logo: logoUrl || "",
          description: data.description || null,
          isActive: data.isActive,
        };

        await createBrandMutation.mutateAsync(brand);
      }

      // Reset form and close modal
      form.reset();
      setBannerImageUrl("/default-image.png");
      setLogoUrl("/default-image.png");
      setOriginalBannerImageUrl("/default-image.png");
      setOriginalLogoUrl("/default-image.png");
      onClose();
    } catch (error) {
      console.error("Failed to save brand:", error);
    }
  };

  // Get loading state from mutations
  const isLoading =
    createBrandMutation.isPending || updateBrandMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          form.reset();
          setBannerImageUrl("/default-image.png");
          setLogoUrl("/default-image.png");
          setOriginalBannerImageUrl("/default-image.png");
          setOriginalLogoUrl("/default-image.png");
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
                {initialData ? "Edit Brand" : "Create New Brand"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                {initialData
                  ? "Update the brand details below"
                  : "Fill in the details below to create a new brand"}
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
                {/* Brand Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        Brand Title *
                        {dirtyFields.title && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter brand title..."
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

                {/* Logo and Banner Images in a Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo */}
                  <div>
                    <Label className="text-gray-700 font-semibold flex items-center gap-1">
                      Brand Logo
                      {logoChanged && (
                        <span className="text-xs text-amber-600 ml-1">●</span>
                      )}
                    </Label>
                    <ImageUploadButton
                      display="vertical"
                      title="Brand Logo"
                      imageUrl={logoUrl}
                      setImageUrl={setLogoUrl}
                      endpoint="brandLogo"
                    />
                  </div>

                  {/* Banner Image */}
                  <div>
                    <Label className="text-gray-700 font-semibold flex items-center gap-1">
                      Banner Image
                      {bannerImageChanged && (
                        <span className="text-xs text-amber-600 ml-1">●</span>
                      )}
                    </Label>
                    <ImageUploadButton
                      display="vertical"
                      title="Banner Image"
                      imageUrl={bannerImageUrl}
                      setImageUrl={setBannerImageUrl}
                      endpoint="brandLogo"
                    />
                  </div>
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
                          placeholder="Describe the brand's identity and values... (optional)"
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
                          Active Brand
                          {dirtyFields.isActive && (
                            <span className="text-xs text-amber-600 ml-1">
                              ●
                            </span>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Active brands are visible and can be accessed by users
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
                            ...(bannerImageChanged ? ["banner"] : []),
                            ...(logoChanged ? ["logo"] : []),
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
                        ? "Update Brand"
                        : "No Changes"
                      : "Create Brand"}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setBannerImageUrl("/default-image.png");
                      setLogoUrl("/default-image.png");
                      setOriginalBannerImageUrl("/default-image.png");
                      setOriginalLogoUrl("/default-image.png");
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
