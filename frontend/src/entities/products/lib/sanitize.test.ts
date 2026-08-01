import { describe, expect, it } from "vitest";

import { sanitizeProduct } from "./sanitize";

describe("sanitizeProduct", () => {
  it("returns null without a name", () => {
    expect(sanitizeProduct({})).toBeNull();
    expect(sanitizeProduct(null)).toBeNull();
  });

  it("applies defaults for category, unit and visibility", () => {
    const product = sanitizeProduct({
      name: "  Custom Bar  ",
      calories: 200,
    });

    expect(product).toMatchObject({
      name: "Custom Bar",
      category: "Другое",
      amountUnit: "г",
      amountValue: 100,
      calories: 200,
      protein: 0,
      sourceKey: "custom",
      visibility: "private",
      isReadonly: false,
    });
    expect(product?.id).toBeTruthy();
  });

  it("forces public visibility for readonly products", () => {
    const product = sanitizeProduct({
      name: "Banana",
      isReadonly: true,
      visibility: "private",
      category: "Фрукты",
      amountUnit: "г",
    });

    expect(product).toMatchObject({
      visibility: "public",
      isReadonly: true,
      category: "Фрукты",
    });
  });
});
