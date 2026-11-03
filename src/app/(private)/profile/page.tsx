import type { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";
import SectionHeading from "@/components/ui/SectionHeading";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <section className="container-page section-space">
      <SectionHeading
        eyebrow="Your account"
        title="My Profile"
        subtitle="Your details and reading activity on BookNook, all in one place."
      />
      <ProfileView
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          createdAt: new Date(user.createdAt).toISOString(),
        }}
      />
    </section>
  );
}
