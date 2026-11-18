import Link from "next/link";

export function SiteHeader() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-hero">
          Pacewright
        </Link>
        <div className="flex items-center gap-5 text-sm text-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <Link href="/shoes" className="hover:text-accent">
            Shoes
          </Link>
        </div>
      </div>
    </div>
  );
}
