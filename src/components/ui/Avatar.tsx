"use client";

import { useState } from "react";
import Image from "next/image";

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
};

function initialsOf(name?: string | null) {
  const parts = (name || "Reader").trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function Avatar({ name, src, size = 40, className = "" }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-secondary-content ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={name ? `${name}'s photo` : "Profile photo"}
          width={size}
          height={size}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src ?? null)}
          className="size-full object-cover"
        />
      ) : (
        <span className="font-sans text-sm font-bold" aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
