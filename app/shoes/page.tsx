import { Suspense } from "react";
import { ShoesCatalog } from "@/components/shoes/ShoesCatalog";
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
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Running shoes</h1>
        <p className="max-w-2xl text-muted">
          Browse running shoes. Filter by brand or category, and sort by price. Product details
          are available in the initial HTML for crawlability.
        </p>
      </header>

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
