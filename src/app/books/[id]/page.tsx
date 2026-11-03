import type { Metadata } from 'next';
import BookDetails from '@/components/books/BookDetails';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Book Details',
};

export default async function BookDetailsPage({
  params,
}: PageProps<'/books/[id]'>) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  return (
    <section className='container-page section-space'>
      <BookDetails id={id} user={{ name: user.name, email: user.email }} />
    </section>
  );
}
