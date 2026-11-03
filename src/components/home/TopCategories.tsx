import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  HiArrowRight,
  HiOutlineBeaker,
  HiOutlineBuildingLibrary,
  HiOutlineFaceSmile,
  HiOutlineLightBulb,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Category } from '@/types';

const categories: {
  name: Category;
  icon: IconType;
  text: string;
  tone: string;
}[] = [
  {
    name: 'Fiction',
    icon: HiOutlineSparkles,
    text: 'Novels and stories that pull you into another world.',
    tone: 'bg-primary/10 text-primary',
  },
  {
    name: 'Science',
    icon: HiOutlineBeaker,
    text: 'Space, nature and the big ideas behind how things work.',
    tone: 'bg-info/10 text-info',
  },
  {
    name: 'History',
    icon: HiOutlineBuildingLibrary,
    text: 'True stories of the people and events that shaped us.',
    tone: 'bg-secondary/10 text-secondary',
  },
  {
    name: 'Kids',
    icon: HiOutlineFaceSmile,
    text: 'Bright, playful books for young and curious readers.',
    tone: 'bg-accent/15 text-warning',
  },
  {
    name: 'Others',
    icon: HiOutlineLightBulb,
    text: 'Self-help, psychology and everything in between.',
    tone: 'bg-success/10 text-success',
  },
];

export default function TopCategories() {
  return (
    <section className='container-page section-space'>
      <SectionHeading
        eyebrow='Explore the shelves'
        title='Top Categories'
        subtitle='Know what you are in the mood for? Pick a shelf and see every book we have in it.'
      />

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-5'>
        {categories.map(({ name, icon: Icon, text, tone }, index) => (
          <Reveal key={name} delay={index * 0.08} className='h-full'>
            <Link
              href={`/books?category=${name}`}
              className='group flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg'
            >
              <span
                className={`flex size-14 items-center justify-center rounded-2xl ${tone}`}
              >
                <Icon className='size-7' />
              </span>
              <div className='flex flex-1 flex-col gap-2'>
                <h3 className='text-xl font-semibold'>{name}</h3>
                <p className='text-sm leading-relaxed text-base-content/70'>
                  {text}
                </p>
              </div>
              <span className='flex items-center gap-1.5 text-sm font-semibold text-primary'>
                Browse {name}
                <HiArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
