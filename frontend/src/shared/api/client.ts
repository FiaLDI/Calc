export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const joinUrl = (baseUrl: string, endpoint: string) => {
    return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
};

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiRequestOptions<TBody> = Omit<RequestInit, "body" | "method"> & {
  body?: TBody;
  method?: ApiMethod;
};

export const fetchFromApi = async <TResponse, TBody = undefined>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> => {
  const { body, headers, method = "GET", ...init } = options;

  const response = await fetch(joinUrl(API_BASE_URL, endpoint), {
    ...init,
    cache: "no-store",
    credentials: "include",
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: unknown;
    } | null;
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : `Ошибка API: ${response.status} ${response.statusText}`;

    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("calc:unauthorized"));
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
};
