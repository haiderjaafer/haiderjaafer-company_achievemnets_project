// app/page.tsx
import { Carousel } from "@/src/components/Carousel";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("../src/components/hero/Hero"), {
  loading: () => <p>Loading Hero...</p>,
});

export default function HomePage() {
  return (
    <div className="container">
      <section id="home">
        {/* <Hero /> */}
        <Carousel/>

      </section>
      {/* Repeat for other sections when you enable them */}
    </div>
  );
}
