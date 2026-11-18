"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types/product";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-[#eeeae3]">
        <Image
          src={active.src}
          alt={active.alt || `${productName} product image`}
          className="aspect-[4/3] w-full object-cover"
          width={active.width}
          height={active.height}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 ? (
        <ul className="flex gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${productName}`}
                aria-pressed={activeIndex === index}
                className={`overflow-hidden rounded-lg border ${
                  activeIndex === index ? "border-accent" : "border-border"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="h-20 w-28 object-cover"
                  width={112}
                  height={80}
                  sizes="112px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
