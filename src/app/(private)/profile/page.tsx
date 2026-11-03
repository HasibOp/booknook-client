import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <PagePlaceholder
      eyebrow="Your account"
      title="My Profile"
      subtitle="Your name, photo and reading activity will be shown here."
    />
  );
}
