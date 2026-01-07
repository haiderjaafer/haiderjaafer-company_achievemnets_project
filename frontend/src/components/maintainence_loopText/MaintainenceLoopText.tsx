'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import styles from './MaintainenceLoopText.module.css';

gsap.registerPlugin(TextPlugin, useGSAP);

export default function MaintainenceLoopText() {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useGSAP(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        duration: 3,
        text: "وزارة النفط - شركة مصافي الوسط - مصفى الدورة -هيأة الصيانة",
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 1,
        onRepeat: () => {
          console.log("on repeat - toggling active state");
          setIsActive(prev => {
            console.log("Active state changing from", prev, "to", !prev);
            return !prev;
          });
        }
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.loopTextContainer}>
      <div 
        ref={textRef} 
        className={`${styles.text} ${isActive ? styles.active : ''}`}
      >
        {/* Initial text (will be animated) */}
      </div>
    </div>
  );
}