"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { CATEGORIES } from "@/types";

type BookFiltersProps = {
  category: string;
  search: string;
};

const ALL = "All";
const tabs = [ALL, ...CATEGORIES];

export default function BookFilters({ category, search }: BookFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [term, setTerm] = useState(search);
  const [isPending, startTransition] = useTransition();

  const applyFilters = (next: { category?: string; search?: string }) => {
    const params = new URLSearchParams();
    const nextCategory = next.category ?? category;
    const nextSearch = (next.search ?? term).trim();
    if (nextCategory && nextCategory !== ALL) params.set("category", nextCategory);
    if (nextSearch) params.set("search", nextSearch);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  useEffect(() => {
    if (term.trim() === search) return;
    const timer = setTimeout(() => applyFilters({ search: term }), 450);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex flex-col gap-5 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters({ search: term });
        }}
        className="flex items-center gap-3"
      >
        <label className="input w-full">
          <HiOutlineMagnifyingGlass className="size-5 text-base-content/50" />
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by title or author"
            aria-label="Search books by title or author"
            className="grow"
          />
          {term && (
            <button
              type="button"
              onClick={() => {
                setTerm("");
                applyFilters({ search: "" });
              }}
              aria-label="Clear search"
              className="text-base-content/50 hover:text-base-content"
            >
              <HiXMark className="size-5" />
            </button>
          )}
        </label>
        {isPending && <span className="loading loading-spinner loading-sm text-primary" aria-label="Updating results" />}
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {tabs.map((tab) => {
          const active = (category || ALL) === tab;
          return (
            <button
              key={tab}
              type="button"
              aria-pressed={active}
              onClick={() => applyFilters({ category: tab })}
              className={`btn btn-sm rounded-full px-4 ${active ? "btn-primary" : "btn-ghost bg-base-200"}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
