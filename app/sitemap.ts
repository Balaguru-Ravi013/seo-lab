import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const productEntries = getAllProducts().map((product) => ({
    url: absoluteUrl(`/shoes/${product.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/shoes"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productEntries,
  ];
}
