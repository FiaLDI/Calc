import { describe, expect, it } from "vitest";

import {
  mapOffCategory,
  mapOffProductToDto,
  type OffProductRecord,
} from "./off.mapper.js";

describe("mapOffCategory", () => {
  it("maps dairy tags to Молочные", () => {
    expect(mapOffCategory(["en:yogurts", "en:desserts"])).toBe("Молочные");
  });

  it("falls back to Другое", () => {
    expect(mapOffCategory(["en:beverages"])).toBe("Другое");
  });
});

describe("mapOffProductToDto", () => {
  const nutella: OffProductRecord = {
    categories_tags: ["en:spreads", "en:sweet-spreads"],
    code: "3017620422003",
    image_front_small_url:
      "https://images.openfoodfacts.org/images/products/front.jpg",
    last_modified_t: 1_700_000_000,
    nutriments: {
      carbohydrates_100g: 57.5,
      "energy-kcal_100g": 539,
      fat_100g: 30.9,
      proteins_100g: 6.3,
    },
    product_name: "Nutella",
  };

  it("maps nutriments and builds off:id", () => {
    const dto = mapOffProductToDto(nutella, "Open Food Facts");

    expect(dto).toMatchObject({
      amountUnit: "г",
      amountValue: 100,
      calories: 539,
      carbs: 57.5,
      category: "Орехи и пасты",
      fat: 30.9,
      id: "off:3017620422003",
      isReadonly: true,
      name: "Nutella",
      protein: 6.3,
      sourceKey: "off",
      sourceLabel: "Open Food Facts",
      visibility: "public",
    });
  });

  it("prefers Russian product name", () => {
    const dto = mapOffProductToDto(
      { ...nutella, product_name_ru: "Нутелла" },
      "Open Food Facts"
    );
    expect(dto?.name).toBe("Нутелла");
  });

  it("returns null without code or name", () => {
    expect(mapOffProductToDto({ code: "1" }, "Open Food Facts")).toBeNull();
    expect(
      mapOffProductToDto({ product_name: "X" }, "Open Food Facts")
    ).toBeNull();
  });
});
