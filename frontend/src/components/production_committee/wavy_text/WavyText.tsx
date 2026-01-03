
'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import styles from './WavyText.module.css';

gsap.registerPlugin(SplitText, useGSAP);

export default function WavyText() {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (textRef.current) {
      // Split text into words
      const split = new SplitText(textRef.current, { type: "words" });

      // Animate words
      gsap.from(split.words, {
        y: -80,
        autoAlpha: 0,
        stagger: 0.20,
        duration: 1,
        // repeat:-1,
        ease: "power4.inOut",
        delay: 0.5,
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.textContainer}>
      <div ref={textRef} className={styles.text}>
       هيأة الانتاج قسم التكرير يقوم باستلام النفط الخام ويقوم بتكريرة الى مشتقات مثلا البنزين المحسن والغاز وغيرها
      </div>
    </div>
  );
}