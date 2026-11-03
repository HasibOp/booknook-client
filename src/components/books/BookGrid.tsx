import type { Book } from "@/types";
import BookCard from "./BookCard";

type BookGridProps = {
  books: Book[];
  priorityCount?: number;
};

export default function BookGrid({ books, priorityCount = 3 }: BookGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => (
        <BookCard key={book._id} book={book} priority={index < priorityCount} />
      ))}
    </div>
  );
}
