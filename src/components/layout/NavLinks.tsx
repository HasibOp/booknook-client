"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = {
  href: string;
  label: string;
};

export const publicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

type NavLinksProps = {
  links: NavLink[];
  vertical?: boolean;
  onNavigate?: () => void;
};

export default function NavLinks({ links, vertical = false, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <ul className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {links.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
