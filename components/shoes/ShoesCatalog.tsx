"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductToolbar } from "@/components/filters/ProductToolbar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { formatPrice } from "@/lib/products";
import { getAvailabilityLabel } from "@/lib/availability";
import type { Product, ProductCategory, ProductSort } from "@/types/product";

interface CatalogResponse {
  items: Product[];
  total: number;
  brands: string[];
  categories: ProductCategory[];
}

export function ShoesCatalog() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ProductSort>("name-asc");
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    params.set("sort", sort);
    return params.toString();
  }, [brand, category, sort]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products?${query}`);
        if (!response.ok) {
          throw new Error("Unable to load products");
        }
        const json = (await response.json()) as CatalogResponse;
        if (!cancelled) {
          setData(json);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load the product catalog.");
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const cards =
    data?.items.map((product) => ({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      priceLabel: formatPrice(product.price, product.currency),
      image: product.images[0],
      availabilityLabel: getAvailabilityLabel(product.availability),
    })) ?? [];

  return (
    <div className="space-y-6">
      <ProductToolbar
        brands={data?.brands ?? []}
        categories={data?.categories ?? []}
        brand={brand}
        category={category}
        sort={sort}
        onBrandChange={setBrand}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      <div className="text-sm text-muted">
        {loading ? "Loading products…" : `${data?.total ?? 0} products`}
      </div>

      {error ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-10 text-center text-muted">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
          Loading catalog…
        </div>
      ) : (
        <ProductGrid products={cards} />
      )}
    </div>
  );
}
