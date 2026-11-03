import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const publicApi = axios.create({ baseURL: API_URL, timeout: 15000 });
export const secureApi = axios.create({ baseURL: API_URL, timeout: 15000 });

const EXPIRY_MARGIN_MS = 60_000;
let cachedToken: { value: string; expiresAt: number } | null = null;

function expiryOf(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function clearApiToken() {
  cachedToken = null;
}

async function getApiToken() {
  if (cachedToken && cachedToken.expiresAt - EXPIRY_MARGIN_MS > Date.now()) {
    return cachedToken.value;
  }
  const { data } = await authClient.token();
  if (!data?.token) return null;
  cachedToken = { value: data.token, expiresAt: expiryOf(data.token) };
  return data.token;
}

secureApi.interceptors.request.use(async (config) => {
  const token = await getApiToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { retried?: boolean };

secureApi.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryableConfig | undefined;

  if (error.response?.status === 401 && config && !config.retried) {
    config.retried = true;
    clearApiToken();
    return secureApi(config);
  }

  if (error.response?.status === 401 && typeof window !== "undefined") {
    clearApiToken();
    await authClient.signOut();
    toast.error("Your session has expired. Please log in again.");
    const here = `${window.location.pathname}${window.location.search}`;
    const loginUrl = new URL("/login", window.location.origin);
    loginUrl.searchParams.set("redirect", here);
    window.location.href = loginUrl.toString();
  }

  return Promise.reject(error);
});

export function apiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (!error.response) return "Can't reach the BookNook server right now. Please try again in a moment.";
  }
  return fallback;
}
