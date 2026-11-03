'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogoMark } from '@/components/layout/Logo';

type BookCoverProps = {
  src: string;
  title: string;
  author?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function BookCover({
  src,
  title,
  author,
  sizes,
  priority,
  className = '',
}: BookCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  return (
    <div
      className={`relative aspect-3/4 w-full overflow-hidden bg-base-200 ${className}`}
    >
      {failed ? (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-neutral via-neutral to-primary/70 p-5 text-center text-neutral-content'>
          <LogoMark className='size-10 opacity-80' />
          <p className='line-clamp-3 font-display text-lg font-semibold leading-snug'>
            {title}
          </p>
          {author && (
            <p className='text-xs uppercase tracking-widest text-neutral-content/70'>
              {author}
            </p>
          )}
        </div>
      ) : (
        <Image
          src={src}
          alt={`Cover of ${title}`}
          fill
          priority={priority}
          sizes={
            sizes ?? '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'
          }
          onError={() => setFailedSrc(src)}
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
      )}
    </div>
  );
}
