"use client";

import { useState } from "react";

export function SizeOptions({ sizes }: { sizes: string[] }) {
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium">Available sizes (UK)</h2>
      <ul className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const selected = selectedSize === size;
          return (
            <li key={size}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedSize(size)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface"
                }`}
              >
                UK {size}
              </button>
            </li>
          );
        })}
      </ul>
      {selectedSize ? (
        <p className="text-sm text-muted">Selected size: UK {selectedSize}</p>
      ) : null}
    </div>
  );
}
