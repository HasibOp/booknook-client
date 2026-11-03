import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import BookCard from "@/components/books/BookCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getLatestBooks } from "@/lib/books";
import type { Book } from "@/types";

export default async function NewArrivals() {
  let books: Book[] = [];
  let failed = false;

  try {
    books = await getLatestBooks(6);
  } catch {
    failed = true;
  }

  return (
    <section className="container-page section-space">
      <SectionHeading
        eyebrow="Fresh on the shelf"
        title="New Arrivals"
        subtitle="The six newest books our readers have added to BookNook. Grab one before someone else does."
      />

      {failed ? (
        <div role="alert" className="alert alert-warning alert-soft mx-auto max-w-xl justify-center text-center">
          We couldn&apos;t load the newest books right now. Please refresh the page in a moment.
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-base-content/70">
          No books on the shelf yet. Be the first to add one!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <BookCard key={book._id} book={book} priority={index < 3} />
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link href="/books" className="btn btn-primary btn-lg rounded-full px-8">
          See All Books
          <HiArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}
