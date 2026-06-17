export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

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
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
};
