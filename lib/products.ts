import { products } from "@/data/products";
import type {
  Product,
  ProductCategory,
  ProductFilters,
  ProductSort,
} from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.availability === "InStock").slice(0, limit);
}

export function getRelatedProducts(slug: string): Product[] {
  const product = getProductBySlug(slug);
  if (!product) {
    return [];
  }

  return product.relatedSlugs
    .map((relatedSlug) => getProductBySlug(relatedSlug))
    .filter((related): related is Product => related !== undefined);
}

export function getBrands(): string[] {
  return [...new Set(products.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getCategories(): ProductCategory[] {
  return [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b),
  ) as ProductCategory[];
}

function sortProducts(items: Product[], sort: ProductSort = "name-asc"): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
  const filtered = products.filter((product) => {
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    return true;
  });

  return sortProducts(filtered, filters.sort);
}

export function formatPrice(price: number, currency: Product["currency"] = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
