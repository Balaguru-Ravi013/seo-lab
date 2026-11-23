import Link from "next/link";
import type { ComparisonPoint } from "@/lib/aeo";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";

export function ProductComparison({
  product,
  productName,
  comparisons,
}: {
  product?: Product;
  /** Supports an in-flight client bundle that still uses the former prop shape. */
  productName?: string;
  comparisons: ComparisonPoint[];
}) {
  if (comparisons.length === 0) {
    return null;
  }

  const name = product?.name ?? productName ?? "This product";

  return (
    <section className="space-y-4" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="text-xl font-semibold">
        How {name} compares
      </h2>
      <p className="text-sm text-muted">
        {name} can be compared with the alternatives below by category, listed price, and
        stated best use. The comparison uses only Pacewright catalog facts, so it helps identify
        which option matches your running surface and intended use without claiming an overall
        winner.
      </p>
      {product ? <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[38rem] text-left text-sm">
          <caption className="sr-only">Product comparison for {name}</caption>
          <thead className="border-b border-border text-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Product</th>
              <th scope="col" className="px-4 py-3 font-medium">Category</th>
              <th scope="col" className="px-4 py-3 font-medium">Best for</th>
              <th scope="col" className="px-4 py-3 font-medium">Listed price</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            <tr className="border-b border-border bg-background/50">
              <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                {name}
              </th>
              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3">
                {product.specifications.find((spec) => spec.label === "Best for")?.value ?? "Not specified"}
              </td>
              <td className="px-4 py-3">{formatPrice(product.price, product.currency)}</td>
            </tr>
            {comparisons.map((item) => (
              <tr key={item.slug} className="border-b border-border last:border-0">
                <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                  <Link href={`/shoes/${item.slug}`} className="hover:text-accent">
                    {item.name}
                  </Link>
                </th>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.bestFor}</td>
                <td className="px-4 py-3">{item.priceLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}
      <ul className="space-y-3">
        {comparisons.map((item) => (
          <li key={item.slug} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-base font-medium">
              <Link href={`/shoes/${item.slug}`} className="hover:text-accent">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted">
              {item.brand} · {item.category} · {item.priceLabel}
            </p>
            <p className="mt-2 text-sm text-muted">{item.summary}</p>
            <p className="mt-3">
              <Link href={`/shoes/${item.slug}`} className="text-sm text-accent hover:underline">
                Compare details for {item.name}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
