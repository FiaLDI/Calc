import { API_BASE_URL, ApiError } from "@/shared/api/client";

export type ImportResult = {
  entries: number;
  products: number;
};

const getError = async (response: Response) => {
  const payload = (await response.json().catch(() => null)) as {
    error?: unknown;
  } | null;

  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("calc:unauthorized"));
  }

  return new ApiError(
    response.status,
    typeof payload?.error === "string"
      ? payload.error
      : `Ошибка API: ${response.status} ${response.statusText}`
  );
};

export const DataTransferApi = {
  async exportData() {
    const response = await fetch(`${API_BASE_URL}/data/export`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw await getError(response);
    }

    return response.text();
  },

  async importData(xml: string) {
    const response = await fetch(`${API_BASE_URL}/data/import`, {
      body: xml,
      credentials: "include",
      headers: { "Content-Type": "application/xml" },
      method: "POST",
    });

    if (!response.ok) {
      throw await getError(response);
    }

    const payload = (await response.json()) as { data: ImportResult };
    return payload.data;
  },
};
