"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

import { Package, DollarSign, Image, Type, FileText, Star } from "lucide-react";
import { primaryColor } from "@/config/colors";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import { useCreateProduct } from "@/hooks/useProducts";
import { CreateProductSchema, ProductCreateDTO } from "@/types/item";

// Create a simplified schema for the form (only 6 most important fields)
const ProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be positive"),
  stockQty: z.number().min(0, "Stock must be positive").optional().nullable(),
  discount: z
    .number()
    .min(0)
    .max(100, "Discount must be between 0 and 100")
    .optional()
    .nullable(),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function ProductForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState("/default-image.png");

  // Use the mutation hook
  const createProductMutation = useCreateProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      summary: "",
      price: 0,
      stockQty: 0,
      discount: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      form.reset({
        name: "",
        slug: "",
        imageUrl: "",
        summary: "",
        price: 0,
        stockQty: 0,
        discount: null,
      });
      setImageUrl("/default-image.png");
    }
  }, [isOpen, form]);

  const onSubmit: SubmitHandler<ProductFormData> = async (
    data: ProductFormData
  ) => {
    try {
      // Create the full product object with all required fields
      const product: ProductFormData = {
        name: data.name,
        imageUrl: imageUrl,
        summary: data.summary || null,
        price: data.price,
        discount: data.discount || null,
        slug: data.slug,
        stockQty: data.stockQty,
      };

      await createProductMutation.mutateAsync(product);

      // Reset form and close modal
      form.reset();
      setImageUrl("/default-image.png");
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  // Get loading state from mutation
  const isLoading = createProductMutation.isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          form.reset();
          setImageUrl("/default-image.png");
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
                <Package className="h-5 w-5" />
                Create New Product
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                Fill in the essential product details below
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
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        Product Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Auto-generate slug from name
                            const slug = generateSlug(e.target.value);
                            form.setValue("slug", slug);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Image */}
                <div className="">
                  <Label className="text-gray-700 font-semibold flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    Product Image
                  </Label>
                  <ImageUploadButton
                    display="horizontal"
                    title="Product Image"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    endpoint="productImage"
                  />
                </div>

                {/* Summary */}
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Product Summary
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief product summary... (optional)"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-16 resize-none"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Brief description for product listings -{" "}
                        {field.value?.length || 0} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Price *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Enter the selling price in USD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Discount (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isLoading}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || null)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Optional discount percentage (0-100)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stockQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          Stock Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isLoading}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || null)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Optional Stock Quantity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-[${primaryColor}] hover:bg-[${primaryColor}]/80 text-white font-semibold`}
                    isLoading={isLoading}
                    loadingText="Creating..."
                  >
                    Create Product
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setImageUrl("/default-image.png");
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
