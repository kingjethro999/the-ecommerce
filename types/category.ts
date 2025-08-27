export interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  discount: number;
}
export interface SimilarCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}
export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  description: string;
  departmentId: string;
  similarCategories: SimilarCategory[];
  products: CategoryProduct[];
}
