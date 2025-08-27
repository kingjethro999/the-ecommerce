import { z } from "zod";
import { CategoryProduct, SimilarCategory } from "./category";

export interface NavigationCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CategoriesWithProducts {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: {
    id: string;
    name: string;
    slug: string;
    image: string;
  }[];
}

// export interface CategoryProduct {
//   id: string;
//   name: string;
//   slug: string;
//   imageUrl: string;
//   price: number;
//   discount: number | null;
// }

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  description: string;
  departmentId: string;
  department: {
    id: string;
    title: string;
    slug: string;
  };
  similarCategories: SimilarCategory[];
  products: CategoryProduct[];
}

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  image: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
  departmentId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string | null;
  description: string | null;
  isActive: boolean;
  departmentId: string;
  department?: {
    id: string;
    title: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date | null;
};

export type CategoryCreateDTO = z.infer<typeof CreateCategorySchema>;
export type CategoryUpdateDTO = Partial<
  Omit<Category, "id" | "createdAt" | "updatedAt" | "department">
>;

// Department option type for form select
export interface DepartmentOption {
  value: string;
  label: string;
}
