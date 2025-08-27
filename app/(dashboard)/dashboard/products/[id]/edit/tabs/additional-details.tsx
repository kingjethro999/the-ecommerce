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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/item";
import { useUpdateProduct } from "@/hooks/useProducts";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";
import { Option } from "react-tailwindcss-select/dist/components/type";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";

export function AdditionalDetailsTab({
  product,
  productOptions,
}: {
  product: Product;
  productOptions: Option[];
}) {
  return (
    <div className="grid gap-6 mt-6">
      <ProductImagesCard product={product} />
      <RelatedProductsCard productOptions={productOptions} product={product} />
      <MetadataCard product={product} />
    </div>
  );
}

// Product Images Card
function ProductImagesCard({ product }: { product: Product }) {
  const defaultImages =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [
          "/default-image.png",
          "/default-image.png",
          "/default-image.png",
          "/default-image.png",
        ];
  const [productImages, setProductImages] = useState<string[]>(defaultImages);
  const [newImage, setNewImage] = useState("");
  const updateProductMutation = useUpdateProduct();

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      const data: any = {};
      if (
        JSON.stringify(productImages) !== JSON.stringify(product.productImages)
      ) {
        data.productImages = productImages;
      }

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Images Gallery</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <div className="max-w-2xl mx-auto">
            <MultipleImageInput
              title="Product Images"
              imageUrls={productImages}
              setImageUrls={setProductImages}
              endpoint="productImages"
            />
          </div>
        </div>

        {productImages.length > 0 && (
          <div className="grid gap-3">
            <Label>Current Images ({productImages.length})</Label>
            <div className="flex flex-wrap gap-2">
              {productImages.map((image, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="truncate max-w-[200px]">{image}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeImage(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending ? "Updating..." : "Update Images"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Frequently Bought Together Card
function RelatedProductsCard({
  product,
  productOptions,
}: {
  product: Product;
  productOptions: Option[];
}) {
  const [relatedProducts, setRelatedProducts] = useState<string[]>(
    product.frequentlyBoughtTogetherItemIds || []
  );
  const matchedProducts = productOptions.filter((product) =>
    relatedProducts.includes(product.value)
  );
  const [selectedProducts, setSelectedProducts] = useState<any>(
    matchedProducts || null
  );
  const [newProductId, setNewProductId] = useState("");
  const updateProductMutation = useUpdateProduct();

  const addProductId = () => {
    if (!newProductId.trim()) {
      toast.error("Please enter a product ID");
      return;
    }
    if (relatedProducts.includes(newProductId)) {
      toast.error("Product ID already exists");
      return;
    }
    if (newProductId === product.id) {
      toast.error("Cannot add the same product as related");
      return;
    }
    setRelatedProducts([...relatedProducts, newProductId]);
    setNewProductId("");
  };

  const removeProductId = (index: number) => {
    setRelatedProducts(relatedProducts.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      console.log(selectedProducts);
      const frequentlyBoughtTogetherItemIds =
        !selectedProducts || selectedProducts.length === 0
          ? []
          : selectedProducts.map((item: Option) => item.value);
      console.log(frequentlyBoughtTogetherItemIds);
      const data: any = {};
      // if (
      //   JSON.stringify(relatedProducts) !==
      //   JSON.stringify(product.frequentlyBoughtTogetherItemIds)
      // ) {
      //   data.frequentlyBoughtTogetherItemIds = relatedProducts;
      // }

      if (frequentlyBoughtTogetherItemIds.length === 0) {
        toast.info("No changes to update");
        return;
      }
      data.frequentlyBoughtTogetherItemIds = frequentlyBoughtTogetherItemIds;
      console.log(data);
      await updateProductMutation.mutateAsync({ id: product.id, data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Bought Together</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <FormSelectInput
            label="Add Items its bought with"
            options={productOptions}
            option={selectedProducts}
            setOption={setSelectedProducts}
            isMultiple={true}
          />
          {/* <Label htmlFor="newProductId">Add Related Product ID</Label>
          <div className="flex gap-2">
            <Input
              id="newProductId"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              placeholder="Enter product ID"
              onKeyPress={(e) => e.key === "Enter" && addProductId()}
            />
            <Button type="button" onClick={addProductId} variant="outline">
              Add
            </Button>
          </div> */}
        </div>

        {relatedProducts.length > 0 && (
          <div className="grid gap-3">
            <Label>Related Products ({relatedProducts.length})</Label>
            <div className="flex flex-wrap gap-2">
              {relatedProducts.map((productId, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span>{productId}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeProductId(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdate}
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? "Updating..."
            : "Update Related Products"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Metadata & Timestamps Card
function MetadataCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Metadata</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Product ID
            </Label>
            <div className="p-2 bg-muted rounded text-sm font-mono">
              {product.id}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Current Slug
            </Label>
            <div className="p-2 bg-muted rounded text-sm">/{product.slug}</div>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Created At
            </Label>
            <div className="p-2 bg-muted rounded text-sm">
              {new Date(product.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Last Updated
            </Label>
            <div className="p-2 bg-muted rounded text-sm">
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleString()
                : "Never updated"}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Current Status
          </Label>
          <div className="flex gap-2">
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
            {product.isFeatured && <Badge variant="outline">Featured</Badge>}
            {product.isDeal && <Badge variant="destructive">Deal</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
