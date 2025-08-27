export interface DealProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  summary: string;
  imageUrl: string;
  stockQty: number;
}
export interface ProductBrief {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  discount: number;
}
export interface DetailProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  summary: string;
  description: string;
  imageUrl: string;
  productImages: string[];
  stockQty: number;
  similarProducts: SimilarProduct[];
  frequentlyBoughtTogether: FrequentlyBoughtTogether[];
}
export interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  slug: string;
  discount: number;
  imageUrl: string;
}

export interface FrequentlyBoughtTogether {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}
