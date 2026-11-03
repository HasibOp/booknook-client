"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import Logo from "./Logo";
import NavLinks, { publicLinks } from "./NavLinks";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/85 backdrop-blur-md">
      <nav className="container-page flex h-18 items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:block">
          <NavLinks links={publicLinks} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/login" className="btn btn-ghost rounded-full px-5">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary rounded-full px-5">
              Register
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <HiX className="size-6" /> : <HiOutlineMenuAlt3 className="size-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-base-300/70 bg-base-100 lg:hidden">
          <div className="container-page flex flex-col gap-4 py-4">
            <NavLinks links={publicLinks} vertical onNavigate={closeMenu} />
            <div className="flex gap-2 sm:hidden">
              <Link href="/login" onClick={closeMenu} className="btn btn-outline flex-1 rounded-full">
                Login
              </Link>
              <Link href="/register" onClick={closeMenu} className="btn btn-primary flex-1 rounded-full">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
