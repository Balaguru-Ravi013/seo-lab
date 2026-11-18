"use client";

import { useRouter, usePathname } from "next/navigation";
import type { ProductCategory, ProductSort } from "@/types/product";

interface ProductToolbarProps {
  brands: string[];
  categories: ProductCategory[];
  brand: string;
  category: string;
  sort: ProductSort;
}

function buildQuery({
  brand,
  category,
  sort,
}: {
  brand: string;
  category: string;
  sort: ProductSort;
}): string {
  const params = new URLSearchParams();
  if (brand) params.set("brand", brand);
  if (category) params.set("category", category);
  if (sort && sort !== "name-asc") params.set("sort", sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Client island for filter/sort controls.
 * Updates the URL so the Server Component PLP can render matching products in HTML.
 */
export function ProductToolbar({
  brands,
  categories,
  brand,
  category,
  sort,
}: ProductToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(next: { brand: string; category: string; sort: ProductSort }) {
    router.push(`${pathname}${buildQuery(next)}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-end md:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Brand</span>
          <select
            className="rounded-md border border-border bg-background px-3 py-2"
            value={brand}
            onChange={(event) =>
              navigate({ brand: event.target.value, category, sort })
            }
          >
            <option value="">All brands</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Category</span>
          <select
            className="rounded-md border border-border bg-background px-3 py-2"
            value={category}
            onChange={(event) =>
              navigate({ brand, category: event.target.value, sort })
            }
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex w-full flex-col gap-1 text-sm md:w-56">
        <span className="text-muted">Sort</span>
        <select
          className="rounded-md border border-border bg-background px-3 py-2"
          value={sort}
          onChange={(event) =>
            navigate({
              brand,
              category,
              sort: event.target.value as ProductSort,
            })
          }
        >
          <option value="name-asc">Name</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </div>
  );
}
