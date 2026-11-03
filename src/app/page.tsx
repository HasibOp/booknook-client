import { Suspense } from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import HowItWorks from '@/components/home/HowItWorks';
import NewArrivals from '@/components/home/NewArrivals';
import TopCategories from '@/components/home/TopCategories';
import Spinner from '@/components/ui/Spinner';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Suspense fallback={<Spinner label='Loading new arrivals...' />}>
        <NewArrivals />
      </Suspense>
      <HowItWorks />
      <TopCategories />
    </>
  );
}
