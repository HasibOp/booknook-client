import { LogoMark } from "@/components/layout/Logo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  sideTitle: string;
  sideText: string;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, sideTitle, sideText, children }: AuthShellProps) {
  return (
    <section className="container-page section-space flex flex-1 items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-primary p-10 text-primary-content lg:flex">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary-content/10" />
          <div className="absolute -bottom-20 -left-10 size-64 rounded-full bg-secondary/25" />
          <LogoMark className="relative size-14" />
          <div className="relative flex flex-col gap-4">
            <h2 className="text-3xl font-semibold leading-tight">{sideTitle}</h2>
            <p className="leading-relaxed text-primary-content/80">{sideText}</p>
          </div>
          <p className="relative text-sm text-primary-content/70">
            Add a book, borrow a book, return a book.
          </p>
        </aside>

        <div className="flex flex-col gap-8 p-6 sm:p-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
            <p className="text-base-content/70">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
