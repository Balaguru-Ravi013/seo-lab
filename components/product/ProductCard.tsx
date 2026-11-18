import Link from "next/link";
import type { ProductImage } from "@/types/product";

export interface ProductCardData {
  slug: string;
  name: string;
  brand: string;
  priceLabel: string;
  image: ProductImage;
  availabilityLabel?: string;
}

/**
 * Baseline product card:
 * - native <img> (no next/image)
 * - generic CTA copy ("View")
 * - div-heavy markup
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-[4/3] bg-[#eeeae3]">
        {/* Baseline: intentional native <img> (no next/image) for comparison */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image.src}
          alt=""
          className="h-full w-full object-cover"
          width={product.image.width}
          height={product.image.height}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-muted">{product.brand}</div>
          <div className="text-base font-medium text-foreground">{product.name}</div>
          <div className="text-sm text-foreground">{product.priceLabel}</div>
          {product.availabilityLabel ? (
            <div className="text-xs text-muted">{product.availabilityLabel}</div>
          ) : null}
        </div>
        <Link
          href={`/shoes/${product.slug}`}
          className="mt-auto inline-flex w-fit rounded-md bg-hero px-3 py-2 text-sm text-accent-foreground hover:bg-accent"
        >
          View
        </Link>
      </div>
    </div>
  );
}
