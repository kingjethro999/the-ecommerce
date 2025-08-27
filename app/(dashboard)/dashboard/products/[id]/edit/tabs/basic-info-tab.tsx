"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Product } from "@/types/item";
import { useUpdateProduct } from "@/hooks/useProducts";
// import { Option } from "../product-update-form";
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import { Option } from "react-tailwindcss-select/dist/components/type";

export function BasicInfoTab({
  product,
  brandOptions,
  categoryOptions,
}: {
  product: Product;
  categoryOptions: Option[];
  brandOptions: Option[];
}) {
  return (
    <div className="grid gap-6 mt-6">
      <NameSlugCard product={product} />
      <ImageSummaryCard product={product} />
      <DescriptionStatusCard product={product} />
      <CategoryBrandCard
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        product={product}
      />
    </div>
  );
}

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Name & Slug Card
function NameSlugCard({ product }: { product: Product }) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      // Only send changed fields
      const data: any = {};
      if (name !== product.name) data.name = name;
      if (slug !== product.slug) data.slug = slug;

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Name & Slug</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // Auto-generate slug when name changes
              setSlug(generateSlug(e.target.value));
            }}
            placeholder="Product name"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="slug">Product Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="product-slug"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Name & Slug"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Image & Summary Card
function ImageSummaryCard({ product }: { product: Product }) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [summary, setSummary] = useState(product.summary || "");
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      const data: any = {};
      if (imageUrl !== (product.imageUrl || ""))
        data.imageUrl = imageUrl || null;
      if (summary !== (product.summary || "")) data.summary = summary || null;

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image & Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label>Product Image</Label>
          <ImageUploadButton
            display="horizontal"
            title="Product Image"
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            endpoint="productImage"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="summary">Product Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief product summary..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Image & Summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Description & Status Card
function DescriptionStatusCard({ product }: { product: Product }) {
  const [description, setDescription] = useState(product.description || "");
  const [isActive, setIsActive] = useState(product.isActive);
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      const data: any = {};
      if (description !== (product.description || ""))
        data.description = description || null;
      if (isActive !== product.isActive) data.isActive = isActive;

      if (Object.keys(data).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description & Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed product description..."
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="cursor-pointer">
            Active Product
          </Label>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Description & Status"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Category & Brand Card
function CategoryBrandCard({
  product,
  brandOptions,
  categoryOptions,
}: {
  product: Product;
  categoryOptions: Option[];
  brandOptions: Option[];
}) {
  // console.log(categoryOptions);
  const initialCategoryId = product?.categoryId || "";
  const initialCategory = categoryOptions.find(
    (item) => item.value === initialCategoryId
  );
  const initialBrandId = product?.brandId || "";
  const initialBrand = brandOptions.find(
    (item) => item.value === initialBrandId
  );
  const [selectedCategory, setSelectedCategory] = useState<any>(
    initialCategory || null
  );
  const [selectedBrand, setSelectedBrand] = useState<any>(initialBrand || null);

  // console.log(categoryOptions, brandOptions);
  const updateProductMutation = useUpdateProduct();

  const handleUpdate = async () => {
    try {
      if (!selectedCategory?.value || !selectedBrand.value) {
        toast.info("No changes to update");
        return;
      }
      const data: any = {};
      if (selectedCategory?.value !== (product.categoryId || ""))
        data.categoryId = selectedCategory?.value || null;
      if (selectedBrand?.value !== (product.brandId || ""))
        data.brandId = selectedBrand?.value || null;
      console.log(data);

      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category & Brand</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <FormSelectInput
          label="Brands"
          options={brandOptions}
          option={selectedBrand}
          setOption={setSelectedBrand}
          toolTipText="Add New Brand"
          href="/dashboard/brands"
        />
        <FormSelectInput
          label="Categories"
          options={categoryOptions}
          option={selectedCategory}
          setOption={setSelectedCategory}
          toolTipText="Add New Category"
          href="/dashboard/categories"
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={
            updateProductMutation.isPending ||
            !selectedCategory?.value ||
            !selectedBrand.value
          }
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Category & Brand"}
        </Button>
      </CardFooter>
    </Card>
  );
}
