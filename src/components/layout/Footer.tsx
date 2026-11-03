import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import Logo from "./Logo";

const exploreLinks = [
  { href: "/", label: "Home", isPrivate: false },
  { href: "/books", label: "All Books", isPrivate: false },
  { href: "/add-book", label: "Add a Book", isPrivate: true },
  { href: "/my-borrows", label: "My Borrows", isPrivate: true },
];

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const socials: { href: string; label: string; icon: IconType }[] = [
  { href: "https://www.facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://www.instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://x.com", label: "X", icon: FaXTwitter },
  { href: "https://github.com/HasibOp", label: "GitHub", icon: FaGithub },
];

const contacts: { icon: IconType; text: string; href?: string }[] = [
  { icon: HiOutlineEnvelope, text: "hello@booknook.app", href: "mailto:hello@booknook.app" },
  { icon: HiOutlinePhone, text: "+880 1712-345678", href: "tel:+8801712345678" },
  { icon: HiOutlineMapPin, text: "Road 7, Dhanmondi, Dhaka 1205" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-neutral-content/60">
      {children}
    </h3>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          <Logo textClassName="text-neutral-content" accentClassName="text-accent" />
          <p className="max-w-xs text-sm leading-relaxed text-neutral-content/70">
            A cozy little online library. Share the books on your shelf, borrow a new favourite and
            return it when you are done.
          </p>
          <div className="flex gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-circle btn-sm border-neutral-content/20 bg-neutral-content/5 text-neutral-content hover:border-secondary hover:bg-secondary hover:text-secondary-content"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <FooterHeading>Explore</FooterHeading>
          <ul className="flex flex-col gap-2.5 text-sm">
            {exploreLinks.map(({ href, label, isPrivate }) => (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={isPrivate ? false : undefined}
                  className="text-neutral-content/80 transition-colors hover:text-secondary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Categories</FooterHeading>
          <ul className="flex flex-col gap-2.5 text-sm">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/books?category=${category}`}
                  className="text-neutral-content/80 transition-colors hover:text-secondary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Visit or write to us</FooterHeading>
          <ul className="flex flex-col gap-3 text-sm">
            {contacts.map(({ icon: Icon, text, href }) => (
              <li key={text} className="flex items-start gap-3 text-neutral-content/80">
                <Icon className="mt-0.5 size-5 shrink-0 text-secondary" />
                {href ? (
                  <a href={href} className="transition-colors hover:text-secondary">
                    {text}
                  </a>
                ) : (
                  <span>{text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-content/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-neutral-content/60 sm:flex-row sm:text-left">
          <p>&copy; {year} BookNook. All rights reserved.</p>
          <p>Made with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
