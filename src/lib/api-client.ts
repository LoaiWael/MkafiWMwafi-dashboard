import { COOKIE_KEYS } from "./constants";
import { getCookie } from "./cookies";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
}

import { env } from "./env";

function getBaseUrl(): string {
  // Try to use env if available
  return env.API_BASE_URL;
}

/**
 * Core fetch wrapper with JSON, auth, and error handling.
 */
export async function apiClient<T>(
  endpoint: string,
  { data, params, headers: customHeaders, ...customConfig }: FetchOptions = {}
): Promise<T> {
  const token = getCookie(COOKIE_KEYS.authToken);

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: "application/json",
      "Accept-Language": "ar",
      ...customHeaders,
    },
    ...customConfig,
  };

  // Build URL
  let baseUrl = getBaseUrl();
  // Ensure no trailing slash on baseUrl
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  
  const isAbsoluteUrl = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const url = new URL(
    isAbsoluteUrl ? endpoint : `${baseUrl}${path}`,
    isAbsoluteUrl || baseUrl ? undefined : window.location.origin
  );

  // Append query params if any
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized-api-error"));
      }
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      response.status,
      errorData?.message || response.statusText,
      errorData
    );
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  // Try parsing JSON, fallback to empty object if response is empty
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    return {} as T;
  }
}

/**
 * Convenient HTTP methods wrapper
 */
export const http = {
  get: <T>(endpoint: string, config?: Omit<FetchOptions, "data">) =>
    apiClient<T>(endpoint, { ...config, method: "GET" }),
  
  post: <T>(endpoint: string, data?: any, config?: FetchOptions) =>
    apiClient<T>(endpoint, { ...config, method: "POST", data }),
  
  put: <T>(endpoint: string, data?: any, config?: FetchOptions) =>
    apiClient<T>(endpoint, { ...config, method: "PUT", data }),
  
  patch: <T>(endpoint: string, data?: any, config?: FetchOptions) =>
    apiClient<T>(endpoint, { ...config, method: "PATCH", data }),
  
  delete: <T>(endpoint: string, config?: FetchOptions) =>
    apiClient<T>(endpoint, { ...config, method: "DELETE" }),
};
