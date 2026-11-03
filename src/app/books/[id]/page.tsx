import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Book Details",
};

export default function BookDetailsPage() {
  return (
    <PagePlaceholder
      eyebrow="Book details"
      title="About this book"
      subtitle="The cover, author, description and borrow button for this book will appear here."
    />
  );
}
