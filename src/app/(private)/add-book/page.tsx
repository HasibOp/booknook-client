import type { Metadata } from 'next';
import AddBookForm from '@/components/books/AddBookForm';
import SectionHeading from '@/components/ui/SectionHeading';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Add Book',
};

export default async function AddBookPage() {
  const user = await requireUser();

  return (
    <section className='container-page section-space'>
      <SectionHeading
        eyebrow='Share your shelf'
        title='Add a Book'
        subtitle='Fill in the details below and your book will appear on the BookNook shelves right away.'
      />
      <div className='mx-auto max-w-5xl rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8'>
        <AddBookForm user={{ name: user.name, email: user.email }} />
      </div>
    </section>
  );
}
