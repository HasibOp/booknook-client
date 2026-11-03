import { requireUser } from "@/lib/session";

export default async function BookDetailsLayout({ children }: LayoutProps<"/books/[id]">) {
  await requireUser();
  return children;
}
