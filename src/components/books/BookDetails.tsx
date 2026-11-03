'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  HiArrowLeft,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineNoSymbol,
  HiOutlineSquare3Stack3D,
} from 'react-icons/hi2';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { apiErrorMessage } from '@/lib/api';
import { bookQuery, isMissing, myBorrowsQuery } from '@/lib/queries';
import BookCover from './BookCover';
import BorrowModal from './BorrowModal';

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

type BookDetailsProps = {
  id: string;
  user: { name: string; email: string };
};

export default function BookDetails({ id, user }: BookDetailsProps) {
  const [borrowOpenedAt, setBorrowOpenedAt] = useState<number | null>(null);

  const {
    data: book,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery(bookQuery(id));

  const myBorrows = useQuery(myBorrowsQuery);

  if (isPending) return <Spinner label='Opening the book...' fullPage />;

  if (error) {
    if (isMissing(error)) {
      return (
        <EmptyState
          title='Book not found'
          text='This book may have been removed by its owner, or the link is not quite right.'
          actionHref='/books'
          actionLabel='Browse All Books'
        />
      );
    }
    return (
      <div
        role='alert'
        className='alert alert-warning alert-soft mx-auto flex max-w-xl flex-col gap-3 text-center'
      >
        <p>{apiErrorMessage(error, "We couldn't load this book right now.")}</p>
        <button
          type='button'
          onClick={() => refetch()}
          disabled={isFetching}
          className='btn btn-sm btn-warning rounded-full'
        >
          {isFetching && (
            <span className='loading loading-spinner loading-xs' />
          )}
          Try again
        </button>
      </div>
    );
  }

  const available = book.availableCopies > 0;
  const copyWord = book.totalCopies === 1 ? 'copy' : 'copies';
  const myBorrow = myBorrows.data?.find((borrow) => borrow.bookId === book._id);

  return (
    <div className='flex flex-col gap-8'>
      <nav className='breadcrumbs text-sm' aria-label='Breadcrumb'>
        <ul>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/books'>All Books</Link>
          </li>
          <li
            className='max-w-48 truncate text-base-content/60 sm:max-w-xs'
            aria-current='page'
          >
            {book.title}
          </li>
        </ul>
      </nav>

      <article className='grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14'>
        <div className='mx-auto w-full max-w-xs md:sticky md:top-24 md:max-w-none md:self-start'>
          <BookCover
            src={book.image}
            title={book.title}
            author={book.author}
            priority
            sizes='(min-width: 768px) 20rem, 80vw'
            className='rounded-box shadow-xl ring-1 ring-base-300'
          />
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
            <Link
              href={`/books?category=${book.category}`}
              className='badge badge-primary badge-soft w-fit font-semibold'
            >
              {book.category}
            </Link>
            <h1 className='text-4xl font-semibold leading-tight sm:text-5xl'>
              {book.title}
            </h1>
            <p className='text-lg text-base-content/70'>
              by{' '}
              <span className='font-semibold text-base-content'>
                {book.author}
              </span>
            </p>
          </div>

          <div
            className={`flex flex-col gap-3 rounded-box border p-5 ${
              available
                ? 'border-success/30 bg-success/5'
                : 'border-error/30 bg-error/5'
            }`}
          >
            <p
              className={`flex items-center gap-2 font-semibold ${available ? 'text-success' : 'text-error'}`}
            >
              <HiOutlineSquare3Stack3D className='size-5 shrink-0' />
              {available
                ? `${book.availableCopies} of ${book.totalCopies} ${copyWord} available`
                : book.totalCopies === 1
                  ? 'The only copy is borrowed right now'
                  : `All ${book.totalCopies} copies are borrowed right now`}
            </p>
            <progress
              className={`progress w-full ${available ? 'progress-success' : 'progress-error'}`}
              value={book.availableCopies}
              max={book.totalCopies}
              aria-label='Copies available'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl font-semibold'>About this book</h2>
            <p className='whitespace-pre-line leading-relaxed text-base-content/80'>
              {book.description}
            </p>
          </div>

          <dl className='grid gap-4 sm:grid-cols-2'>
            <div className='flex items-center gap-3 rounded-box bg-base-200/60 p-4'>
              <Avatar name={book.addedBy.name} size={44} />
              <div className='min-w-0'>
                <dt className='text-xs font-semibold uppercase tracking-widest text-base-content/50'>
                  Added by
                </dt>
                <dd className='truncate font-semibold'>{book.addedBy.name}</dd>
                <dd className='truncate text-sm text-base-content/70'>
                  {book.addedBy.email}
                </dd>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-box bg-base-200/60 p-4'>
              <span className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <HiOutlineCalendarDays className='size-6' />
              </span>
              <div>
                <dt className='text-xs font-semibold uppercase tracking-widest text-base-content/50'>
                  Date added
                </dt>
                <dd className='font-semibold'>
                  {dateFormat.format(new Date(book.createdAt))}
                </dd>
              </div>
            </div>
          </dl>

          {myBorrow && (
            <div role='status' className='alert alert-info alert-soft'>
              <HiOutlineCheckCircle className='size-6 shrink-0' />
              <span>
                You borrowed this book on{' '}
                {dateFormat.format(new Date(myBorrow.borrowDate))}. Please
                return it by{' '}
                <strong>
                  {dateFormat.format(new Date(myBorrow.returnDate))}
                </strong>
                .{' '}
                <Link href='/my-borrows' className='font-semibold underline'>
                  Go to My Borrows
                </Link>
              </span>
            </div>
          )}

          <div className='flex flex-col gap-3 sm:flex-row'>
            {myBorrows.isPending ? (
              <button
                type='button'
                disabled
                className='btn btn-lg rounded-full px-8'
              >
                <span className='loading loading-spinner loading-sm' />
                Checking your borrows...
              </button>
            ) : myBorrow ? (
              <button
                type='button'
                disabled
                className='btn btn-lg rounded-full px-8'
              >
                <HiOutlineCheckCircle className='size-5' />
                Already Borrowed
              </button>
            ) : available ? (
              <button
                type='button'
                onClick={() => setBorrowOpenedAt(Date.now())}
                className='btn btn-primary btn-lg rounded-full px-8'
              >
                <HiOutlineBookOpen className='size-5' />
                Borrow This Book
              </button>
            ) : (
              <button
                type='button'
                disabled
                className='btn btn-lg rounded-full px-8'
              >
                <HiOutlineNoSymbol className='size-5' />
                Not Available
              </button>
            )}
            <Link href='/books' className='btn btn-ghost btn-lg rounded-full'>
              <HiArrowLeft className='size-5' />
              Back to All Books
            </Link>
          </div>
        </div>
      </article>

      {borrowOpenedAt !== null && (
        <BorrowModal
          book={book}
          user={user}
          openedAt={borrowOpenedAt}
          onClose={() => setBorrowOpenedAt(null)}
        />
      )}
    </div>
  );
}
