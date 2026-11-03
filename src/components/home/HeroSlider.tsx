'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { HiArrowRight } from 'react-icons/hi2';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    image: '/images/hero/library-lights.webp',
    eyebrow: 'Welcome to BookNook',
    title: 'Find your next favourite book',
    text: "Browse a growing shelf of novels, science, history and children's books, all shared by readers like you.",
  },
  {
    image: '/images/hero/classic-shelves.webp',
    eyebrow: 'Borrow in one click',
    title: 'Take a book home for a week',
    text: 'Borrow any available book for 7 days. Your books and their return dates stay neatly organised in one place.',
  },
  {
    image: '/images/hero/curved-library.webp',
    eyebrow: 'Share your shelf',
    title: 'Give your books a second life',
    text: 'Add the books you love so other readers can enjoy them too. Every book you share helps the library grow.',
  },
  {
    image: '/images/hero/book-spines.webp',
    eyebrow: 'Return and repeat',
    title: 'Finished a story? Start another',
    text: 'Return a book in a single click so the next reader can pick it up, then choose your next adventure.',
  },
];

export default function HeroSlider() {
  return (
    <section aria-label='Featured' className='hero-slider relative'>
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect='fade'
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        navigation
        className='h-[min(78vh,640px)] min-h-120'
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className='relative h-full w-full'>
              <Image
                src={slide.image}
                alt=''
                fill
                priority={index === 0}
                sizes='100vw'
                className='object-cover'
              />
              <div className='absolute inset-0 bg-linear-to-r from-neutral/90 via-neutral/65 to-neutral/10' />
              <div className='container-page relative flex h-full items-center'>
                <div className='flex max-w-xl flex-col gap-5 text-neutral-content'>
                  <span className='w-fit rounded-full border border-accent/70 bg-neutral/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent'>
                    {slide.eyebrow}
                  </span>
                  <h2 className='text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl'>
                    {slide.title}
                  </h2>
                  <p className='max-w-md text-base leading-relaxed text-neutral-content/85 sm:text-lg'>
                    {slide.text}
                  </p>
                  <Link
                    href='/books'
                    className='btn btn-accent btn-lg mt-2 w-fit rounded-full px-8'
                  >
                    Browse Books
                    <HiArrowRight className='size-5' />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
