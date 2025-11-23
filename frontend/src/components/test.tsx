'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLImageElement>(null);

  // LOCAL IMAGES → No more 404/403 ever again
  const barrelUrl = "/images/oil-barrel.png";
//   const tankerUrl = "/images/oil-tanker-truck.png";
//   const refineryUrl = "/images/oil-refinery.png";

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
      }
    });

    // Journey: Section 1 → 2 → 3
    tl.to(barrelRef.current, {
      x: "60vw",
      y: "125vh",
      rotation: 460,
      scale: 1.2,
      ease: "none",
      duration: 4,
    })
    .to(barrelRef.current, { duration: 2 }, "+=0.5") // pause in section 2
    .to(barrelRef.current, {
      x: "68vw",
      y: "290vh",
      rotation: 920,
      scale: 1,
      ease: "none",
      duration: 4,
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={container} className="relative bg-black text-white overflow-hidden">
      <div className="relative">

        {/* Section 1 */}
        <section className="h-screen flex items-center justify-between px-16">
          <div className="max-w-3xl">
            <h1 className="text-8xl font-black leading-none mb-8">
              Powering<br />the World<br />
              <span className="text-orange-500">One Barrel</span> at a Time
            </h1>
            <p className="text-2xl text-gray-300">
              Iraq’s leading refinery delivering excellence worldwide.
            </p>
          </div>

          {/* Moving Barrel */}
          <motion.div
            ref={barrelRef}
            className="absolute z-50 pointer-events-none"
            initial={{ scale: 0, rotate: -270 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "backOut" }}
          >
            <Image
              src={barrelUrl}
              alt="Oil Barrel"
              width={320}
              height={420}
              priority
              className="drop-shadow-2xl"
            />
          </motion.div>
        </section>

        {/* Section 2 */}
        <section className="h-screen flex items-center justify-between px-16">
          <div className="max-w-2xl">
            <h2 className="text-7xl font-bold mb-8">
              Advanced<br />
              <span className="text-cyan-400">Refining Technology</span>
            </h2>
            <p className="text-xl text-gray-300">
              Cutting-edge distillation and cracking processes for maximum efficiency and purity.
            </p>
          </div>
          {/* <Image
            src={refineryUrl}
            alt="Refinery"
            width={800}
            height={600}
            className="opacity-90"
          /> */}
        </section>

        {/* Section 3 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center z-10">
            <h2 className="text-7xl font-bold mb-8">
              Global<br />
              <span className="text-green-400">Delivery Network</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
              Our modern fleet guarantees on-time delivery to every corner of the planet.
            </p>
            <button className="px-16 py-6 bg-orange-600 hover:bg-orange-500 text-2xl font-bold rounded-full shadow-2xl hover:scale-110 transition">
              Get In Touch
            </button>
          </div>

          {/* Tanker waiting for the barrel */}
          <div className="absolute bottom-10 right-10">
            {/* <Image
              src={tankerUrl}
              alt="Oil Tanker Truck"
              width={1100}
              height={600}
              className="drop-shadow-2xl"
            /> */}
          </div>
        </section>

      </div>
    </div>
  );
}