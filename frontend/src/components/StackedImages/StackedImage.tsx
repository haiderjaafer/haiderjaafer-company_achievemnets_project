'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Roboto } from 'next/font/google';
import styles from './StackedCards.module.css';

// Load Roboto font via Next.js
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

interface CardData {
  id: number;
  text: string;
  image: string;
}

const cards: CardData[] = [
  {
    id: 1,
    text: "A perfect blend of chocolate and citrus – zesty and unforgettable.",
    image: '/img/img1.jpg'
  },
  {
    id: 2,
    text: "Banana cake topped with silky cream – sweet and perfectly baked.",
    image: "/img/img2.jpg"
  },
  {
    id: 3,
    text: "Golden caramel drapes over every bite – rich and irresistibly sweet.",
    image: "/img/img3.jpg"
  },
  {
    id: 4,
    text: "A classic brownie with a molten center – intense and pure bliss.",
    image: "/img/img4.jpg"
  },
   {
    id: 5,
    text: "A classic brownie with a molten center – intense and pure bliss.",
    image: "/img/img5.jpg"
  },
   {
    id: 6,
    text: "A classic brownie with a molten center – intense and pure bliss.",
    image: "/img/img6.jpg"
  }
];

const StackedCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);



  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // FIX: Add 'as HTMLElement[]' to these three lines
      const contents = gsap.utils.toArray(`.${styles.content}`) as HTMLElement[];
      const texts = gsap.utils.toArray(`.${styles.text}`) as HTMLElement[];
      const imageWrappers = gsap.utils.toArray(`.${styles.imgWrapper}`) as HTMLElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: "+=" + (contents.length * 100) + "%",
          scrub: 2,
        }
      });

      // Now TypeScript knows imageWrappers[0] is an HTMLElement
      tl.to(imageWrappers[0], { rotate: -3 }, 0);

      contents.forEach((_, i) => {
        if (i === contents.length - 1) return;

        tl.to(texts[i], { opacity: 0, duration: 1 }, "+=0.5")
          .to(imageWrappers[i + 1], {
            scale: 1,
            duration: 2,
            y: (i + 1) * 5,
            x: (i + 1) * -5,
            opacity: 1,
            rotate: (i + 1) * 3 + (i % 2 === 0 ? 1 : -1),
          }, "<")
          .to(texts[i + 1], { 
            opacity: 1, 
            y: -20, 
            duration: 1 
          }, "<+=1"); 
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);


  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${roboto.className}`}
    >
      {cards.map((card, index) => (
        <div 
          key={card.id} 
          className={`${styles.content} ${index !== 0 ? styles.hiddenItem : ''}`}
        >
          {/* <p className={styles.text}>
            {card.text}
          </p> */}
          <div className={styles.imgWrapper}>
            {/* Using standard img for easier external loading. 
                Switch to <Image /> if you configure next.config.js for Unsplash */}
            <img 
              src={card.image} 
              alt={`Card ${index + 1}`} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StackedCards;