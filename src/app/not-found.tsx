import type { Metadata } from 'next';
import Link from 'next/link';
import { HiArrowLeft, HiOutlineBookOpen } from 'react-icons/hi2';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <section className='container-page section-space flex flex-1 items-center justify-center'>
      <div className='flex max-w-xl flex-col items-center gap-6 text-center'>
        <div className='relative'>
          <p
            className='font-display text-8xl font-semibold leading-none text-primary/15 sm:text-9xl'
            aria-hidden='true'
          >
            404
          </p>
          <span className='absolute inset-0 flex items-center justify-center'>
            <span className='flex size-20 items-center justify-center rounded-full bg-secondary text-secondary-content shadow-lg'>
              <HiOutlineBookOpen className='size-10' />
            </span>
          </span>
        </div>
        <div className='flex flex-col gap-3'>
          <span className='text-xs font-bold uppercase tracking-[0.25em] text-secondary'>
            Page not found
          </span>
          <h1 className='text-3xl font-semibold sm:text-4xl'>
            This page has wandered off the shelf
          </h1>
          <p className='text-base-content/70'>
            The page you are looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back to the books.
          </p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Link href='/' className='btn btn-primary rounded-full px-8'>
            <HiArrowLeft className='size-5' />
            Back to Home
          </Link>
          <Link href='/books' className='btn btn-ghost rounded-full px-6'>
            Browse All Books
          </Link>
        </div>
      </div>
    </section>
  );
}
