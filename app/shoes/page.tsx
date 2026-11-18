import Link from "next/link";
import { Suspense } from "react";
import { ShoesCatalog } from "@/components/shoes/ShoesCatalog";
import { CATEGORY_GUIDE } from "@/lib/aeo";
import { getBrands } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Running Shoes",
  description:
    "Browse Pacewright running shoes by brand and category. Compare road, trail, racing, daily trainer, and stability shoes with INR pricing.",
  path: "/shoes",
});

type PageProps = {
  searchParams: Promise<{
    brand?: string | string[];
    category?: string | string[];
    sort?: string | string[];
  }>;
};

export default function ShoesPage({ searchParams }: PageProps) {
  const brands = getBrands();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Running shoes</h1>
        <p className="max-w-3xl text-muted">
          Pacewright is a fictional running footwear retailer. This catalog lists road, trail,
          racing, daily trainer, and stability shoes with clear prices in INR, availability, and
          specifications so shoppers and crawlers can compare products from the same facts.
        </p>
      </header>

      <section className="mb-8 space-y-3" aria-labelledby="category-guide-heading">
        <h2 id="category-guide-heading" className="text-lg font-semibold">
          Shoe categories at Pacewright
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {CATEGORY_GUIDE.map((item) => (
            <li key={item.category} className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-medium">
                <Link
                  href={`/shoes?category=${encodeURIComponent(item.category)}`}
                  className="hover:text-accent"
                >
                  {item.category} running shoes
                </Link>
              </h3>
              <p className="mt-1 text-sm text-muted">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 space-y-2" aria-labelledby="brands-heading">
        <h2 id="brands-heading" className="text-lg font-semibold">
          Brands in this catalog
        </h2>
        <p className="text-sm text-muted">
          {brands.map((brand, index) => (
            <span key={brand}>
              {index > 0 ? " · " : null}
              <Link
                href={`/shoes?brand=${encodeURIComponent(brand)}`}
                className="text-accent hover:underline"
              >
                {brand}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <Suspense
        fallback={
          <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
            Loading running shoes…
          </div>
        }
      >
        <ShoesCatalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
