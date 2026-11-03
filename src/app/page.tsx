import SectionHeading from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <main className="container-page section-space flex flex-1 flex-col items-center justify-center">
      <SectionHeading
        eyebrow="Your neighbourhood library"
        title="Welcome to BookNook"
        subtitle="A small online library. Add a book, borrow a book, return a book."
      />
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn btn-primary rounded-full px-6">Browse Books</button>
        <button className="btn btn-outline btn-secondary rounded-full px-6">How It Works</button>
      </div>
    </main>
  );
}
