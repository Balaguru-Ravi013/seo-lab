import type { ProductFact } from "@/lib/aeo";

export function ProductSummary({
  summary,
  facts,
}: {
  summary: string;
  facts: ProductFact[];
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-5" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="text-lg font-semibold">
        At a glance
      </h2>
      <p className="text-muted">{summary}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.slice(0, 8).map((fact) => (
          <div key={fact.label}>
            <dt className="text-sm font-medium text-foreground">{fact.label}</dt>
            <dd className="text-sm text-muted">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
