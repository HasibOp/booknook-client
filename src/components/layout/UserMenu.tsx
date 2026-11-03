"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { HiOutlineArrowRightOnRectangle, HiOutlineUserCircle } from "react-icons/hi2";
import Avatar from "@/components/ui/Avatar";
import { clearApiToken } from "@/lib/api";
import { signOut } from "@/lib/auth-client";
import { hardNavigate } from "@/lib/flash";

type UserMenuProps = {
  name: string;
  email: string;
  image?: string | null;
};

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    setLoggingOut(false);
    if (error) {
      toast.error(error.message || "Logout failed. Please try again.");
      return;
    }
    clearApiToken();
    queryClient.clear();
    setOpen(false);
    hardNavigate("/", { type: "success", message: "You have been logged out. See you soon!" });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-base-100 transition hover:ring-primary/40 focus-visible:ring-primary"
      >
        <Avatar name={name} src={image} size={42} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-base-300 bg-base-200/60 p-4">
            <Avatar name={name} src={image} size={44} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{name}</p>
              <p className="truncate text-sm text-base-content/60">{email}</p>
            </div>
          </div>
          <ul className="flex flex-col p-2">
            <li>
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-semibold hover:bg-base-200"
              >
                <HiOutlineUserCircle className="size-5 text-primary" />
                My Profile
              </Link>
            </li>
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-left text-sm font-semibold text-error hover:bg-error/10"
              >
                {loggingOut ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <HiOutlineArrowRightOnRectangle className="size-5" />
                )}
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
