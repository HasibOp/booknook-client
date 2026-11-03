'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi2';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { apiErrorMessage, secureApi } from '@/lib/api';
import { myBooksQuery } from '@/lib/queries';
import type { Book } from '@/types';
import BookCover from './BookCover';

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

function Copies({ book }: { book: Book }) {
  const available = book.availableCopies > 0;
  return (
    <span
      className={`text-sm font-semibold ${available ? 'text-success' : 'text-error'}`}
    >
      {book.availableCopies} / {book.totalCopies}
      <span className='ml-1 font-normal text-base-content/60'>available</span>
    </span>
  );
}

function Actions({
  book,
  onDelete,
}: {
  book: Book;
  onDelete: (book: Book) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      <Link
        href={`/books/${book._id}`}
        className='btn btn-ghost btn-sm rounded-full'
        aria-label={`View ${book.title}`}
      >
        <HiOutlineEye className='size-4' />
        View
      </Link>
      <Link
        href={`/my-books/edit/${book._id}`}
        className='btn btn-primary btn-sm btn-soft rounded-full'
        aria-label={`Edit ${book.title}`}
      >
        <HiOutlinePencilSquare className='size-4' />
        Edit
      </Link>
      <button
        type='button'
        onClick={() => onDelete(book)}
        className='btn btn-error btn-sm btn-soft rounded-full'
        aria-label={`Delete ${book.title}`}
      >
        <HiOutlineTrash className='size-4' />
        Delete
      </button>
    </div>
  );
}

export default function MyBooksTable() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const {
    data: books,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery(myBooksQuery);

  const deleteBook = useMutation({
    mutationFn: async (book: Book) => {
      await secureApi.delete(`/books/${book._id}`);
      return book;
    },
    onSuccess: (book) => {
      queryClient.setQueryData<Book[]>(['my-books'], (list) =>
        list?.filter((item) => item._id !== book._id),
      );
      queryClient.removeQueries({ queryKey: ['book', book._id] });
      queryClient.invalidateQueries({ queryKey: ['my-borrows'] });
      toast.success(`"${book.title}" has been removed from BookNook.`);
      setToDelete(null);
    },
    onError: (error) => {
      toast.error(
        apiErrorMessage(error, 'Could not delete the book. Please try again.'),
      );
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
    },
  });

  if (isPending) return <Spinner label='Loading your books...' />;

  if (error) {
    return (
      <div
        role='alert'
        className='alert alert-warning alert-soft mx-auto flex max-w-xl flex-col gap-3 text-center'
      >
        <p>
          {apiErrorMessage(error, "We couldn't load your books right now.")}
        </p>
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

  if (books.length === 0) {
    return (
      <EmptyState
        title='Your shelf is empty'
        text="You haven't added any books yet. Share one and it will show up here."
        actionHref='/add-book'
        actionLabel='Add a Book'
      />
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p
          className='text-sm font-semibold text-base-content/70'
          aria-live='polite'
        >
          You have added {books.length} {books.length === 1 ? 'book' : 'books'}
        </p>
        <Link href='/add-book' className='btn btn-primary btn-sm rounded-full'>
          <HiOutlinePlus className='size-4' />
          Add a Book
        </Link>
      </div>

      <div className='hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm md:block'>
        <table className='table'>
          <thead>
            <tr className='text-xs uppercase tracking-widest'>
              <th>Book</th>
              <th>Category</th>
              <th>Copies</th>
              <th>Added</th>
              <th className='text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className='hover:bg-base-200/50'>
                <td>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 shrink-0'>
                      <BookCover
                        src={book.image}
                        title={book.title}
                        sizes='48px'
                        className='rounded-field'
                      />
                    </div>
                    <div className='min-w-0'>
                      <p className='line-clamp-2 font-semibold'>{book.title}</p>
                      <p className='truncate text-sm text-base-content/60'>
                        by {book.author}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className='badge badge-primary badge-soft badge-sm font-semibold'>
                    {book.category}
                  </span>
                </td>
                <td>
                  <Copies book={book} />
                </td>
                <td className='whitespace-nowrap text-sm'>
                  {dateFormat.format(new Date(book.createdAt))}
                </td>
                <td>
                  <div className='flex justify-end'>
                    <Actions book={book} onDelete={setToDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className='flex flex-col gap-4 md:hidden'>
        {books.map((book) => (
          <li
            key={book._id}
            className='flex gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm'
          >
            <div className='w-20 shrink-0'>
              <BookCover
                src={book.image}
                title={book.title}
                sizes='80px'
                className='rounded-field'
              />
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
              <div>
                <p className='line-clamp-2 font-semibold leading-snug'>
                  {book.title}
                </p>
                <p className='truncate text-sm text-base-content/60'>
                  by {book.author}
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                <span className='badge badge-primary badge-soft badge-sm font-semibold'>
                  {book.category}
                </span>
                <Copies book={book} />
              </div>
              <p className='text-xs text-base-content/60'>
                Added {dateFormat.format(new Date(book.createdAt))}
              </p>
              <Actions book={book} onDelete={setToDelete} />
            </div>
          </li>
        ))}
      </ul>

      {toDelete && (
        <ConfirmModal
          title='Delete this book?'
          confirmLabel='Yes, Delete'
          pendingLabel='Deleting...'
          pending={deleteBook.isPending}
          icon={HiOutlineTrash}
          onConfirm={() => deleteBook.mutate(toDelete)}
          onClose={() => setToDelete(null)}
        >
          <p>
            <strong className='text-base-content'>
              &ldquo;{toDelete.title}&rdquo;
            </strong>{' '}
            will be removed from BookNook for good. This can&apos;t be undone.
          </p>
          {toDelete.availableCopies < toDelete.totalCopies && (
            <p className='mt-3 rounded-field border border-warning/40 bg-warning/10 p-3 text-sm text-base-content'>
              {toDelete.totalCopies - toDelete.availableCopies === 1
                ? '1 copy is borrowed right now. That borrow will be cleared too.'
                : `${toDelete.totalCopies - toDelete.availableCopies} copies are borrowed right now. Those borrows will be cleared too.`}
            </p>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}
