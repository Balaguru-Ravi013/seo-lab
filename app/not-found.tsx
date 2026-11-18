import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted">
        The page you requested does not exist in the Pacewright catalog.
      </p>
      <p>
        <Link href="/shoes" className="text-accent hover:underline">
          Browse all running shoes
        </Link>
      </p>
    </main>
  );
}
