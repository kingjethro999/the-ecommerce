"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ImageIcon, Type, Link, Smartphone } from "lucide-react";
import { primaryColor } from "@/config/colors";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import { useCreateBanner, useUpdateBanner } from "@/hooks/useBanners";
import {
  CreateBannerSchema,
  type Banner,
  type BannerCreateDTO,
} from "@/types/banners";

type BannerFormData = BannerCreateDTO;

export default function BannerForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData: Banner | null;
}) {
  const [desktopImageUrl, setDesktopImageUrl] = useState("/default-image.png");
  const [originalDesktopImageUrl, setOriginalDesktopImageUrl] =
    useState("/default-image.png");
  const [mobileImageUrl, setMobileImageUrl] = useState("/default-image.png");
  const [originalMobileImageUrl, setOriginalMobileImageUrl] =
    useState("/default-image.png");

  // Use the mutation hooks
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();

  const form = useForm<BannerFormData>({
    resolver: zodResolver(CreateBannerSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      mobileImageUrl: "",
      linkUrl: "",
      isActive: true,
    },
  });

  // Get dirty state and dirty fields from React Hook Form
  const {
    formState: { isDirty, dirtyFields },
  } = form;

  // Check if images have changed
  const desktopImageChanged = desktopImageUrl !== originalDesktopImageUrl;
  const mobileImageChanged = mobileImageUrl !== originalMobileImageUrl;

  // Overall change detection
  const hasChanges = isDirty || desktopImageChanged || mobileImageChanged;

  useEffect(() => {
    if (isOpen) {
      const formData = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
        mobileImageUrl: initialData?.mobileImageUrl || "",
        linkUrl: initialData?.linkUrl || "",
        isActive: initialData?.isActive ?? true,
      };

      // Reset form with new data and mark as pristine
      form.reset(formData);

      // Set image URLs and mark original
      const desktopImageUrlToSet =
        initialData?.imageUrl || "/default-image.png";
      const mobileImageUrlToSet =
        initialData?.mobileImageUrl || "/default-image.png";
      setDesktopImageUrl(desktopImageUrlToSet);
      setOriginalDesktopImageUrl(desktopImageUrlToSet);
      setMobileImageUrl(mobileImageUrlToSet);
      setOriginalMobileImageUrl(mobileImageUrlToSet);
    }
  }, [initialData, isOpen, form]);

  const onSubmit: SubmitHandler<BannerFormData> = async (
    data: BannerFormData
  ) => {
    // If in edit mode and no changes, just close the modal
    if (initialData && !hasChanges) {
      onClose();
      return;
    }

    try {
      if (initialData) {
        // Update existing banner - only send changed fields
        const changedData: Partial<BannerCreateDTO> = {};

        // Add dirty fields
        if (dirtyFields.title) changedData.title = data.title;
        if (dirtyFields.description)
          changedData.description = data.description || null;
        if (dirtyFields.linkUrl) changedData.linkUrl = data.linkUrl || null;
        if (dirtyFields.isActive) changedData.isActive = data.isActive;

        // Add images if changed
        if (desktopImageChanged) {
          changedData.imageUrl = desktopImageUrl;
        }
        if (mobileImageChanged) {
          changedData.mobileImageUrl = mobileImageUrl || null;
        }

        // Only proceed if there are actual changes
        if (Object.keys(changedData).length === 0) {
          onClose();
          return;
        }

        console.log("Sending changed fields:", changedData);
        await updateBannerMutation.mutateAsync({
          id: initialData.id,
          data: changedData,
        });
      } else {
        // Create new banner - send all fields
        const banner: BannerCreateDTO = {
          title: data.title,
          description: data.description || null,
          imageUrl: desktopImageUrl || "",
          mobileImageUrl: mobileImageUrl || null,
          linkUrl: data.linkUrl || null,
          isActive: data.isActive,
        };
        await createBannerMutation.mutateAsync(banner);
      }

      // Reset form and close modal
      form.reset();
      setDesktopImageUrl("/default-image.png");
      setOriginalDesktopImageUrl("/default-image.png");
      setMobileImageUrl("/default-image.png");
      setOriginalMobileImageUrl("/default-image.png");
      onClose();
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  // Get loading state from mutations
  const isLoading =
    createBannerMutation.isPending || updateBannerMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          form.reset();
          setDesktopImageUrl("/default-image.png");
          setOriginalDesktopImageUrl("/default-image.png");
          setMobileImageUrl("/default-image.png");
          setOriginalMobileImageUrl("/default-image.png");
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
                <ImageIcon className="h-5 w-5" />
                {initialData ? "Edit Banner" : "Create New Banner"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                {initialData
                  ? "Update the banner details below"
                  : "Fill in the details below to create a new banner"}
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
                {/* Banner Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        Banner Title *
                        {dirtyFields.title && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter banner title..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Desktop Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    Desktop Image *
                    {desktopImageChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Desktop Banner Image"
                    imageUrl={desktopImageUrl}
                    setImageUrl={setDesktopImageUrl}
                    endpoint="bannerImage"
                  />
                </div>

                {/* Mobile Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    <Smartphone className="h-4 w-4" />
                    Mobile Image (Optional)
                    {mobileImageChanged && (
                      <span className="text-xs text-amber-600 ml-1">●</span>
                    )}
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Mobile Banner Image"
                    imageUrl={mobileImageUrl}
                    setImageUrl={setMobileImageUrl}
                    endpoint="bannerImage"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Upload a separate image optimized for mobile
                    devices
                  </p>
                </div>

                {/* Link URL */}
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Link className="h-4 w-4" />
                        Link URL (Optional)
                        {dirtyFields.linkUrl && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com (optional)"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional: URL to redirect when banner is clicked
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        Description (Optional)
                        {dirtyFields.description && (
                          <span className="text-xs text-amber-600 ml-1">●</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the banner purpose... (optional)"
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
                          Active Banner
                          {dirtyFields.isActive && (
                            <span className="text-xs text-amber-600 ml-1">
                              ●
                            </span>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Active banners are visible to users on the website
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
                            ...(desktopImageChanged ? ["desktopImage"] : []),
                            ...(mobileImageChanged ? ["mobileImage"] : []),
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
                        ? "Update Banner"
                        : "No Changes"
                      : "Create Banner"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setDesktopImageUrl("/default-image.png");
                      setOriginalDesktopImageUrl("/default-image.png");
                      setMobileImageUrl("/default-image.png");
                      setOriginalMobileImageUrl("/default-image.png");
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
