import { getProductBySlug } from "@/lib/products";
import { absoluteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import type { Availability, Product } from "@/types/product";

function availabilityUrl(availability: Availability): string {
  switch (availability) {
    case "InStock":
      return "https://schema.org/InStock";
    case "OutOfStock":
      return "https://schema.org/OutOfStock";
    case "PreOrder":
      return "https://schema.org/PreOrder";
    default:
      return "https://schema.org/InStock";
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE,
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
  };
}

export function itemListJsonLd(
  products: Product[],
  options?: { name?: string; path?: string },
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl(options?.path ?? "/shoes")}#itemlist`,
        name: options?.name ?? "Running shoes",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/shoes/${product.slug}`),
          name: product.name,
        })),
      },
    ],
  };
}

/**
 * PDP JSON-LD: BreadcrumbList + Product/Offer in one @graph.
 *
 * Intentionally includes only facts visible on the page.
 * Omits aggregateRating, review, shippingDetails, and return policies —
 * inventing those would be inappropriate for this demo catalog.
 */
export function productPageJsonLd(product: Product) {
  const productPath = `/shoes/${product.slug}`;
  const productUrl = absoluteUrl(productPath);
  const organizationId = `${absoluteUrl("/")}#organization`;
  const productId = `${productUrl}#product`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Running shoes",
            item: absoluteUrl("/shoes"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": productId,
        name: product.name,
        description: product.description,
        sku: product.sku,
        mpn: product.sku,
        url: productUrl,
        image: product.images.map((image) => absoluteUrl(image.src)),
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        category: `${product.category} running shoes`,
        color: product.color,
        material: product.material,
        size: product.sizes.map((size) => `UK ${size}`).join(", "),
        additionalProperty: [
          ...product.specifications.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
          {
            "@type": "PropertyValue",
            name: "Highlights",
            value: product.highlights.join("; "),
          },
        ],
        offers: {
          "@type": "Offer",
          "@id": `${productUrl}#offer`,
          url: productUrl,
          priceCurrency: product.currency,
          price: product.price.toFixed(2),
          availability: availabilityUrl(product.availability),
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            "@id": organizationId,
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
        },
        isRelatedTo: product.relatedSlugs
          .map((slug) => getProductBySlug(slug))
          .filter((related): related is Product => related !== undefined)
          .map((related) => ({
            "@type": "Product",
            "@id": `${absoluteUrl(`/shoes/${related.slug}`)}#product`,
            url: absoluteUrl(`/shoes/${related.slug}`),
            name: related.name,
            brand: {
              "@type": "Brand",
              name: related.brand,
            },
          })),
      },
    ],
  };
}
