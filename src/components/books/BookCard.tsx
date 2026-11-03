import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import type { Book } from "@/types";
import BookCover from "./BookCover";

type BookCardProps = {
  book: Book;
  priority?: boolean;
};

export default function BookCard({ book, priority }: BookCardProps) {
  const available = book.availableCopies > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className="relative">
        <BookCover src={book.image} title={book.title} author={book.author} priority={priority} />
        <span className="badge badge-sm absolute left-3 top-3 border-0 bg-base-100/90 font-semibold text-primary backdrop-blur">
          {book.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 min-h-14 text-xl font-semibold leading-snug" title={book.title}>
            {book.title}
          </h3>
          <p className="truncate text-sm text-base-content/70">by {book.author}</p>
        </div>

        <p className={`text-xs font-semibold ${available ? "text-success" : "text-error"}`}>
          {available
            ? `${book.availableCopies} of ${book.totalCopies} ${book.totalCopies === 1 ? "copy" : "copies"} available`
            : "Not available right now"}
        </p>

        <Link
          href={`/books/${book._id}`}
          className="btn btn-primary mt-auto w-full rounded-full"
          aria-label={`View details of ${book.title}`}
        >
          View Details
          <HiArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
