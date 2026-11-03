'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineCalendarDays, HiOutlineXMark } from 'react-icons/hi2';
import { apiErrorMessage, secureApi } from '@/lib/api';
import { BORROW_DAYS } from '@/lib/config';
import type { Book, Borrow } from '@/types';
import BookCover from './BookCover';

const DAY_MS = 24 * 60 * 60 * 1000;
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

type BorrowModalProps = {
  book: Pick<Book, '_id' | 'title' | 'author' | 'image'>;
  user: { name: string; email: string };
  openedAt: number;
  onClose: () => void;
};

export default function BorrowModal({
  book,
  user,
  openedAt,
  onClose,
}: BorrowModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const borrowDate = dateFormat.format(openedAt);
  const returnDate = dateFormat.format(openedAt + BORROW_DAYS * DAY_MS);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      (await secureApi.post<Borrow>('/borrows', { bookId: book._id })).data,
    onSuccess: (borrow) => {
      toast.success(
        `You borrowed "${borrow.bookTitle}". Please return it by ${dateFormat.format(new Date(borrow.returnDate))}.`,
      );
      onClose();
    },
    onError: (error) => {
      toast.error(
        apiErrorMessage(error, 'Could not borrow this book. Please try again.'),
      );
      onClose();
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['book', book._id] }),
        queryClient.invalidateQueries({ queryKey: ['my-borrows'] }),
      ]),
  });

  const requestClose = () => {
    if (!isPending) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className='modal modal-bottom sm:modal-middle'
      aria-labelledby='borrow-title'
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className='modal-box flex max-w-lg flex-col gap-5 p-6 sm:p-8'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-secondary'>
              Borrow request
            </p>
            <h2 id='borrow-title' className='text-2xl font-semibold'>
              Borrow this book
            </h2>
          </div>
          <button
            type='button'
            onClick={requestClose}
            disabled={isPending}
            className='btn btn-circle btn-ghost btn-sm'
            aria-label='Close'
          >
            <HiOutlineXMark className='size-5' />
          </button>
        </div>

        <div className='flex items-center gap-4 rounded-box bg-base-200/60 p-3'>
          <div className='w-16 shrink-0'>
            <BookCover
              src={book.image}
              title={book.title}
              sizes='64px'
              className='rounded-field'
            />
          </div>
          <div className='min-w-0'>
            <p className='line-clamp-2 font-display text-lg font-semibold leading-snug'>
              {book.title}
            </p>
            <p className='truncate text-sm text-base-content/70'>
              by {book.author}
            </p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='flex flex-col gap-1.5'>
            <span className='text-sm font-semibold'>Your Name</span>
            <input
              value={user.name}
              readOnly
              className='input w-full bg-base-200/60'
            />
          </label>
          <label className='flex flex-col gap-1.5'>
            <span className='text-sm font-semibold'>Your Email</span>
            <input
              value={user.email}
              readOnly
              className='input w-full bg-base-200/60'
            />
          </label>
          <label className='flex flex-col gap-1.5'>
            <span className='text-sm font-semibold'>Borrow Date</span>
            <input
              value={borrowDate}
              readOnly
              className='input w-full bg-base-200/60'
            />
          </label>
          <label className='flex flex-col gap-1.5'>
            <span className='text-sm font-semibold'>Return Date</span>
            <input
              value={returnDate}
              readOnly
              className='input w-full bg-base-200/60'
            />
          </label>
        </div>

        <p className='flex items-start gap-2 text-sm text-base-content/70'>
          <HiOutlineCalendarDays className='mt-0.5 size-5 shrink-0 text-primary' />
          You can keep this book for {BORROW_DAYS} days. Return it from My
          Borrows when you are done.
        </p>

        <div className='modal-action mt-0 flex-col-reverse gap-2 sm:flex-row'>
          <button
            type='button'
            onClick={requestClose}
            disabled={isPending}
            className='btn btn-ghost rounded-full'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={() => mutate()}
            disabled={isPending}
            className='btn btn-primary rounded-full px-6'
          >
            {isPending && (
              <span className='loading loading-spinner loading-sm' />
            )}
            {isPending ? 'Borrowing...' : 'Confirm Borrow'}
          </button>
        </div>
      </div>
      <div className='modal-backdrop'>
        <button
          type='button'
          onClick={requestClose}
          aria-label='Close'
          tabIndex={-1}
        >
          close
        </button>
      </div>
    </dialog>
  );
}
