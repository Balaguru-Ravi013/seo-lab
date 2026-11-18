import { getAllProducts, getBrands, getCategories } from "@/lib/products";

export default function Home() {
  const productCount = getAllProducts().length;
  const brands = getBrands();
  const categories = getCategories();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Storefront SEO Lab
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-hero">Pacewright</h1>
        <p className="max-w-2xl text-lg text-muted">
          Phase 1 setup is ready. The shared product catalog, helpers, and local image
          assets are in place for the baseline storefront build.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Products</p>
          <p className="mt-2 text-3xl font-semibold">{productCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Brands</p>
          <p className="mt-2 text-3xl font-semibold">{brands.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Categories</p>
          <p className="mt-2 text-3xl font-semibold">{categories.length}</p>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">Catalog brands</h2>
        <p className="text-muted">{brands.join(" · ")}</p>
        <h2 className="text-xl font-semibold">Categories</h2>
        <p className="text-muted">{categories.join(" · ")}</p>
      </section>
    </main>
  );
}
