import SectionHeading from "./SectionHeading";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export default function PagePlaceholder({ eyebrow, title, subtitle }: PagePlaceholderProps) {
  return (
    <section className="container-page section-space flex flex-1 flex-col items-center justify-center">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
    </section>
  );
}
