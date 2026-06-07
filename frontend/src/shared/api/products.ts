export type ProductsApiProduct = {
  amountUnit: "г" | "мл" | "шт" | "порция";
  amountValue: number;
  calories: number;
  carbs: number;
  createdAt: string;
  fat: number;
  id: string;
  isReadonly: boolean;
  name: string;
  protein: number;
  sourceKey: string;
  sourceLabel: string;
};

type ProductsApiResponse = {
  data: ProductsApiProduct[];
  meta: {
    limit: number;
    offset: number;
    search: null | string;
    selectedSources: string[];
    total: number;
  };
};

const PRODUCTS_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL || "http://localhost:4000/api/v1";

export const fetchProductsFromApi = async () => {
  const response = await fetch(`${PRODUCTS_API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить продукты с сервера.");
  }

  const payload = (await response.json()) as ProductsApiResponse;

  return payload.data;
};
