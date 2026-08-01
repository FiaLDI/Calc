import type { ProductSourceMeta } from "./products.types.js";

export const CUSTOM_SOURCE_KEY = "custom";
export const OPEN_FOOD_FACTS_SOURCE_KEY = "off";

export const PRODUCT_SOURCE_META: ProductSourceMeta[] = [
  {
    description: "User-created products.",
    key: CUSTOM_SOURCE_KEY,
    label: "Мои продукты",
  },
  {
    description: "Open Food Facts public food database.",
    key: OPEN_FOOD_FACTS_SOURCE_KEY,
    label: "Open Food Facts",
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
