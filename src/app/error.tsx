"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page section-space flex flex-1 items-center justify-center">
      <title>BookNook | Something went wrong</title>
      <div className="flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-error/10 text-error">
          <HiOutlineExclamationTriangle className="size-10" />
        </span>
        <h1 className="text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
        <p className="text-base-content/70">
          We hit a problem while loading this page. Please try again, or head back to the home page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn btn-primary rounded-full px-8">
            <HiOutlineArrowPath className="size-5" />
            Try again
          </button>
          <Link href="/" className="btn btn-ghost rounded-full px-6">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
