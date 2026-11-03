"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { HiOutlineArrowUturnLeft, HiOutlineEye } from "react-icons/hi2";
import BookCover from "@/components/books/BookCover";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { apiErrorMessage, secureApi } from "@/lib/api";
import type { Borrow } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function startOfDay(value: number) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function DueBadge({ returnDate, today }: { returnDate: string; today: number }) {
  const days = Math.round((startOfDay(new Date(returnDate).getTime()) - today) / DAY_MS);
  if (days < 0) {
    return (
      <span className="badge badge-error badge-soft badge-sm font-semibold">
        Overdue by {-days} {days === -1 ? "day" : "days"}
      </span>
    );
  }
  if (days === 0) return <span className="badge badge-warning badge-soft badge-sm font-semibold">Due today</span>;
  return (
    <span className="badge badge-success badge-soft badge-sm font-semibold">
      {days} {days === 1 ? "day" : "days"} left
    </span>
  );
}

function Actions({ borrow, onReturn }: { borrow: Borrow; onReturn: (borrow: Borrow) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/books/${borrow.bookId}`}
        className="btn btn-ghost btn-sm rounded-full"
        aria-label={`View ${borrow.bookTitle}`}
      >
        <HiOutlineEye className="size-4" />
        View
      </Link>
      <button
        type="button"
        onClick={() => onReturn(borrow)}
        className="btn btn-primary btn-sm rounded-full"
        aria-label={`Return ${borrow.bookTitle}`}
      >
        <HiOutlineArrowUturnLeft className="size-4" />
        Return Book
      </button>
    </div>
  );
}

export default function MyBorrowsTable() {
  const queryClient = useQueryClient();
  const [today] = useState(() => startOfDay(Date.now()));
  const [toReturn, setToReturn] = useState<Borrow | null>(null);

  const { data: borrows, error, isPending, isFetching, refetch } = useQuery({
    queryKey: ["my-borrows"],
    queryFn: async () => (await secureApi.get<Borrow[]>("/borrows")).data,
  });

  const returnBook = useMutation({
    mutationFn: async (borrow: Borrow) => {
      await secureApi.delete(`/borrows/${borrow._id}`);
      return borrow;
    },
    onSuccess: (borrow) => {
      queryClient.setQueryData<Borrow[]>(["my-borrows"], (list) => list?.filter((item) => item._id !== borrow._id));
      queryClient.invalidateQueries({ queryKey: ["book", borrow.bookId] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      toast.success(`"${borrow.bookTitle}" is back on the shelf. Thanks for returning it!`);
      setToReturn(null);
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Could not return the book. Please try again."));
      setToReturn(null);
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
    },
  });

  if (isPending) return <Spinner label="Loading your borrowed books..." />;

  if (error) {
    return (
      <div role="alert" className="alert alert-warning alert-soft mx-auto flex max-w-xl flex-col gap-3 text-center">
        <p>{apiErrorMessage(error, "We couldn't load your borrowed books right now.")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-sm btn-warning rounded-full"
        >
          {isFetching && <span className="loading loading-spinner loading-xs" />}
          Try again
        </button>
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <EmptyState
        title="No borrowed books"
        text="You aren't borrowing anything right now. Find your next read on the shelves."
        actionHref="/books"
        actionLabel="Browse Books"
      />
    );
  }

  const overdue = borrows.filter((borrow) => startOfDay(new Date(borrow.returnDate).getTime()) < today).length;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-base-content/70" aria-live="polite">
        You are borrowing {borrows.length} {borrows.length === 1 ? "book" : "books"}
        {overdue > 0 && <span className="text-error"> ({overdue} overdue)</span>}
      </p>

      <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm md:block">
        <table className="table">
          <thead>
            <tr className="text-xs uppercase tracking-widest">
              <th>Book</th>
              <th>Borrowed</th>
              <th>Return by</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow._id} className="hover:bg-base-200/50">
                <td>
                  <div className="flex items-center gap-4">
                    <div className="w-12 shrink-0">
                      <BookCover src={borrow.bookImage} title={borrow.bookTitle} sizes="48px" className="rounded-field" />
                    </div>
                    <p className="line-clamp-2 font-semibold">{borrow.bookTitle}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap text-sm">{dateFormat.format(new Date(borrow.borrowDate))}</td>
                <td className="whitespace-nowrap text-sm font-semibold">
                  {dateFormat.format(new Date(borrow.returnDate))}
                </td>
                <td>
                  <DueBadge returnDate={borrow.returnDate} today={today} />
                </td>
                <td>
                  <div className="flex justify-end">
                    <Actions borrow={borrow} onReturn={setToReturn} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-4 md:hidden">
        {borrows.map((borrow) => (
          <li key={borrow._id} className="flex gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <div className="w-20 shrink-0">
              <BookCover src={borrow.bookImage} title={borrow.bookTitle} sizes="80px" className="rounded-field" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="line-clamp-2 font-semibold leading-snug">{borrow.bookTitle}</p>
              <DueBadge returnDate={borrow.returnDate} today={today} />
              <p className="text-xs text-base-content/60">
                Borrowed {dateFormat.format(new Date(borrow.borrowDate))}
                <br />
                Return by{" "}
                <span className="font-semibold text-base-content">{dateFormat.format(new Date(borrow.returnDate))}</span>
              </p>
              <Actions borrow={borrow} onReturn={setToReturn} />
            </div>
          </li>
        ))}
      </ul>

      {toReturn && (
        <ConfirmModal
          title="Return this book?"
          confirmLabel="Yes, Return"
          pendingLabel="Returning..."
          pending={returnBook.isPending}
          tone="primary"
          icon={HiOutlineArrowUturnLeft}
          onConfirm={() => returnBook.mutate(toReturn)}
          onClose={() => setToReturn(null)}
        >
          <p>
            <strong className="text-base-content">&ldquo;{toReturn.bookTitle}&rdquo;</strong> will go back on the
            shelf so another reader can borrow it.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}
