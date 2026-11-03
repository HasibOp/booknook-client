import type { Metadata } from 'next';
import MyBooksTable from '@/components/books/MyBooksTable';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'My Books',
};

export default function MyBooksPage() {
  return (
    <section className='container-page section-space flex flex-col gap-8'>
      <SectionHeading
        eyebrow='Your shelf'
        title='My Books'
        subtitle='Every book you have shared on BookNook. Edit the details or the number of copies at any time.'
      />
      <MyBooksTable />
    </section>
  );
}
