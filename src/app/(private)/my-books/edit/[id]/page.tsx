import type { Metadata } from 'next';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi2';
import EditBookForm from '@/components/books/EditBookForm';
import SectionHeading from '@/components/ui/SectionHeading';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Edit Book',
};

export default async function EditBookPage({
  params,
}: PageProps<'/my-books/edit/[id]'>) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  return (
    <section className='container-page section-space flex flex-col gap-6'>
      <Link
        href='/my-books'
        className='btn btn-ghost btn-sm w-fit rounded-full'
      >
        <HiArrowLeft className='size-4' />
        Back to My Books
      </Link>
      <SectionHeading
        eyebrow='Update your book'
        title='Edit Book'
        subtitle='Change any detail below. Keep the current cover, or choose a new image to replace it.'
      />
      <div className='mx-auto w-full max-w-5xl rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8'>
        <EditBookForm id={id} user={{ name: user.name, email: user.email }} />
      </div>
    </section>
  );
}
