# Baseline audit — Pacewright (`baseline`)

**Audit date:** 2026-11-18  
**App:** Storefront SEO Lab / Pacewright  
**Branch under test:** `baseline`  
**Runtime:** `next build` + `next start` on `http://127.0.0.1:3003`  
**Evidence folder:** `docs/evidence/`

## How to read this report

- **Measured** = observed from local production HTML, HTTP responses, or Lighthouse lab runs in this environment.
- **Expected** = likely SEO/AEO impact based on established technical SEO practice. Not a claim about live Google rankings or AI citations.
- Lighthouse SEO can score highly while important crawlability and metadata quality issues remain. That happened here.

## Environment and method

1. `npm run build`
2. `npx next start --hostname 127.0.0.1 --port 3003`
3. Fetch initial HTML for `/`, `/shoes`, `/shoes/aeropeak-vapor-stride`, `/shoes/does-not-exist`
4. Check `/sitemap.xml`, `/robots.txt`, and `/api/products*`
5. Run Lighthouse 13.6.0 (headless Chrome) for Performance, SEO, Accessibility on home, PLP, and one PDP

Raw artifacts:

- `docs/evidence/baseline-checks.json`
- `docs/evidence/{home,shoes,pdp,missing}.html`
- `docs/evidence/lighthouse-*-summary.json`
- `docs/evidence/lighthouse-*.report.html`

---

## Measured snapshot

### HTTP and discoverability

| Check | Result | Evidence |
|---|---|---|
| `/` status | 200 | `baseline-checks.json` |
| `/shoes` status | 200 | `baseline-checks.json` |
| `/shoes/aeropeak-vapor-stride` status | 200 | `baseline-checks.json` |
| `/shoes/does-not-exist` status | **200** (soft miss) | `baseline-checks.json` |
| `/api/products` | 200, 12 items | API preview in evidence |
| `/api/products/aeropeak-vapor-stride` | 200 | evidence |
| `/api/products/does-not-exist` | 404 | evidence |
| `/sitemap.xml` | 404 | evidence |
| `/robots.txt` | 404 | evidence |

### Metadata and structured data (initial HTML)

| Page | `<title>` | Meta description | Canonical | OG | Twitter | JSON-LD | `<h1>` |
|---|---|---|---|---|---|---|---|
| Home | `Online Store` | `Shop our products online.` | Absent | 0 | 0 | 0 | 0 |
| PLP | `Online Store` | `Shop our products online.` | Absent | 0 | 0 | 0 | 0 |
| PDP | `Online Store` | `Shop our products online.` | Absent | 0 | 0 | 0 | 0 |
| Missing slug | `Online Store` | `Shop our products online.` | Absent | 0 | 0 | 0 | 0 |

### Initial HTML product discoverability

| Marker | Home | PLP `/shoes` | PDP sample |
|---|---|---|---|
| Product name `AeroPeak Vapor Stride` | Present (featured SSR) | **Absent** | **Absent** |
| Short description | Absent | Absent | Absent |
| Detailed copy (`Nitrogen-infused`) | Absent | Absent | Absent |
| Formatted price `₹12,999` | Present (featured) | Absent | Absent |

Interpretation: homepage featured cards are server-rendered, so some product names/prices appear in HTML. The PLP and PDP shells do **not** include catalog/product facts until client-side JavaScript fetches `/api/products`.

### Internal linking / semantics (home HTML)

| Signal | Measured |
|---|---|
| Empty `alt=""` images | 4 on home |
| Generic CTA text matches (`View` / `View all`) | 5 on home |
| Main landmark | Missing (Lighthouse a11y) |

### Lighthouse lab scores (local, single run)

| Page | SEO | Performance | Accessibility | LCP (ms) | CLS | TBT (ms) | INP |
|---|---|---|---|---|---|---|---|
| Home | 100 | 98 | 98 | ~2394 | 0 | ~5 | Not measured |
| PLP | 100 | 95 | 98 | ~2484 | ~0.107 | ~6 | Not measured |
| PDP | 100 | 89 | 91 | ~2555 | ~0.186 | ~13 | Not measured |

Notes:

- These are **lab** metrics from one local run. They are not field CrUX data.
- **INP was not measured.** TBT is recorded separately and must not be treated as INP.
- Lighthouse SEO scored 100 because a title and meta description exist, the page is not `noindex`, and anchors are crawlable. It does **not** fail generic duplicated titles, missing canonicals, missing JSON-LD, thin client-rendered content, or missing sitemaps as hard SEO category failures in this run (`canonical`, `structured-data`, and `robots-txt` audits were informative / unscored).

---

## Finding matrix

### 1. Generic, non-unique metadata

| Field | Detail |
|---|---|
| **Feature** | Document title + meta description |
| **Current implementation** | Root `metadata` sets `title: "Online Store"` and `description: "Shop our products online."` for all routes |
| **SEO/AEO problem** | Every URL shares the same snippet candidates; product/entity intent is unclear to search and answer engines |
| **How to reproduce** | `curl -s http://127.0.0.1:3003/shoes/aeropeak-vapor-stride \| rg -n "<title>\|meta name=\\\"description"` |
| **Expected optimization** | Unique `generateMetadata` per home/PLP/PDP |
| **Evidence** | Measured identical titles/descriptions in `baseline-checks.json` |

### 2. Missing canonical URLs

| Field | Detail |
|---|---|
| **Feature** | `rel=canonical` |
| **Current implementation** | None |
| **SEO/AEO problem** | No explicit preferred URL for query variants or deployment mirrors |
| **How to reproduce** | Search initial HTML for `rel="canonical"` (absent) |
| **Expected optimization** | Env-aware canonical via `NEXT_PUBLIC_SITE_URL` |
| **Evidence** | Measured `has_canonical: false` on all sampled pages |

### 3. Missing Open Graph / Twitter cards

| Field | Detail |
|---|---|
| **Feature** | Social sharing metadata |
| **Current implementation** | None |
| **SEO/AEO problem** | Uncontrolled link previews; weaker entity/context signals in some parsers |
| **How to reproduce** | Search HTML for `og:` / `twitter:` meta tags |
| **Expected optimization** | OG + Twitter metadata with product-aware PDP fields |
| **Evidence** | Measured `og_tags_count: 0`, `twitter_tags_count: 0` |

### 4. No XML sitemap

| Field | Detail |
|---|---|
| **Feature** | Sitemap |
| **Current implementation** | Missing |
| **SEO/AEO problem** | No machine-readable inventory of indexable URLs |
| **How to reproduce** | `curl -I http://127.0.0.1:3003/sitemap.xml` → 404 |
| **Expected optimization** | `app/sitemap.ts` covering `/`, `/shoes`, and all product slugs |
| **Evidence** | Measured HTTP 404 |

### 5. No robots.txt

| Field | Detail |
|---|---|
| **Feature** | robots.txt |
| **Current implementation** | Missing (and intentionally not blocking crawl via headers/meta) |
| **SEO/AEO problem** | No sitemap pointer / crawl policy file |
| **How to reproduce** | `curl -I http://127.0.0.1:3003/robots.txt` → 404 |
| **Expected optimization** | `app/robots.ts` allowing crawl and linking sitemap |
| **Evidence** | Measured HTTP 404 |

### 6. No structured data

| Field | Detail |
|---|---|
| **Feature** | JSON-LD |
| **Current implementation** | None |
| **SEO/AEO problem** | No explicit Product/Offer/BreadcrumbList/Organization entities for supporting systems that consume schema |
| **How to reproduce** | Search HTML for `application/ld+json` |
| **Expected optimization** | Valid JSON-LD for Organization, WebSite, BreadcrumbList, Product+Offer, and PLP ItemList where appropriate (no invented ratings) |
| **Evidence** | Measured `jsonld_count: 0` |

### 7. PLP product content absent from initial HTML

| Field | Detail |
|---|---|
| **Feature** | Product listing crawlability |
| **Current implementation** | `/shoes` shell + client `fetch('/api/products')` |
| **SEO/AEO problem** | Non-JS crawlers and some extractors see loading chrome without product names, prices, or links |
| **How to reproduce** | `curl -s http://127.0.0.1:3003/shoes \| rg "AeroPeak|₹"` (no product matches). Compare with `/api/products` |
| **Expected optimization** | Server Components render catalog HTML; keep filters interactive on the client |
| **Evidence** | Measured product markers all `false` on PLP initial HTML |

### 8. PDP product content absent from initial HTML

| Field | Detail |
|---|---|
| **Feature** | Product detail crawlability |
| **Current implementation** | Client fetch to `/api/products/[slug]` after mount; thin copy only after hydration |
| **SEO/AEO problem** | Primary product facts are not in the first HTML response |
| **How to reproduce** | `curl -s http://127.0.0.1:3003/shoes/aeropeak-vapor-stride \| rg "AeroPeak Vapor Stride|Lightweight daily"` |
| **Expected optimization** | Server-rendered PDP with full descriptive content + static generation for known slugs |
| **Evidence** | Measured product markers all `false` on PDP initial HTML |

### 9. Soft 404 for unknown product slugs

| Field | Detail |
|---|---|
| **Feature** | HTTP status handling |
| **Current implementation** | `/shoes/does-not-exist` returns **200** with client-side “not found” UI after fetch |
| **SEO/AEO problem** | Crawlers may treat missing URLs as valid pages |
| **How to reproduce** | `curl -I http://127.0.0.1:3003/shoes/does-not-exist` → 200; API path returns 404 |
| **Expected optimization** | `notFound()` / real 404 response for unknown slugs |
| **Evidence** | Measured page 200 vs API 404 |

### 10. Thin product copy (after JS)

| Field | Detail |
|---|---|
| **Feature** | PDP content depth |
| **Current implementation** | API exposes `displayDescription` from `shortDescription`, 2 highlights, 3 specs |
| **SEO/AEO problem** | Limited factual surface for answer-style extraction even after JS runs |
| **How to reproduce** | Inspect `/api/products/aeropeak-vapor-stride` payload fields `displayDescription`, `displayHighlights`, `displaySpecs` |
| **Expected optimization** | Full description, complete specs/highlights, concise Q&A, consistent facts with JSON-LD |
| **Evidence** | Measured API contract / implementation (content quality gap is by design) |

### 11. Weak image SEO and performance practices

| Field | Detail |
|---|---|
| **Feature** | Product images |
| **Current implementation** | Native `<img>`, empty `alt=""`, no `next/image` |
| **SEO/AEO problem** | No descriptive alt text; missed responsive image optimization opportunities |
| **How to reproduce** | View home HTML image tags; note Lighthouse still passes `image-alt` because empty alt counts as present |
| **Expected optimization** | Descriptive alts + `next/image` with sizes |
| **Evidence** | Measured 4 empty alts on home; Lighthouse `image-alt` score 1 (educational false comfort) |

### 12. Weak internal link wording and heading semantics

| Field | Detail |
|---|---|
| **Feature** | Internal linking + headings |
| **Current implementation** | CTAs labeled `View` / `View all`; page titles often plain `<div>` instead of `<h1>`; no `<main>` landmark |
| **SEO/AEO problem** | Weak anchor context and document outline for users and parsers |
| **How to reproduce** | Inspect home HTML link text; count `<h1>`; Lighthouse a11y `landmark-one-main` fails |
| **Expected optimization** | Descriptive anchors, one H1 per page, semantic landmarks |
| **Evidence** | Measured link text / h1_count 0; Lighthouse a11y failure |

### 13. Layout shift on client-rendered catalog/detail

| Field | Detail |
|---|---|
| **Feature** | CLS / LCP lab behavior |
| **Current implementation** | Loading placeholders replaced by fetched product UI |
| **SEO/AEO problem** | Weaker lab CWV on PLP/PDP versus a stable server-rendered catalog |
| **How to reproduce** | Compare Lighthouse summaries for home vs PLP/PDP CLS |
| **Expected optimization** | Server-rendered content, reserved image space, fewer late-loading content swaps |
| **Evidence** | Measured CLS ~0 home, ~0.107 PLP, ~0.186 PDP |

---

## What Lighthouse did *not* prove

- It did **not** prove indexation, ranking, or AI Overview / ChatGPT / Perplexity citation behavior.
- A SEO score of **100** did **not** mean metadata quality, canonicalization, structured data, sitemap presence, or initial-HTML product discoverability are strong.
- Local lab LCP/CLS/TBT are not substitutes for field Core Web Vitals.
- INP is **Not measured.**

---

## Priority optimizations for `seo-aeo-optimized`

1. Server-render PLP/PDP product content; statically generate known product routes.
2. Unique metadata, canonicals, OG/Twitter tags; env-aware site URL.
3. `sitemap.ts` + `robots.ts`.
4. JSON-LD for Organization, WebSite, BreadcrumbList, Product/Offer, ItemList.
5. Real 404 for unknown slugs.
6. Richer answer-friendly product content aligned with visible copy and schema.
7. `next/image`, descriptive alts, semantic headings/landmarks, descriptive internal links.

---

## Reproduction commands

```bash
cd "/Users/balaguru/Projects/SEO Lab/seo-lab"
npm run build
npx next start --hostname 127.0.0.1 --port 3003

curl -s http://127.0.0.1:3003/shoes | rg "AeroPeak|₹|canonical|ld\+json"
curl -s http://127.0.0.1:3003/shoes/aeropeak-vapor-stride | rg "<title>|description|AeroPeak"
curl -I http://127.0.0.1:3003/shoes/does-not-exist
curl -I http://127.0.0.1:3003/sitemap.xml
curl -I http://127.0.0.1:3003/robots.txt
```
