import type { Availability } from "@/types/product";

export function getAvailabilityLabel(availability: Availability): string {
  switch (availability) {
    case "InStock":
      return "In stock";
    case "OutOfStock":
      return "Out of stock";
    case "PreOrder":
      return "Pre-order";
    default:
      return availability;
  }
}
