import type { Book } from "@/types";
import { API_URL } from "./config";

export type BookQuery = {
  limit?: number;
  category?: string;
  search?: string;
};

export async function getBooks(query: BookQuery = {}): Promise<Book[]> {
  const params = new URLSearchParams();
  if (query.limit) params.set("limit", String(query.limit));
  if (query.category && query.category !== "All") params.set("category", query.category);
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  const response = await fetch(`${API_URL}/books${qs ? `?${qs}` : ""}`, { cache: "no-store" });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `Could not load books (status ${response.status})`);
  }

  return response.json();
}

export function getLatestBooks(count = 6) {
  return getBooks({ limit: count });
}
