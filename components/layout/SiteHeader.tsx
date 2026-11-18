import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-hero">
          Pacewright
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 text-sm text-foreground">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shoes" className="hover:text-accent">
                Running shoes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
