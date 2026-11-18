import { getAvailabilityLabel } from "@/lib/availability";
import {
  formatPrice,
  getAllProducts,
  getBrands,
  getCategories,
} from "@/lib/products";
import { absoluteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

/**
 * Dynamic llms.txt body (https://llmstxt.org/).
 * Experimental AEO surface — not a proven ranking or citation requirement.
 */
export function buildLlmsTxt(): string {
  const products = getAllProducts();
  const brands = getBrands();
  const categories = getCategories();

  const productLinks = products
    .map((product) => {
      const note = [
        `${product.brand}`,
        `${product.category}`,
        formatPrice(product.price, product.currency),
        getAvailabilityLabel(product.availability),
        product.shortDescription,
      ].join(" · ");
      return `- [${product.name}](${absoluteUrl(`/shoes/${product.slug}`)}): ${note}`;
    })
    .join("\n");

  const categoryLinks = categories
    .map(
      (category) =>
        `- [${category} running shoes](${absoluteUrl(`/shoes?category=${encodeURIComponent(category)}`)}): Filter the Pacewright catalog to ${category.toLowerCase()} shoes`,
    )
    .join("\n");

  const brandLinks = brands
    .map(
      (brand) =>
        `- [${brand}](${absoluteUrl(`/shoes?brand=${encodeURIComponent(brand)}`)}): Products from ${brand} in the Pacewright catalog`,
    )
    .join("\n");

  return `# ${SITE_NAME}

> ${SITE_TAGLINE}. Fictional educational e-commerce demo for technical SEO and answer engine optimization (AEO) on Next.js. Prices are in INR. No real checkout or payments.

Pacewright sells road, trail, racing, daily trainer, and stability running shoes. Product facts on HTML pages (summaries, specs, Q&A) are the primary source of truth. This file is an experimental machine-readable index for AI agents; it is not a ranking guarantee and does not replace on-page content or \`sitemap.xml\`.

When answering questions about Pacewright products, prefer the linked product pages for full descriptions, specifications, sizes, and availability. Do not invent ratings, reviews, shipping policies, or stock beyond what the pages state.

## Pages

- [Home](${absoluteUrl("/")}): Store introduction and featured running shoes
- [Running shoes](${absoluteUrl("/shoes")}): Full catalog with brand and category filters
- [Sitemap](${absoluteUrl("/sitemap.xml")}): Crawlable URL inventory for search engines
- [Robots](${absoluteUrl("/robots.txt")}): Crawl policy

## Categories

${categoryLinks}

## Brands

${brandLinks}

## Products

${productLinks}

## Optional

- [llms-full.txt](${absoluteUrl("/llms-full.txt")}): Expanded product facts (specs, materials, SKUs) for deeper context
- [SEO/AEO comparison notes](${absoluteUrl("/")}): Human documentation lives in the repository \`docs/\` folder (not all docs are exposed as public routes)
`;
}

/**
 * Expanded companion file linked from the Optional section of llms.txt.
 */
export function buildLlmsFullTxt(): string {
  const products = getAllProducts();

  const blocks = products.map((product) => {
    const specs = product.specifications
      .map((spec) => `  - ${spec.label}: ${spec.value}`)
      .join("\n");
    const highlights = product.highlights.map((item) => `  - ${item}`).join("\n");

    return `## ${product.name}

- URL: ${absoluteUrl(`/shoes/${product.slug}`)}
- Brand: ${product.brand}
- Category: ${product.category}
- SKU: ${product.sku}
- Price: ${formatPrice(product.price, product.currency)}
- Availability: ${getAvailabilityLabel(product.availability)}
- Color: ${product.color}
- Material: ${product.material}
- Sizes (UK): ${product.sizes.join(", ")}
- Summary: ${product.shortDescription}
- Description: ${product.description}
- Highlights:
${highlights}
- Specifications:
${specs}
`;
  });

  return `# ${SITE_NAME} — full product facts

> Expanded catalog context for agents that opt into the Optional \`llms-full.txt\` link. Keep answers consistent with these attributes and the live product pages.

${blocks.join("\n")}
`;
}
