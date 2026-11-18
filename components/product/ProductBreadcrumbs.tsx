import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

/**
 * Baseline breadcrumbs: usable links, but no BreadcrumbList structured data
 * and no <nav aria-label> landmark reserved for the optimized branch.
 */
export function ProductBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground" : undefined}>{item.label}</span>
            )}
            {!isLast ? <span>/</span> : null}
          </div>
        );
      })}
    </div>
  );
}
