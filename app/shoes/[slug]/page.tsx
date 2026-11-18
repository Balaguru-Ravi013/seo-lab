import { Suspense } from "react";
import { ProductDetail } from "@/components/shoes/ProductDetail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Baseline PDP:
 * - Shell renders immediately without product facts in HTML
 * - Client fetch hydrates thin product copy from /api/products/[slug]
 * - Missing Product JSON-LD, canonical, unique metadata, and real 404 behavior
 *
 * Params are read inside Suspense so Next.js 16 Cache Components can still
 * prerender the static shell around the dynamic segment.
 */
export default function ProductPage({ params }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Suspense
        fallback={
          <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
            Loading product…
          </div>
        }
      >
        <ProductDetailLoader params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetailLoader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
