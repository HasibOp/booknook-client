import Link from "next/link";

type LogoProps = {
  className?: string;
};

type BrandProps = LogoProps & {
  textClassName?: string;
  accentClassName?: string;
};

export function LogoMark({ className = "size-9" }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" className="fill-primary" />
      <path
        d="M9 12.5c3.8-1.9 7.4-1.9 11 0v15.5c-3.6-1.9-7.2-1.9-11 0z"
        className="fill-primary-content"
      />
      <path
        d="M31 12.5c-3.8-1.9-7.4-1.9-11 0v15.5c3.6-1.9 7.2-1.9 11 0z"
        className="fill-primary-content"
        opacity="0.78"
      />
      <path d="M24.5 11.3h3.5v8.2l-1.75-1.4-1.75 1.4z" className="fill-secondary" />
    </svg>
  );
}

export default function Logo({
  className = "",
  textClassName = "text-base-content",
  accentClassName = "text-primary",
}: BrandProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="BookNook home">
      <LogoMark />
      <span className={`font-display text-2xl font-semibold tracking-tight ${textClassName}`}>
        Book<span className={accentClassName}>Nook</span>
      </span>
    </Link>
  );
}
