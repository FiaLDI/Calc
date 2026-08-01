import type { ProductSourceMeta } from "./products.types.js";

export const PRODUCT_SOURCE_META: ProductSourceMeta[] = [
  {
    description: "User-created products.",
    key: "custom",
    label: "Custom products",
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
