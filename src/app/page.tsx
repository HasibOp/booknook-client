import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import Spinner from "@/components/ui/Spinner";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Suspense fallback={<Spinner label="Loading new arrivals..." />}>
        <NewArrivals />
      </Suspense>
    </>
  );
}
