import Reveal from "@/components/ui/Reveal";
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
        <Reveal key={book._id} delay={(index % 3) * 0.08} className="h-full">
          <BookCard book={book} priority={index < priorityCount} />
        </Reveal>
      ))}
    </div>
  );
}
