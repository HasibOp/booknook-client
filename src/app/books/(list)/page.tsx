import type { Metadata } from 'next';
import BookFilters from '@/components/books/BookFilters';
import BookGrid from '@/components/books/BookGrid';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import { getBooks } from '@/lib/books';
import { CATEGORIES, type Book } from '@/types';

export const metadata: Metadata = {
  title: 'All Books',
};

const pick = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export default async function AllBooksPage({
  searchParams,
}: PageProps<'/books'>) {
  const params = await searchParams;
  const rawCategory = pick(params.category);
  const category = (CATEGORIES as readonly string[]).includes(rawCategory)
    ? rawCategory
    : 'All';
  const search = pick(params.search).trim().slice(0, 100);

  let books: Book[] = [];
  let failed = false;
  try {
    books = await getBooks({ category, search });
  } catch {
    failed = true;
  }

  const filtered = category !== 'All' || Boolean(search);
  const summary = [
    `${books.length} ${books.length === 1 ? 'book' : 'books'}`,
    category !== 'All' ? `in ${category}` : '',
    search ? `matching "${search}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className='container-page section-space flex flex-col gap-8'>
      <SectionHeading
        eyebrow='The BookNook shelves'
        title='All Books'
        subtitle='Every book shared by our readers, newest first. Search by title or author, or pick a category to narrow things down.'
      />

      <BookFilters
        key={`${category}|${search}`}
        category={category}
        search={search}
      />

      {failed ? (
        <div
          role='alert'
          className='alert alert-warning alert-soft mx-auto max-w-xl justify-center text-center'
        >
          We couldn&apos;t load the books right now. Please refresh the page in
          a moment.
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title={filtered ? 'No books found' : 'The shelves are empty'}
          text={
            filtered
              ? 'Nothing matches your search yet. Try another title, author or category.'
              : 'No one has added a book yet. Be the first to share one!'
          }
          actionHref={filtered ? '/books' : '/add-book'}
          actionLabel={filtered ? 'Clear filters' : 'Add a Book'}
        />
      ) : (
        <>
          <p
            className='text-sm font-semibold text-base-content/70'
            aria-live='polite'
          >
            Showing {summary}
          </p>
          <BookGrid books={books} />
        </>
      )}
    </section>
  );
}
