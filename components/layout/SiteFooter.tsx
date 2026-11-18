import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted">
        <p>Pacewright — fictional running footwear demo for Storefront SEO Lab.</p>
        <p>No cart, checkout, or payments. Catalog is local and deterministic.</p>
        <p>
          <Link href="/shoes" className="text-accent hover:underline">
            Browse all running shoes
          </Link>
        </p>
      </div>
    </footer>
  );
}
