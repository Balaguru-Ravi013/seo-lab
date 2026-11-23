import Link from "next/link";
import type { ComparisonPoint } from "@/lib/aeo";

export function ProductComparison({
  productName,
  comparisons,
}: {
  productName: string;
  comparisons: ComparisonPoint[];
}) {
  if (comparisons.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="text-xl font-semibold">
        How {productName} compares
      </h2>
      <p className="text-sm text-muted">
        {productName} can be compared with the alternatives below by category, listed price, and
        stated best use. The comparison uses only Pacewright catalog facts, so it helps identify
        which option matches your running surface and intended use without claiming an overall
        winner.
      </p>
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
