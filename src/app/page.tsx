export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">BookNook</h1>
      <p className="max-w-md text-base-content/70">
        A small online library. Add a book, borrow a book, return a book.
      </p>
      <button className="btn btn-primary">Browse Books</button>
    </main>
  );
}
