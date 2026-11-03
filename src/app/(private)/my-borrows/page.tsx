import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <PagePlaceholder
      eyebrow="Currently reading"
      title="My Borrows"
      subtitle="The books you have borrowed and their return dates will appear here."
    />
  );
}
