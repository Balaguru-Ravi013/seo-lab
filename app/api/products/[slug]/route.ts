import { getAvailabilityLabel } from "@/lib/availability";
import { formatPrice, getProductBySlug, getRelatedProducts } from "@/lib/products";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * Baseline PDP API.
 * Product detail pages load this payload in the browser after mount.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const related = getRelatedProducts(slug).map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    priceLabel: formatPrice(item.price, item.currency),
    image: item.images[0],
    availabilityLabel: getAvailabilityLabel(item.availability),
  }));

  return Response.json({
    product: {
      ...product,
      priceLabel: formatPrice(product.price, product.currency),
      availabilityLabel: getAvailabilityLabel(product.availability),
      // Baseline intentionally returns thin copy for the primary description field.
      displayDescription: product.shortDescription,
      displayHighlights: product.highlights.slice(0, 2),
      displaySpecs: product.specifications.slice(0, 3),
    },
    related,
  });
}
