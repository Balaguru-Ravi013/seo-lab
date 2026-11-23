import { getAvailabilityLabel } from "@/lib/availability";
import { formatPrice, getProductBySlug } from "@/lib/products";
import type { Product } from "@/types/product";

export interface ProductFact {
  label: string;
  value: string;
}

export interface ProductQuestion {
  question: string;
  answer: string;
  format?: "paragraph" | "list" | "steps";
  items?: string[];
}

function specValue(product: Product, label: string): string | undefined {
  return product.specifications.find((spec) => spec.label === label)?.value;
}

/**
 * Concise factual summary for answer-style extraction.
 * Values are derived only from the local product record.
 */
export function getProductSummary(product: Product): string {
  const bestFor = specValue(product, "Best for");
  const weight = specValue(product, "Weight");
  const drop = specValue(product, "Drop");

  const details = [
    bestFor ? `Best for ${bestFor.toLowerCase()}` : null,
    weight ? `weighs ${weight}` : null,
    drop ? `has a ${drop} drop` : null,
  ].filter(Boolean);

  const detailSentence =
    details.length > 0 ? ` ${details.join(", ")}.` : "";

  return `${product.name} is a ${product.category.toLowerCase()} running shoe from ${product.brand}. ${product.shortDescription} It is priced at ${formatPrice(product.price, product.currency)}, currently ${getAvailabilityLabel(product.availability).toLowerCase()}, and sold by Pacewright.${detailSentence}`;
}

export function getProductKeyFacts(product: Product): ProductFact[] {
  return [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Price", value: formatPrice(product.price, product.currency) },
    { label: "Availability", value: getAvailabilityLabel(product.availability) },
    { label: "SKU", value: product.sku },
    { label: "Color", value: product.color },
    { label: "Material", value: product.material },
    { label: "Sizes", value: `UK ${product.sizes.join(", ")}` },
    ...product.specifications.map((spec) => ({
      label: spec.label,
      value: spec.value,
    })),
  ];
}

/** Visible, catalog-grounded Q&A with stand-alone, extractable answers. */
export function getProductQuestions(product: Product): ProductQuestion[] {
  const bestFor = specValue(product, "Best for") ?? `${product.category.toLowerCase()} running`;
  const weight = specValue(product, "Weight");
  const drop = specValue(product, "Drop");
  const surface = specValue(product, "Surface");

  const questions: ProductQuestion[] = [
    {
      question: `What is the ${product.name}?`,
      answer: `${product.name} is a ${product.brand} ${product.category.toLowerCase()} running shoe designed for ${bestFor.toLowerCase()}. ${product.shortDescription} Its ${product.material.toLowerCase()}, ${product.highlights[0]?.toLowerCase() ?? "purpose-built construction"}, and ${weight ? `${weight} weight` : "purpose-built design"} support that intended use.`,
    },
    {
      question: `How much does the ${product.name} cost?`,
      answer: `The ${product.name} costs ${formatPrice(product.price, product.currency)} at Pacewright and is currently ${getAvailabilityLabel(product.availability).toLowerCase()}. The listed price applies to this ${product.brand} ${product.category.toLowerCase()} shoe in ${product.color}; choose a listed UK size on the product page before making a purchase decision.`,
    },
    {
      question: `What is the ${product.name} best for?`,
      answer: `The ${product.name} is best for ${bestFor.toLowerCase()}. Its ${product.highlights.slice(0, 2).join(" and ").toLowerCase()} pair with a ${drop ?? "purpose-built"} platform to suit that use case, rather than positioning it as a general-purpose option for every type of running.`,
    },
    {
      question: `What sizes does the ${product.name} come in?`,
      answer: `The ${product.name} is offered in UK sizes ${product.sizes.join(", ")}. Availability shown on the page refers to the product overall, so choose the UK size you need in the size selector and confirm its current availability before completing a purchase.`,
    },
  ];

  if (weight || drop) {
    questions.push({
      question: `What are the key specs of the ${product.name}?`,
      answer: `The key specifications are listed below. Together, these catalog attributes describe the ${product.name}’s geometry, weight, intended terrain, and upper construction; use them to compare it consistently with other running shoes in the Pacewright catalog.`,
      format: "list",
      items: [
        drop ? `Drop: ${drop}` : null,
        weight ? `Weight: ${weight}` : null,
        surface ? `Surface: ${surface}` : null,
        `Material: ${product.material}`,
      ].filter((item): item is string => item !== null),
    });
  }

  questions.push({
    question: `How do you use the ${product.name} step by step?`,
    answer: `Use the ${product.name} by selecting the appropriate UK size, fitting it securely, and taking it onto the terrain it was designed for: ${bestFor.toLowerCase()}. Check the product’s listed features and condition before each run, especially when the route is wet, loose, or uneven.`,
    format: "steps",
    items: [
      `Choose your UK size from ${product.sizes.join(", ")}.`,
      "Fit the shoe securely before starting your run.",
      `Use it for ${bestFor.toLowerCase()}.`,
      "Review the outsole and upper after use, particularly on rough terrain.",
    ],
  });

  questions.push({
    question: `What is the difference between the ${product.name} and traditional alternatives?`,
    answer: `The ${product.name} is a ${product.category.toLowerCase()} running shoe built for ${bestFor.toLowerCase()}, with ${product.highlights.slice(0, 2).join(" and ").toLowerCase()}. Compared with a traditional road-focused shoe, it prioritizes the catalogued features needed for its intended terrain; compare the specifications, price, and category before choosing.`,
  });

  return questions;
}

export interface ComparisonPoint {
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceLabel: string;
  bestFor: string;
  summary: string;
}

export function getComparisonPoints(product: Product): ComparisonPoint[] {
  return product.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((related): related is Product => related !== undefined)
    .map((related) => {
      const relatedBestFor = specValue(related, "Best for");
      const contrast =
        related.category === product.category
          ? `Also a ${related.category.toLowerCase()} option from ${related.brand}, priced at ${formatPrice(related.price, related.currency)}.`
          : `A ${related.category.toLowerCase()} alternative from ${related.brand}, priced at ${formatPrice(related.price, related.currency)}.`;

      return {
        slug: related.slug,
        name: related.name,
        brand: related.brand,
        category: related.category,
        priceLabel: formatPrice(related.price, related.currency),
        bestFor: relatedBestFor ?? "Not specified",
        summary: `${contrast}${relatedBestFor ? ` Best for ${relatedBestFor.toLowerCase()}.` : ""}`,
      };
    });
}

export const CATEGORY_GUIDE: Array<{ category: string; summary: string }> = [
  {
    category: "Road",
    summary: "Road shoes favor paved surfaces, daily mileage, and tempo work.",
  },
  {
    category: "Trail",
    summary: "Trail shoes add lug traction and protection for dirt, rock, and mixed paths.",
  },
  {
    category: "Racing",
    summary: "Racing shoes prioritize low weight and responsive geometry for race-day efforts.",
  },
  {
    category: "Daily Trainer",
    summary: "Daily trainers emphasize cushioning and durability for high-mileage easy runs.",
  },
  {
    category: "Stability",
    summary: "Stability shoes provide guided support for runners who want a more controlled ride.",
  },
];
