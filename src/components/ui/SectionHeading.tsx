type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`mb-10 flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-base-content sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-base-content/70">{subtitle}</p>
      )}
    </div>
  );
}
