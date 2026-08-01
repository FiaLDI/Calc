import { describe, expect, it } from "vitest";

import { HttpError } from "../../../shared/http/http-error.js";
import type { DataTransferRepository } from "../infrastructure/data-transfer.repository.js";
import { buildUserDataXml, parseUserDataXml } from "./data-transfer.xml.js";

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<calcData version="1">
  <products>
    <product>
      <id>custom-1</id>
      <name>Custom Bar</name>
      <category>Другое</category>
      <amountValue>100</amountValue>
      <amountUnit>г</amountUnit>
      <calories>200</calories>
      <protein>20</protein>
      <carbs>10</carbs>
      <fat>8</fat>
      <imageAlt>Custom Bar</imageAlt>
      <imageUrl></imageUrl>
      <visibility>private</visibility>
    </product>
  </products>
  <entries>
    <entry>
      <productId>custom-1</productId>
      <productName>Custom Bar</productName>
      <productImageAlt>Custom Bar</productImageAlt>
      <productImageUrl></productImageUrl>
      <amountValue>100</amountValue>
      <amountUnit>г</amountUnit>
      <servings>1</servings>
      <mealType>Завтрак</mealType>
      <date>2026-08-01</date>
      <calories>200</calories>
      <protein>20</protein>
      <carbs>10</carbs>
      <fat>8</fat>
    </entry>
  </entries>
</calcData>`;

describe("data-transfer xml", () => {
  it("rejects empty XML and XXE declarations", () => {
    expect(() => parseUserDataXml("")).toThrow(HttpError);
    expect(() =>
      parseUserDataXml('<!DOCTYPE foo [<!ENTITY x "y">]><calcData version="1"/>')
    ).toThrow(/DOCTYPE and ENTITY/);
  });

  it("parses a valid document", () => {
    const data = parseUserDataXml(sampleXml);

    expect(data.products).toHaveLength(1);
    expect(data.products[0]).toMatchObject({
      originalId: "custom-1",
      name: "Custom Bar",
      calories: 200,
      visibility: "private",
    });
    expect(data.entries).toHaveLength(1);
    expect(data.entries[0]).toMatchObject({
      productName: "Custom Bar",
      date: "2026-08-01",
      servings: 1,
      mealType: "Завтрак",
    });
  });

  it("roundtrips export builder output", async () => {
    const repository = {
      getUserData: async () => ({
        products: [
          {
            amountUnit: "г" as const,
            amountValue: 100,
            calories: 200,
            carbs: 10,
            category: "Другое" as const,
            createdAt: new Date("2026-08-01T11:00:00.000Z"),
            externalId: "custom-1",
            fat: 8,
            imageAlt: "Custom Bar",
            imageUrl: "",
            isPublic: false,
            isReadonly: false,
            name: "Custom Bar",
            protein: 20,
            sourceKey: "custom",
            sourceLabel: "Custom products",
            userId: "user-1",
          },
        ],
        entries: [
          {
            date: "2026-08-01",
            mealType: "Завтрак",
            productSnapshot: {
              amountUnit: "г" as const,
              amountValue: 100,
              calories: 200,
              carbs: 10,
              fat: 8,
              productId: "custom-1",
              productImageAlt: "Custom Bar",
              productImageUrl: "",
              productName: "Custom Bar",
              protein: 20,
            },
            servings: 1,
            userId: "user-1",
          },
        ],
      }),
    } as unknown as DataTransferRepository;

    const xml = await buildUserDataXml("user-1", repository);
    const parsed = parseUserDataXml(xml);

    expect(parsed.products[0]?.name).toBe("Custom Bar");
    expect(parsed.entries[0]?.date).toBe("2026-08-01");
  });
});
