import type { Metadata } from 'next';
import MyBorrowsTable from '@/components/borrows/MyBorrowsTable';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'My Borrows',
};

export default function MyBorrowsPage() {
  return (
    <section className='container-page section-space flex flex-col gap-8'>
      <SectionHeading
        eyebrow='Currently reading'
        title='My Borrows'
        subtitle='The books you have borrowed and when they are due back. Return a book here once you have finished it.'
      />
      <MyBorrowsTable />
    </section>
  );
}
