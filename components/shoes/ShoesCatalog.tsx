import { ProductToolbar } from "@/components/filters/ProductToolbar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAvailabilityLabel } from "@/lib/availability";
import { itemListJsonLd } from "@/lib/jsonld";
import {
  filterProducts,
  formatPrice,
  getBrands,
  getCategories,
} from "@/lib/products";
import type { ProductCategory, ProductSort } from "@/types/product";

const SORTS = new Set<ProductSort>(["price-asc", "price-desc", "name-asc"]);
const CATEGORIES = new Set<ProductCategory>([
  "Road",
  "Trail",
  "Racing",
  "Daily Trainer",
  "Stability",
]);

type SearchParams = {
  brand?: string | string[];
  category?: string | string[];
  sort?: string | string[];
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export async function ShoesCatalog({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const brand = firstValue(params.brand);
  const categoryValue = firstValue(params.category);
  const sortValue = firstValue(params.sort);

  const category =
    categoryValue && CATEGORIES.has(categoryValue as ProductCategory)
      ? (categoryValue as ProductCategory)
      : undefined;
  const sort =
    sortValue && SORTS.has(sortValue as ProductSort)
      ? (sortValue as ProductSort)
      : "name-asc";

  const products = filterProducts({
    brand: brand || undefined,
    category,
    sort,
  });

  const cards = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    priceLabel: formatPrice(product.price, product.currency),
    image: product.images[0],
    availabilityLabel: getAvailabilityLabel(product.availability),
  }));

  return (
    <div className="space-y-6">
      <ProductToolbar
        brands={getBrands()}
        categories={getCategories()}
        brand={brand}
        category={category ?? ""}
        sort={sort}
      />

      <p className="text-sm text-muted">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <ProductGrid products={cards} />
      <JsonLd
        data={itemListJsonLd(products, {
          name: "Pacewright running shoes",
          path: "/shoes",
        })}
      />
    </div>
  );
}
