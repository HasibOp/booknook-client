import axios from "axios";
import { queryOptions } from "@tanstack/react-query";
import type { Book, Borrow } from "@/types";
import { secureApi } from "./api";

export function isMissing(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return status === 400 || status === 404;
}

export const bookQuery = (id: string) =>
  queryOptions({
    queryKey: ["book", id],
    queryFn: async () => (await secureApi.get<Book>(`/books/${id}`)).data,
    retry: (count, error) => !isMissing(error) && count < 1,
  });

export const myBooksQuery = queryOptions({
  queryKey: ["my-books"],
  queryFn: async () => (await secureApi.get<Book[]>("/books", { params: { mine: true } })).data,
});

export const myBorrowsQuery = queryOptions({
  queryKey: ["my-borrows"],
  queryFn: async () => (await secureApi.get<Borrow[]>("/borrows")).data,
});
