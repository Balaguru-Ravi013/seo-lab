# Intern guide — Pacewright SEO / AEO Lab

Study **technical SEO** and **AEO** by comparing two branches of the same shop.

| Branch | Purpose |
|---|---|
| `baseline` | Same store, intentional SEO/AEO gaps |
| `seo-aeo-optimized` | Same products/routes/UI, with fixes |

No cart, auth, or database. Catalog = `data/products.ts`.

> Line numbers match the **optimized** branch when this file was written. Re-check with search if code moves.

---

## Run

```bash
cd seo-lab
npm install
npm run dev
```

| URL | Look at |
|---|---|
| `/` | Home + Organization/WebSite JSON-LD |
| `/shoes` | PLP (SSR product list, filters) |
| `/shoes/[slug]` | PDP (content + Product, BreadcrumbList, and FAQPage JSON-LD) |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |
| `/llms.txt` | Experimental LLM index |

**Baseline contrast**

```bash
git checkout baseline && npm run dev
# View Source on /shoes and a PDP — product facts missing from first HTML
git checkout seo-aeo-optimized
```

**Quick checks**

```bash
curl -s http://localhost:3000/shoes | rg "AeroPeak"
curl -s http://localhost:3000/shoes/aeropeak-vapor-stride | rg "At a glance|ld\+json"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/shoes/does-not-exist
```

---

## Topic → code map (optimized)

| Topic | File:lines |
|---|---|
| SSR PDP + static params + 404 | `app/shoes/[slug]/page.tsx` 16–37 |
| PDP page UI (H1, specs, links) | `components/shoes/ProductDetail.tsx` 38–168 |
| SSR PLP + filters | `components/shoes/ShoesCatalog.tsx` 36–92; `components/filters/ProductToolbar.tsx` 35–107 |
| Metadata / canonical / OG / Twitter | `lib/seo.ts` 16–76 |
| Home / PLP metadata usage | `app/page.tsx` 9–13; `app/shoes/page.tsx` 8–12 |
| PDP `generateMetadata` | `app/shoes/[slug]/page.tsx` 20–29 |
| Site URL helper | `lib/site.ts` 5–16 |
| `metadataBase` | `app/layout.tsx` 19–37 |
| Sitemap | `app/sitemap.ts` 5–28 |
| robots.txt | `app/robots.ts` 4–13 |
| JSON-LD helpers | `lib/jsonld.ts` |
| JSON-LD render | `components/seo/JsonLd.tsx` |
| Home schema wire-up | `app/page.tsx` 74 |
| PLP ItemList wire-up | `components/shoes/ShoesCatalog.tsx` 85–92 |
| PDP Product / Breadcrumb / FAQ schema wire-up | `components/shoes/ProductDetail.tsx` |
| `next/image` + alt | `components/product/ProductCard.tsx` 18–25; `ProductGallery.tsx` 24–32 |
| Descriptive links | `components/product/ProductCard.tsx` 40–45 |
| Breadcrumbs | `components/product/ProductBreadcrumbs.tsx` 8–31 |
| AEO summary / facts / Q&A / compare | `lib/aeo.ts`; UI in `ProductSummary.tsx`, `ProductQuestions.tsx`, `ProductComparison.tsx` |
| Category / brand hub copy | `app/shoes/page.tsx` 37–75 |
| `llms.txt` / `llms-full.txt` | `lib/llms-txt.ts`; `app/llms.txt/route.ts`; `app/llms-full.txt/route.ts` |
| Catalog + types | `data/products.ts`; `types/product.ts` |

---

## Baseline vs optimized (what to notice)

| Topic | Baseline | Optimized |
|---|---|---|
| PLP/PDP first HTML | Thin shell; client fetch | Full product HTML |
| Metadata | Generic | Unique + canonical + OG |
| Sitemap / robots | Missing | Present |
| JSON-LD | None | Home / PLP / PDP |
| Unknown product | Soft 200 | 404 |
| AEO blocks | No | Summary, expanded Q&A, ordered How-to steps, comparison tables |

Details + evidence: `docs/baseline-audit.md`, `docs/seo-aeo-comparison.md`, `docs/aeo-optimization.md`.

---

## SSR question (local data vs API await)

**Local sync read (current optimized):** Server Component can call `getProductBySlug()` with no `await`. HTML still includes the product.

**Server Component + `await fetch(api)`:** Still SSR **if** you render that data in the Server Component. The response HTML contains the facts. Crawlability stays the same in principle.

**Client `useEffect` + fetch:** Facts appear only after JS. That is the baseline weakness — worse for SEO/AEO.

| Pattern | In first HTML? |
|---|---|
| Server read local data | Yes |
| Server `await fetch(...)` then render | Yes |
| Client fetch after mount | No |

Use cache (`fetch` cache / `'use cache'`) when you add real APIs so you don’t refetch on every request without a plan.

---

## Honesty rules

- Don’t invent rankings or AI citation wins.
- Lighthouse SEO = 100 does not mean SEO is “done.”
- `llms.txt` is experimental, not a ranking requirement.
- No fake reviews/ratings in schema.
- FAQPage schema must mirror visible, catalog-derived questions and answers; it does not guarantee a rich result.
