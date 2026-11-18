import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shoes/ProductDetail";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { buildProductMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Rendering strategy:
 * - Fixed local catalog → generateStaticParams prerenders each PDP shell/content
 * - Product facts are rendered in Server Components so they appear in initial HTML
 * - Client islands are limited to gallery switching and size selection
 */
export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <ProductDetail product={product} />
    </main>
  );
}
