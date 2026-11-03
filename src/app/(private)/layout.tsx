import { requireUser } from "@/lib/session";

export default async function PrivateLayout({ children }: LayoutProps<"/">) {
  await requireUser();
  return children;
}
