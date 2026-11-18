import { filterProducts, getBrands, getCategories } from "@/lib/products";
import type { ProductCategory, ProductSort } from "@/types/product";
import type { NextRequest } from "next/server";

const SORTS = new Set<ProductSort>(["price-asc", "price-desc", "name-asc"]);
const CATEGORIES = new Set<ProductCategory>([
  "Road",
  "Trail",
  "Racing",
  "Daily Trainer",
  "Stability",
]);

/**
 * Baseline catalog API.
 * PLP fetches here on the client so product markup is absent from the initial HTML.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const brand = params.get("brand") ?? undefined;
  const categoryParam = params.get("category");
  const sortParam = params.get("sort");

  const category =
    categoryParam && CATEGORIES.has(categoryParam as ProductCategory)
      ? (categoryParam as ProductCategory)
      : undefined;
  const sort =
    sortParam && SORTS.has(sortParam as ProductSort)
      ? (sortParam as ProductSort)
      : "name-asc";

  const items = filterProducts({ brand, category, sort });

  return Response.json({
    items,
    total: items.length,
    brands: getBrands(),
    categories: getCategories(),
  });
}
