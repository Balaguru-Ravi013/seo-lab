import Link from "next/link";
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

      <section className="space-y-3" aria-labelledby="catalog-comparison-heading">
        <h2 id="catalog-comparison-heading" className="text-xl font-semibold">
          Compare running shoes
        </h2>
        <p className="text-sm text-muted">
          Compare the currently displayed products by category, intended use, listed price, and
          availability. This table updates when you change the catalog filters or sort order.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">Comparison of currently displayed Pacewright running shoes</caption>
            <thead className="border-b border-border text-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Product</th>
                <th scope="col" className="px-4 py-3 font-medium">Category</th>
                <th scope="col" className="px-4 py-3 font-medium">Best for</th>
                <th scope="col" className="px-4 py-3 font-medium">Listed price</th>
                <th scope="col" className="px-4 py-3 font-medium">Availability</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {products.map((product) => (
                <tr key={product.slug} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                    <Link href={`/shoes/${product.slug}`} className="hover:text-accent">
                      {product.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    {product.specifications.find((spec) => spec.label === "Best for")?.value ?? "Not specified"}
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.price, product.currency)}</td>
                  <td className="px-4 py-3">{getAvailabilityLabel(product.availability)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <JsonLd
        data={itemListJsonLd(products, {
          name: "Pacewright running shoes",
          path: "/shoes",
        })}
      />
    </div>
  );
}
