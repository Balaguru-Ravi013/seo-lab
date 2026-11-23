# Storefront SEO Lab (Pacewright)

Educational Next.js 16 e-commerce demo comparing an intentionally unoptimized storefront (`baseline`) with an SEO/AEO-optimized storefront (`seo-aeo-optimized`).

## Stack

- Next.js 16 App Router
- React 19
- TypeScript (strict)
- Tailwind CSS 4

## Development

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` when you need absolute canonical/sitemap URLs.

## Project notes

- Local typed catalog: `data/products.ts`
- Product helpers: `lib/products.ts`
- Product images: `public/images/products/`
- No backend, auth, cart, or payments by design

## Documentation

- `docs/intern-learning-guide.md` — **start here for interns**: how to use the project + SEO/AEO topic → file:line map
- `docs/baseline-audit.md` — baseline technical SEO gaps and evidence
- `docs/seo-aeo-comparison.md` — measured baseline vs optimized comparison
- `docs/aeo-optimization.md` — AEO goals, implementation, established vs emerging practices, evaluation
- `docs/evidence/` — HTML snapshots and Lighthouse artifacts
- `/llms.txt` and `/llms-full.txt` — experimental dynamic LLM index files (not a ranking requirement)

> Evidence snapshots are point-in-time artifacts. Re-capture them after material UI, schema, or rendering changes.
