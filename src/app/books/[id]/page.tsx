import type { Metadata } from "next";
import BookDetails from "@/components/books/BookDetails";

export const metadata: Metadata = {
  title: "Book Details",
};

export default async function BookDetailsPage({ params }: PageProps<"/books/[id]">) {
  const { id } = await params;

  return (
    <section className="container-page section-space">
      <BookDetails id={id} />
    </section>
  );
}
