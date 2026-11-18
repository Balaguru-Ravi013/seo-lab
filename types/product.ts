export type Currency = "INR";

export type Availability = "InStock" | "OutOfStock" | "PreOrder";

export type ProductCategory =
  | "Road"
  | "Trail"
  | "Racing"
  | "Daily Trainer"
  | "Stability";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  currency: Currency;
  category: ProductCategory;
  color: string;
  sizes: string[];
  material: string;
  availability: Availability;
  shortDescription: string;
  description: string;
  highlights: string[];
  specifications: ProductSpec[];
  images: ProductImage[];
  relatedSlugs: string[];
}

export type ProductSort = "price-asc" | "price-desc" | "name-asc";

export interface ProductFilters {
  brand?: string;
  category?: ProductCategory;
  sort?: ProductSort;
}
