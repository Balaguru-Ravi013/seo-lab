import { absoluteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import type { Product } from "@/types/product";

function availabilityUrl(availability: Product["availability"]): string {
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
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    color: product.color,
    material: product.material,
    category: product.category,
    image: product.images.map((image) => absoluteUrl(image.src)),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shoes/${product.slug}`),
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: availabilityUrl(product.availability),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function itemListJsonLd(
  products: Product[],
  options?: { name?: string; path?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options?.name ?? "Running shoes",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/shoes/${product.slug}`),
      name: product.name,
    })),
  };
}
