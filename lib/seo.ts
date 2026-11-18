import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

export const SITE_NAME = "Pacewright";
export const SITE_TAGLINE = "Running shoes for road, trail, and race day";

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? "/images/products/aeropeak-vapor-stride-primary.svg");

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 900,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const description = `${product.shortDescription} Priced at ${product.price.toLocaleString("en-IN")} ${product.currency}.`;

  return buildPageMetadata({
    title: `${product.name} by ${product.brand}`,
    description,
    path: `/shoes/${product.slug}`,
    image: product.images[0]?.src,
  });
}
