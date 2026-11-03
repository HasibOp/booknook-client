import type { IconType } from 'react-icons';
import {
  HiOutlineArrowUturnLeft,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

const steps: { icon: IconType; title: string; text: string }[] = [
  {
    icon: HiOutlineMagnifyingGlass,
    title: 'Find a book',
    text: 'Browse All Books or jump into a category. Every card shows how many copies are free right now.',
  },
  {
    icon: HiOutlineBookOpen,
    title: 'Borrow it',
    text: 'Open the book, press Borrow This Book and confirm. One copy is set aside for you instantly.',
  },
  {
    icon: HiOutlineCalendarDays,
    title: 'Enjoy it for 7 days',
    text: 'Your book and its return date appear in My Borrows, so you always know when it is due back.',
  },
  {
    icon: HiOutlineArrowUturnLeft,
    title: 'Return it',
    text: 'Finished reading? Return it with one click and the copy goes straight back on the shelf.',
  },
];

export default function HowItWorks() {
  return (
    <section className='bg-base-200'>
      <div className='container-page section-space'>
        <SectionHeading
          eyebrow='Simple as one, two, three'
          title='How Borrowing Works'
          subtitle='No library card, no queues and no late fees. Borrowing a book on BookNook takes less than a minute.'
        />

        <ol className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map(({ icon: Icon, title, text }, index) => (
            <Reveal
              as='li'
              key={title}
              delay={index * 0.1}
              className='relative flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm'
            >
              <span className='absolute right-5 top-4 font-display text-5xl font-semibold text-base-content/10'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className='flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                <Icon className='size-6' />
              </span>
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-sm leading-relaxed text-base-content/70'>
                {text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
