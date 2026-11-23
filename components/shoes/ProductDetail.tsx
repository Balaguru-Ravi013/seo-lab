import Link from "next/link";
import { ProductBreadcrumbs } from "@/components/product/ProductBreadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductComparison } from "@/components/product/ProductComparison";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductQuestions } from "@/components/product/ProductQuestions";
import { ProductSummary } from "@/components/product/ProductSummary";
import { SizeOptions } from "@/components/product/SizeOptions";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getComparisonPoints,
  getProductKeyFacts,
  getProductQuestions,
  getProductSummary,
} from "@/lib/aeo";
import { getAvailabilityLabel } from "@/lib/availability";
import { productPageJsonLd } from "@/lib/jsonld";
import { formatPrice, getRelatedProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export function ProductDetail({ product }: { product: Product }) {
  const summary = getProductSummary(product);
  const facts = getProductKeyFacts(product);
  const questions = getProductQuestions(product);
  const comparisons = getComparisonPoints(product);

  const related = getRelatedProducts(product.slug).map((item) => ({
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    priceLabel: formatPrice(item.price, item.currency),
    image: item.images[0],
    availabilityLabel: getAvailabilityLabel(item.availability),
  }));

  return (
    <article className="space-y-10">
      <ProductBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Running shoes", href: "/shoes" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-5">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-muted">
              <Link
                href={`/shoes?brand=${encodeURIComponent(product.brand)}`}
                className="hover:text-accent"
              >
                {product.brand}
              </Link>
              {" · "}
              <Link
                href={`/shoes?category=${encodeURIComponent(product.category)}`}
                className="hover:text-accent"
              >
                {product.category}
              </Link>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-xl">{formatPrice(product.price, product.currency)}</p>
            <p className="text-sm text-muted">
              {getAvailabilityLabel(product.availability)} · SKU {product.sku}
            </p>
          </header>

          <ProductSummary summary={summary} facts={facts} />

          <section className="space-y-2" aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-sm font-medium">
              Product description
            </h2>
            <p className="text-muted">{product.description}</p>
          </section>

          <SizeOptions sizes={product.sizes} />

          <section className="space-y-2" aria-labelledby="highlights-heading">
            <h2 id="highlights-heading" className="text-sm font-medium">
              Product highlights
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-sm font-medium">
              Specifications
            </h2>
            <dl className="grid gap-2 text-sm text-muted sm:grid-cols-2">
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt className="font-medium text-foreground">{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
              <div>
                <dt className="font-medium text-foreground">Color</dt>
                <dd>{product.color}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Category</dt>
                <dd>{product.category}</dd>
              </div>
            </dl>
          </section>

          <p className="text-sm text-muted">
            Sold by{" "}
            <Link href="/" className="text-accent hover:underline">
              Pacewright
            </Link>
            . Browse more from{" "}
            <Link
              href={`/shoes?brand=${encodeURIComponent(product.brand)}`}
              className="text-accent hover:underline"
            >
              {product.brand}
            </Link>{" "}
            or explore the full{" "}
            <Link href="/shoes" className="text-accent hover:underline">
              running shoes catalog
            </Link>
            .
          </p>
        </div>
      </div>

      <ProductQuestions questions={questions} />

      <ProductComparison product={product} comparisons={comparisons} />

      {related.length > 0 ? (
        <section className="space-y-4" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-semibold">
            Related running shoes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
          <p>
            <Link href="/shoes" className="text-accent hover:underline">
              Browse all running shoes
            </Link>
          </p>
        </section>
      ) : null}

      <JsonLd data={productPageJsonLd(product)} />
    </article>
  );
}
