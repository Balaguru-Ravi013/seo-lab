# SEO / AEO comparison — Baseline vs Optimized

**Project:** Storefront SEO Lab (Pacewright)  
**Compared branches:** `baseline` vs `seo-aeo-optimized`  
**Comparison date:** 2026-11-18  

## Method

Same local conditions for both sides:

1. `npm run build`
2. `next start` on localhost
3. Fetch initial HTML with curl/urllib (no browser JS execution for crawlability checks)
4. Lighthouse 13.6.0 lab runs (headless Chrome), Performance + SEO + Accessibility
5. Record only measured values; mark unavailable items as **Not measured.**

| Side | Server | Evidence |
|---|---|---|
| Baseline | `http://127.0.0.1:3003` | `docs/evidence/baseline-checks.json`, `lighthouse-*-summary.json`, `docs/baseline-audit.md` |
| Optimized | `http://127.0.0.1:3010` | `docs/evidence/optimized-checks.json`, `optimized-lighthouse-*-summary.json` |

**Not proven by this method:** live indexing, rankings, AI Overview / ChatGPT / Perplexity citations, or field Core Web Vitals (CrUX).

**INP:** Not measured. Lab TBT is recorded separately and is **not** a substitute for INP.

**Google Rich Results Test / Schema Markup Validator:** Not measured in this local pass (public HTTPS URL required for convenient retesting). Validate after Phase 7 deployments.

---

## Comparison table

| Metric | Baseline | Optimized | Evidence |
|---|---|---|---|
| Unique metadata | No — all sampled routes use `Online Store` / generic description | Yes — unique titles/descriptions per home, PLP, and each PDP | `baseline-checks.json`, `optimized-checks.json` |
| Canonical URL | Absent | Present on home, PLP, PDP | same |
| Product JSON-LD | Absent | Present on PDP (`BreadcrumbList` + `Product` `@graph`) | optimized PDP HTML / checks |
| ItemList JSON-LD | Absent | Present on PLP | optimized PLP checks |
| Organization / WebSite JSON-LD | Absent | Present on home | optimized home checks |
| Sitemap | 404 | 200 (`/sitemap.xml`, 14 `<loc>` entries) | curl / checks |
| Robots directives | `/robots.txt` 404 | 200 — allow `/`, sitemap pointer | checks |
| `llms.txt` (experimental) | Absent | Dynamic `/llms.txt` + `/llms-full.txt` from catalog | curl routes; `lib/llms-txt.ts` |
| Initial HTML content (PLP products) | Product names/prices **absent** | Product names **present** | baseline vs optimized shoes HTML |
| Initial HTML content (PDP facts) | Product name/description **absent** | Name + full description + AEO sections **present** | baseline vs optimized PDP HTML |
| Unknown product HTTP status | **200** soft miss | **404** | curl `GET /shoes/does-not-exist` |
| Lighthouse SEO (home) | 100 | 100 | lighthouse summaries |
| Lighthouse SEO (PLP) | 100 | 100 | lighthouse summaries |
| Lighthouse SEO (PDP) | 100 | 100 | lighthouse summaries |
| Lighthouse Performance (home) | 98 | 100 | lighthouse summaries |
| Lighthouse Performance (PLP) | 95 | 100 | lighthouse summaries |
| Lighthouse Performance (PDP) | 89 | 98 | lighthouse summaries |
| LCP home (lab ms) | ~2394 | ~755 | lighthouse summaries |
| LCP PLP (lab ms) | ~2484 | ~903 | lighthouse summaries |
| LCP PDP (lab ms) | ~2555 | ~2463 | lighthouse summaries |
| CLS home (lab) | 0 | 0 | lighthouse summaries |
| CLS PLP (lab) | ~0.107 | 0 | lighthouse summaries |
| CLS PDP (lab) | ~0.186 | 0 | lighthouse summaries |
| INP | Not measured | Not measured | — |
| Image handling | Native `<img>`, empty `alt` on home (4) | `next/image` + descriptive alts; empty alt count 0 on sampled pages | HTML checks |
| Semantic landmarks / H1 | No `<main>` / no `<h1>` on sampled pages | `<main>` + page H1 present | HTML checks |

---

## Detailed findings

### 1. Crawlability / initial HTML

| Check | Baseline | Optimized |
|---|---|---|
| PLP `AeroPeak Vapor Stride` in first HTML | No | Yes |
| PDP full copy (`Nitrogen-infused`) in first HTML | No | Yes |
| Rendering approach | Client fetch from `/api/products` | Server Components + static PDP params |

**Interpretation:** Optimized pages expose product facts to non-JS fetches. This is a technical crawlability improvement, not a ranking guarantee.

### 2. Metadata and sharing tags

| Page | Baseline title | Optimized title |
|---|---|---|
| Home | `Online Store` | `Pacewright Running Shoes` |
| PLP | `Online Store` | `Running Shoes \| Pacewright` |
| PDP sample | `Online Store` | `AeroPeak Vapor Stride by AeroPeak \| Pacewright` |

Optimized also adds canonical, Open Graph, and Twitter tags on those routes.

### 3. Structured data

| Page | Baseline | Optimized types in initial HTML |
|---|---|---|
| Home | none | Organization, WebSite |
| PLP | none | Organization, ItemList |
| PDP | none | BreadcrumbList, Product |

Product JSON-LD intentionally omits invented ratings, reviews, shipping, and return policies.

**Note:** Lighthouse SEO remained 100 on both branches. Lighthouse does not fully score metadata uniqueness, sitemap quality, or JSON-LD richness as hard SEO category failures.

### 4. Discoverability files

| File | Baseline | Optimized |
|---|---|---|
| `/sitemap.xml` | 404 | 200 |
| `/robots.txt` | 404 | 200 |

### 5. Status codes

| URL | Baseline | Optimized |
|---|---|---|
| `/shoes/does-not-exist` | 200 | 404 |

### 6. Lab performance / CWV proxies

Single-run lab metrics (local machine). Not field CWV.

| Page | Baseline Perf / LCP / CLS | Optimized Perf / LCP / CLS |
|---|---|---|
| Home | 98 / ~2394 ms / 0 | 100 / ~755 ms / 0 |
| PLP | 95 / ~2484 ms / ~0.107 | 100 / ~903 ms / 0 |
| PDP | 89 / ~2555 ms / ~0.186 | 98 / ~2463 ms / 0 |

PLP/PDP CLS improvements align with removing late client-fetched content swaps.

### 7. AEO-oriented visible content (optimized only)

Full write-up: [`docs/aeo-optimization.md`](./aeo-optimization.md).

#### What changed on the page

Same catalog, prices, routes, and visual system as baseline. Optimized adds answer-oriented structure:

| Surface | Baseline | Optimized |
|---|---|---|
| PDP summary | Thin `shortDescription` after JS only | **At a glance** summary in initial HTML |
| PDP attributes | 3 specs / 2 highlights after JS | Full specs, highlights, sizes, SKU, material in HTML |
| PDP Q&A | Absent | **Common questions** with catalog-derived answers (no FAQPage schema) |
| PDP comparison | Related cards with weak “View” CTAs | Factual **How it compares** blurbs + descriptive links |
| PLP hub context | Filter chrome only in shell | Category guide + brand index links |
| Retailer entity | Minimal | Home “What Pacewright sells” + PDP “sold by Pacewright” |
| Fact consistency | N/A (facts often absent from HTML) | HTML facts aligned with Product JSON-LD via shared catalog helpers |

#### Why this is AEO-relevant

Answer-style systems need **groundable statements**: what the product is, price, availability, best-for use, sizes, and related alternatives. Baseline withheld those from the first HTML response; optimized publishes them as clear headings, summaries, and label/value pairs.

#### Established vs emerging

| Bucket | Examples in this project |
|---|---|
| Established SEO that also helps answers | SSR facts, H1/H2 structure, spec lists, descriptive links, canonicals, Product JSON-LD aligned to visible content |
| Emerging AEO presentation | Quotable summary block, visible Q&A, comparison blurbs, explicit entity wording |
| Not done / not claimed | FAQPage schema chase, `llms.txt`, chatbot, guaranteed AI Overview / ChatGPT / Perplexity citations |

#### How to verify AEO structure (not AI citations)

```bash
curl -s http://127.0.0.1:3010/shoes/aeropeak-vapor-stride \
  | rg "At a glance|Common questions|How .* compares|Nitrogen-infused|application/ld\\+json"
```

Evidence snapshot: `docs/evidence/optimized-checks.json` (`at_a_glance`, `common_questions`, `full_description_in_html`, `jsonld_types`).

**Important:** These checks validate answer-ready document structure. They do **not** prove that any AI product will cite Pacewright.

---

## Repeatable commands

### Optimized (current branch)

```bash
cd "/Users/balaguru/Projects/SEO Lab/seo-lab"
npm run build
npx next start --hostname 127.0.0.1 --port 3010

curl -s http://127.0.0.1:3010/shoes | rg "AeroPeak|canonical|ItemList"
curl -s http://127.0.0.1:3010/shoes/aeropeak-vapor-stride | rg "<title>|Nitrogen-infused|application/ld\+json|At a glance"
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3010/shoes/does-not-exist
curl -s http://127.0.0.1:3010/sitemap.xml | rg -c "<loc>"
curl -s http://127.0.0.1:3010/robots.txt
```

### Baseline

Checkout `baseline`, rebuild, repeat the same curls/Lighthouse flow on a free port, and compare against `docs/evidence/baseline-*`.

---

## Limitations

1. Local lab Lighthouse ≠ field CWV or Search Console data.  
2. Lighthouse SEO score parity (100 vs 100) can hide real technical gaps — use HTML inspection.  
3. INP not measured.  
4. Rich Results Test / Schema Validator not run in this pass.  
5. Indexing and AI-answer citation cannot be proven from localhost tests.  
6. Absolute canonical/sitemap URLs use `NEXT_PUBLIC_SITE_URL` / fallback `http://localhost:3000` until production env vars are set per deployment.

---

## Bottom line

Measured optimized wins are strongest in **initial HTML product discoverability**, **unique metadata/canonicals**, **sitemap/robots**, **real 404s**, **structured data presence**, **CLS on PLP/PDP**, and **AEO-oriented on-page facts**.  

Lighthouse SEO scores alone would have suggested “no difference.” That is an important engineering takeaway for the case study.

For the AEO narrative specifically, use [`docs/aeo-optimization.md`](./aeo-optimization.md) — it documents goals, implementation, established vs emerging practices, consistency rules, evaluation methods, and non-claims in depth.
