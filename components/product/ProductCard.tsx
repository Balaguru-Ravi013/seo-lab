import Image from "next/image";
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

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <Link href={`/shoes/${product.slug}`} className="aspect-[4/3] bg-[#eeeae3]">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          className="h-full w-full object-cover"
          width={product.image.width}
          height={product.image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>
          <h2 className="text-base font-medium text-foreground">
            <Link href={`/shoes/${product.slug}`} className="hover:text-accent">
              {product.name}
            </Link>
          </h2>
          <p className="text-sm text-foreground">{product.priceLabel}</p>
          {product.availabilityLabel ? (
            <p className="text-xs text-muted">{product.availabilityLabel}</p>
          ) : null}
        </div>
        <Link
          href={`/shoes/${product.slug}`}
          className="mt-auto inline-flex w-fit rounded-md bg-hero px-3 py-2 text-sm text-accent-foreground hover:bg-accent"
        >
          View {product.name}
        </Link>
      </div>
    </article>
  );
}
