import Link from 'next/link';
import { HiOutlineBookOpen } from 'react-icons/hi2';

type EmptyStateProps = {
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function EmptyState({
  title,
  text,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className='mx-auto flex max-w-md flex-col items-center gap-4 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center'>
      <span className='flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
        <HiOutlineBookOpen className='size-8' />
      </span>
      <h3 className='text-2xl font-semibold'>{title}</h3>
      <p className='text-base-content/70'>{text}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className='btn btn-primary mt-2 rounded-full px-6'
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
