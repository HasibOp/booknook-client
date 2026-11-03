'use client';

import './globals.css';

export default function GlobalError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang='en' data-theme='booknook'>
      <body className='flex min-h-screen items-center justify-center p-6'>
        <title>BookNook | Something went wrong</title>
        <div className='flex max-w-md flex-col items-center gap-4 text-center'>
          <h1 className='text-3xl font-semibold'>Something went wrong</h1>
          <p className='text-base-content/70'>
            BookNook could not load right now. Please try again in a moment.
          </p>
          <button
            type='button'
            onClick={() => retry()}
            className='btn btn-primary rounded-full px-8'
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
