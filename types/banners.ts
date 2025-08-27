export interface HomeBanner {
  id: string;
  title: string;
  linkUrl: string;
  imageUrl: string;
  mobileImageUrl: string;
}

import { z } from "zod";

export interface NavigationBanner {
  id: string;
  title: string;
  imageUrl: string;
}

export interface BannerDetail {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const BannerSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateBannerSchema = BannerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Banner = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerCreateDTO = z.infer<typeof CreateBannerSchema>;
export type BannerUpdateDTO = Partial<
  Omit<Banner, "id" | "createdAt" | "updatedAt">
>;
