import type { ProductSourceMeta } from "./products.types.js";

export const PRODUCT_SOURCE_META: ProductSourceMeta[] = [
  {
    description: "User-created products.",
    key: "custom",
    label: "Custom products",
  },
  {
    description: "Warehouse catalog with staple grocery items.",
    key: "warehouse",
    label: "Warehouse DB",
  },
  {
    description: "External nutrition catalog synced from partner data.",
    key: "catalog",
    label: "Catalog DB",
  },
  {
    description: "Prepared meal base with full ready-to-eat dishes.",
    key: "recipes",
    label: "Recipe DB",
  },
];

export const getProductSourceMeta = (sourceKey: string): ProductSourceMeta => {
  const meta = PRODUCT_SOURCE_META.find((source) => source.key === sourceKey);

  return (
    meta || {
      description: "",
      key: sourceKey,
      label: sourceKey,
    }
  );
};
