import { ShoesCatalog } from "@/components/shoes/ShoesCatalog";

/**
 * Baseline PLP:
 * - Generic page chrome only in the initial HTML
 * - Product grid loaded client-side from /api/products
 * - No unique metadata, canonical, ItemList JSON-LD, or sitemap entry
 */
export default function ShoesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <div className="text-3xl font-semibold tracking-tight">Shoes</div>
        <p className="max-w-2xl text-muted">
          Browse running shoes. Use filters to narrow by brand or category, and sort by price.
        </p>
      </div>
      <ShoesCatalog />
    </div>
  );
}
