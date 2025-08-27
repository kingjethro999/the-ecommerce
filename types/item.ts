import { z } from "zod";

export interface NavigationProduct {
  id: string;
  name: string;
  slug: string;
}

export interface ProductsWithCategories {
  id: string;
  name: string;
  slug: string;
  categories: {
    id: string;
    image: string;
    name: string;
    slug: string;
  }[];
}

export interface ProductCategory {
  name: string;
  id: string;
  slug: string;
  image: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  price: number;
  categories: ProductCategory[];
}

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().optional().nullable(),
  productImages: z.array(z.string()).default([]),
  frequentlyBoughtTogetherItemIds: z.array(z.string()).default([]),
  description: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDeal: z.boolean().default(false),
  price: z.number().min(0, "Price must be positive"),
  buyingPrice: z
    .number()
    .min(0, "Buying price must be positive")
    .optional()
    .nullable(),
  dealPrice: z
    .number()
    .min(0, "Deal price must be positive")
    .optional()
    .nullable(),
  stockQty: z
    .number()
    .min(0, "Stock quantity must be positive")
    .optional()
    .nullable(),
  lowStockAlert: z
    .number()
    .min(0, "Low stock alert must be positive")
    .default(5)
    .optional()
    .nullable(),
  discount: z
    .number()
    .min(0)
    .max(100, "Discount must be between 0 and 100")
    .optional()
    .nullable(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true, // Auto-generated, not in form
});

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productImages: string[];
  frequentlyBoughtTogetherItemIds: string[];
  description: string | null;
  summary: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isDeal: boolean;
  price: number;
  buyingPrice: number | null;
  dealPrice: number | null;
  stockQty: number | null;
  lowStockAlert: number | null;
  discount: number | null;
  categoryId: string | null;
  brandId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type DashboardProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  discount: number;
  price: number;
  stockQty: number | null;
  lowStockAlert: number;
  createdAt: Date;
  isActive: true;
  category: {
    id: string;
    name: string;
  };
};
export type BriefItemsObject = {
  brandOptions: {
    label: string;
    value: string;
  }[];
  productOptions: {
    label: string;
    value: string;
  }[];
  categoryOptions: {
    label: string;
    value: string;
  }[];
};

export type ProductCreateDTO = z.infer<typeof CreateProductSchema>;

export type ProductUpdateDTO = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt" | "slug">
>;
