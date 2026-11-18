"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductBreadcrumbs } from "@/components/product/ProductBreadcrumbs";
import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import type { Product, ProductImage, ProductSpec } from "@/types/product";

interface ProductDetailPayload {
  product: Product & {
    priceLabel: string;
    availabilityLabel: string;
    displayDescription: string;
    displayHighlights: string[];
    displaySpecs: ProductSpec[];
  };
  related: ProductCardData[];
}

export function ProductDetail({ slug }: { slug: string }) {
  const [data, setData] = useState<ProductDetailPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<ProductImage | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.status === 404) {
          if (!cancelled) {
            setError("not-found");
            setData(null);
          }
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load product");
        }

        const json = (await response.json()) as ProductDetailPayload;
        if (!cancelled) {
          setData(json);
          setActiveImage(json.product.images[0] ?? null);
          setSelectedSize(json.product.sizes[0] ?? "");
        }
      } catch {
        if (!cancelled) {
          setError("error");
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
        Loading product…
      </div>
    );
  }

  /**
   * Baseline weakness: unknown slugs render an in-page message after client fetch
   * instead of a real HTTP 404 document.
   */
  if (error === "not-found" || !data) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-surface px-6 py-12">
        <div className="text-2xl font-semibold">Product not found</div>
        <p className="text-muted">This product is unavailable.</p>
        <Link href="/shoes" className="inline-flex text-accent hover:underline">
          Back to shoes
        </Link>
      </div>
    );
  }

  const { product, related } = data;

  return (
    <div className="space-y-10">
      <ProductBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shoes", href: "/shoes" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-[#eeeae3]">
            {activeImage ? (
              // Baseline: intentional native <img> (no next/image) for comparison
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage.src}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                width={activeImage.width}
                height={activeImage.height}
              />
            ) : null}
          </div>
          <div className="flex gap-3">
            {product.images.map((image) => (
              <button
                key={image.src}
                type="button"
                className={`overflow-hidden rounded-lg border ${
                  activeImage?.src === image.src ? "border-accent" : "border-border"
                }`}
                onClick={() => setActiveImage(image)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt=""
                  className="h-20 w-28 object-cover"
                  width={112}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-sm uppercase tracking-wide text-muted">{product.brand}</div>
            <div className="text-3xl font-semibold tracking-tight">{product.name}</div>
            <div className="text-xl">{product.priceLabel}</div>
            <div className="text-sm text-muted">{product.availabilityLabel}</div>
          </div>

          {/* Thin baseline copy: short description only */}
          <p className="text-muted">{product.displayDescription}</p>

          <div className="space-y-2">
            <div className="text-sm font-medium">Size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    selectedSize === size
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Highlights</div>
            <div className="space-y-1 text-sm text-muted">
              {product.displayHighlights.map((item) => (
                <div key={item}>• {item}</div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Details</div>
            <div className="space-y-1 text-sm text-muted">
              {product.displaySpecs.map((spec) => (
                <div key={spec.label}>
                  {spec.label}: {spec.value}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted">
            Color: {product.color} · SKU: {product.sku}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xl font-semibold">Related</div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
