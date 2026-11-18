import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function ProductBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
