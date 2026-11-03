import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "My Books",
};

export default function MyBooksPage() {
  return (
    <PagePlaceholder
      eyebrow="Your shelf"
      title="My Books"
      subtitle="Every book you have added to BookNook will be listed here."
    />
  );
}
