import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <PagePlaceholder
      eyebrow="Share your shelf"
      title="Add a Book"
      subtitle="The form for adding a new book to BookNook will live here."
    />
  );
}
