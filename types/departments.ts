import { z } from "zod";

export interface NavigationDepartment {
  id: string;
  title: string;
  slug: string;
}
export interface DepartmentsWithCategories {
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

export interface DepartmentCategory {
  name: string;
  id: string;
  slug: string;
  image: string;
}

export interface DepartmentDetail {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  description: string;
  categories: DepartmentCategory[];
}
export const DepartmentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const CreateDepartmentSchema = DepartmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type Department = {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DepartmentCreateDTO = z.infer<typeof CreateDepartmentSchema>;

export type DepartmentUpdateDTO = Partial<
  Omit<Department, "id" | "createdAt" | "updatedAt">
>;
