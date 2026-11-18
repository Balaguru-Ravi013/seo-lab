# AEO optimization — Pacewright (`seo-aeo-optimized`)

**Project:** Storefront SEO Lab  
**Scope:** Answer Engine Optimization as practiced in this demo  
**Related docs:** `docs/baseline-audit.md`, `docs/seo-aeo-comparison.md`

---

## 1. What “AEO” means here

In this project, **AEO (Answer Engine Optimization)** means structuring product pages so that traditional crawlers **and** AI-assisted answer systems can more reliably extract **accurate, consistent product facts**.

It does **not** mean:

- embedding a chatbot
- calling an LLM API
- guaranteeing citations in Google AI Overviews, ChatGPT, Perplexity, or similar products
- treating `llms.txt` as a proven ranking requirement
- adding FAQPage schema only to chase rich results

AEO in this lab builds on technical SEO. If product facts are missing from the initial HTML (baseline PLP/PDP), answer systems that rely on fetched page content have little trustworthy material to quote. Phase 4 fixed crawlability; Phase 5 improved **how** those facts are presented.

---

## 2. Problem the baseline created for answers

On `baseline`, a non-JS fetch of a product URL returned a shell without:

- product name
- price
- description
- specifications
- availability

The UI only filled those fields after `fetch('/api/products/[slug]')` in the browser.

**AEO consequence:** any consumer that reads the first HTML response (many crawlers, some extractors, offline parsers) cannot answer basic questions such as:

- What is this product?
- How much does it cost?
- What is it best for?
- What sizes exist?

Even after JavaScript ran, baseline PDP copy was intentionally thin (`shortDescription`, two highlights, three specs), which further limited extractable facts.

---

## 3. AEO goals for the optimized branch

| Goal | Intent |
|---|---|
| Facts in initial HTML | Answers can be grounded in the document itself |
| One clear summary | A short, quotable “what is this?” block |
| Machine-readable key facts | Label/value pairs for price, brand, specs, sizes |
| Question-shaped content | Match common shopping questions without keyword stuffing |
| Entity clarity | Brand, category, retailer, and product relationships are explicit |
| Consistency | Visible HTML facts match Product JSON-LD where schema is used |
| Honest comparison copy | Related products compared using catalog attributes only |
| No invented trust signals | No fake ratings, reviews, shipping, or return policies |

---

## 4. Implementation map

### 4.1 Code modules

| File | Role |
|---|---|
| `lib/aeo.ts` | Deterministic summary, key facts, Q&A, comparison points, category guide copy |
| `components/product/ProductSummary.tsx` | “At a glance” summary + fact grid |
| `components/product/ProductQuestions.tsx` | Visible Q&A sections (no FAQPage JSON-LD) |
| `components/product/ProductComparison.tsx` | Related-product comparison blurbs + descriptive links |
| `components/shoes/ProductDetail.tsx` | Assembles AEO sections into the PDP |
| `app/shoes/page.tsx` | Category guide + brand index for entity/hub clarity |
| `app/page.tsx` | Retailer entity blurb (“What Pacewright sells”) |
| `lib/jsonld.ts` → `productPageJsonLd()` | Product/Breadcrumb graph aligned to on-page facts |

All AEO strings are derived from `data/products.ts`. Nothing is free-typed per page in a way that can drift from the catalog.

### 4.2 PDP content order (optimized)

1. Breadcrumbs (Home → Running shoes → Product)
2. Gallery
3. Brand / category links (entities)
4. H1 product name, price, availability, SKU
5. **At a glance** — summary paragraph + key fact grid
6. **Product description** — full catalog description
7. Sizes
8. Highlights
9. Specifications (`<dl>` of label/value pairs)
10. Retailer / brand / catalog internal links
11. **Common questions** — question headings + factual answers
12. **How it compares** — related products with price/category contrasts
13. Related product cards
14. JSON-LD (`BreadcrumbList` + `Product`)

### 4.3 Example: AeroPeak Vapor Stride

**Summary pattern** (from `getProductSummary`):

> `{Name} is a {category} running shoe from {brand}. {shortDescription} It is priced at {price}, currently {availability}, and sold by Pacewright. Best for …, weighs …, has a … drop.`

**Questions generated** (from `getProductQuestions`):

| Question shape | Answer source |
|---|---|
| What is the {name}? | brand + category + shortDescription |
| How much does it cost? | price + currency + availability |
| What is it best for? | specification `Best for` |
| What sizes are available? | `sizes[]` as UK sizes |
| What are the key specs? | drop, weight, surface, material |

**Comparison points** (from `getComparisonPoints`):

- Pull related slugs from the product record
- State category/brand/price from those related products
- Link with descriptive anchors (`Compare details for {name}`)

---

## 5. Established SEO vs emerging AEO

This distinction matters for portfolio honesty.

### 5.1 Established technical / content SEO

These are long-standing practices that also help answer extraction:

| Practice | Why it helps answers |
|---|---|
| Server-rendered product facts | Facts exist in the document, not only after JS |
| One H1, logical H2/H3 | Clear topical boundaries for extractors |
| Spec tables / definition lists | Explicit attribute pairs (price, drop, weight) |
| Descriptive internal links | Brand/category/product relationships are crawlable |
| Unique titles and meta descriptions | Clear page intent for classic search |
| Canonical URLs | Prefer one URL for the product entity |
| Product JSON-LD aligned to visible facts | Structured attributes for supporting parsers |
| Real 404 for unknown products | Avoid soft-404 “empty product” documents |
| Descriptive image alt text | Additional factual context for the product |

### 5.2 Emerging / experimental AEO-oriented practices

These are increasingly discussed for AI answer surfaces. Evidence that they improve citations is **limited and not measured in this lab**:

| Practice | What we did | What we did *not* claim |
|---|---|---|
| Quotable product summary block | “At a glance” paragraph | Guaranteed featured-snippet or AI Overview use |
| Question-and-answer sections | Visible HTML Q&A | Ranking boost from FAQPage rich results |
| FAQPage schema | **Not implemented** | — |
| Comparison-oriented sections | Related product contrasts from real attributes | That answer engines will prefer our comparisons |
| Strong entity wording (brand, retailer, category) | Explicit Pacewright / brand / category links | Knowledge Graph inclusion |
| `llms.txt` / `llms-full.txt` | Dynamic routes from catalog | That this is required for AI search/rankings |
| Prompt-targeted keyword stuffing | Avoided | — |

### 5.3 Deliberate non-goals

| Non-goal | Reason |
|---|---|
| Invented star ratings / review counts | False trust signals; schema spam risk |
| Fake shipping / return JSON-LD | Incomplete merchant data would be inappropriate |
| Chat widget / AI API | Out of scope; not AEO as defined here |
| Claiming “optimized for ChatGPT/Perplexity” | Cannot be proven from local tests |

---

## 6. Consistency model (HTML ↔ JSON-LD)

Answer quality collapses when the page says one price and schema says another. Optimized PDP keeps a single source of truth: `Product` in `data/products.ts`.

| Fact | Visible where | JSON-LD field |
|---|---|---|
| Name | H1, summary, questions | `Product.name` |
| Description | Product description section | `Product.description` (full description) |
| Brand | Header link + facts | `Product.brand` |
| Price / currency | Price line + questions + facts | `Offer.price` / `priceCurrency` |
| Availability | Status line + questions | `Offer.availability` |
| SKU | Under price + facts | `Product.sku` / `mpn` |
| Specs | Spec `<dl>` + fact grid + Q&A | `additionalProperty` |
| Sizes | Size controls + facts + Q&A | `Product.size` |
| Related products | Comparison + cards | `isRelatedTo` |

If catalog data changes, summaries/Q&A/schema regenerate from the same helpers—no hand-maintained duplicate copy.

---

## 7. Baseline vs optimized — AEO lens

| AEO-relevant capability | Baseline | Optimized |
|---|---|---|
| Product facts in first HTML | No (client fetch) | Yes |
| Concise product summary | No | Yes — At a glance |
| Key attribute grid | Partial/thin after JS | Yes — full facts from catalog |
| Question-shaped answers | No | Yes — Common questions |
| Comparison context | Related cards only, weak anchors | Cards + factual comparison blurbs |
| Brand/category entity links | Weak / generic “View” | Explicit brand, category, catalog links |
| Retailer entity statement | Minimal footer | Home + PDP “sold by Pacewright” |
| Schema support for product entity | None | Product + BreadcrumbList |
| Depth of PDP copy | Thin display fields | Full description + highlights + specs |
| Risk of contradictory facts | Lower (thin) but incomplete | Controlled via shared helpers |

**Measured HTML evidence (optimized PDP sample):** initial response included product name, full description markers (e.g. `Nitrogen-infused`), `At a glance`, and `Common questions` (`docs/evidence/optimized-checks.json`).

---

## 8. How to evaluate AEO work (without inventing AI wins)

Use checks that are reproducible. Do not treat “sounds good for AI” as proof.

### 8.1 Document-level checks (required)

```bash
# Facts present without JS
curl -s http://localhost:3000/shoes/aeropeak-vapor-stride \
  | rg "At a glance|Common questions|Nitrogen-infused|AeroPeak Vapor Stride|application/ld\\+json"

# PLP also exposes names in HTML
curl -s http://localhost:3000/shoes | rg "AeroPeak Vapor Stride|ItemList"
```

Ask of the HTML:

1. Can I answer “what is it?” from the summary alone?
2. Can I answer “how much?” with currency?
3. Can I answer “best for?” from specs or Q&A?
4. Do Q&A answers match the fact grid and schema?
5. Are brand/category/retailer named explicitly?

### 8.2 Manual answer-engine checks (optional, post-deploy only)

After public deployment (Phase 7):

1. Ask the same factual questions in multiple tools (Search, AI Overview if shown, ChatGPT browsing if available, Perplexity).
2. Record whether the answer is correct, partial, wrong, or absent.
3. Record whether Pacewright is cited.
4. Label results as **observational**, single-session, non-statistical.

This lab does **not** include those observational results yet.

### 8.3 What Lighthouse cannot tell you about AEO

Lighthouse SEO scored **100** on both baseline and optimized PDPs in local runs. That score does not measure:

- answerability of content
- summary quality
- Q&A usefulness
- entity clarity
- schema/product fact alignment beyond basic page signals

Use HTML inspection and the comparison doc, not Lighthouse SEO alone.

---

## 9. Trade-offs and visible content deltas

Optimized PDPs are longer than baseline PDPs because they add:

- At a glance
- Common questions
- How it compares

That is an intentional **content delta** for AEO/SEO clarity. Visual design, routes, prices, and catalog identities remain shared with baseline.

Trade-offs:

| Upside | Downside |
|---|---|
| More extractable facts | Longer pages / more DOM |
| Clearer shopping answers | More authoring rules (must stay catalog-driven) |
| Better internal entity graph | Comparison sections need trustworthy related products |

---

## 10. Engineering takeaways

1. **AEO depends on crawlable facts first.** Thin client-rendered shells fail both classic SEO and answer extraction.
2. **Generate answer content from the catalog**, don’t hand-write conflicting blurbs.
3. **Prefer visible Q&A over FAQPage schema chasing** when you cannot honestly support rich-result eligibility.
4. **Separate established SEO from emerging AEO claims** in documentation—especially for portfolio work.
5. **Lighthouse SEO will not grade AEO.** Build evidence from HTML and, later, careful live observations.

---

## 11. Experimental `llms.txt` (dynamic)

Pacewright exposes:

| URL | Purpose |
|---|---|
| `/llms.txt` | Spec-shaped Markdown index (H1, summary blockquote, Pages / Categories / Brands / Products, Optional) |
| `/llms-full.txt` | Expanded product attributes for agents that follow the Optional link |

Implementation:

- `lib/llms-txt.ts` — builds both bodies from `data/products.ts`
- `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` — `text/plain; charset=utf-8`

Dynamic generation keeps product links/prices/availability aligned with the HTML catalog. Absolute URLs use `getSiteUrl()` / `NEXT_PUBLIC_SITE_URL`, same as sitemap/canonicals.

**Honesty note:** `llms.txt` is an emerging proposal ([llmstxt.org](https://llmstxt.org/)). Presence does not prove crawler adoption or citation improvements. On-page SSR facts remain the primary AEO investment.

Verify:

```bash
curl -s http://localhost:3000/llms.txt | head -n 40
curl -s http://localhost:3000/llms-full.txt | head -n 40
```

## 12. Follow-ups (optional)

- After dual Vercel deploys, run Schema Markup Validator on one PDP and attach screenshots to `docs/evidence/`.
- Add a short observational log template for AI-answer checks (date, tool, query, cited?, accuracy).
- If merchant fields become real (shipping/returns), reconsider richer Offer markup—still without inventing data.
