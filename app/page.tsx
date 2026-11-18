import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getAvailabilityLabel } from "@/lib/availability";
import { formatPrice, getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts(4).map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    priceLabel: formatPrice(product.price, product.currency),
    image: product.images[0],
    availabilityLabel: getAvailabilityLabel(product.availability),
  }));

  return (
    <div>
      <div className="bg-hero text-accent-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-20">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">Running footwear</div>
          <div className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Pacewright
          </div>
          <p className="max-w-2xl text-lg text-white/80">
            A fictional running shoe storefront built to demonstrate technical SEO and answer
            engine optimization trade-offs in Next.js.
          </p>
          <Link
            href="/shoes"
            className="inline-flex w-fit rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Shop shoes
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-14">
        <div className="space-y-2">
          <div className="text-2xl font-semibold">Featured</div>
          <p className="text-muted">A few in-stock picks from the Pacewright catalog.</p>
        </div>
        <ProductGrid products={featured} />
        <div>
          <Link href="/shoes" className="text-accent hover:underline">
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
