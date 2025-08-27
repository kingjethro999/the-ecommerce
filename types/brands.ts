import { z } from "zod";

export interface NavigationBrand {
  id: string;
  title: string;
  slug: string;
}

export interface BrandsWithCategories {
  id: string;
  title: string;
  slug: string;
  categories: {
    id: string;
    image: string;
    name: string;
    slug: string;
  }[];
}

export interface BrandCategory {
  name: string;
  id: string;
  slug: string;
  image: string;
}

export interface BrandDetail {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  logo: string;
  description: string;
  categories: BrandCategory[];
}

export const BrandSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  bannerImage: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateBrandSchema = BrandSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Brand = {
  id: string;
  title: string;
  slug: string;
  bannerImage: string | null;
  logo: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BrandCreateDTO = z.infer<typeof CreateBrandSchema>;

export type BrandUpdateDTO = Partial<
  Omit<Brand, "id" | "createdAt" | "updatedAt">
>;
