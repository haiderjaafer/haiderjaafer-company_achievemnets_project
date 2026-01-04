'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ProductionCommitteeImagesCarousel.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ProductionCommitteeImagesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Get all images
    const allImages = [
      ...(img1Ref.current?.querySelectorAll('img') || []),
      ...(img2Ref.current?.querySelectorAll('img') || []),
      ...(img3Ref.current?.querySelectorAll('img') || []),
    ];

    // Set initial state
    gsap.set(allImages, {
      y: -500,
      opacity: 0,
    });

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center', // Start when top of container hits center of viewport
        end: 'bottom center',
        toggleActions: 'play none none reverse',
        // markers: true, // Enable for debugging
      },
    });

    // Animation 1: Images slide DOWN from above viewport (reveal)
    tl.to(allImages, {
      y: 0,
      stagger: 0.2,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    // Animation 2: Images slide DOWN out of viewport (disappear)
    tl.to(allImages, {
      y: 300,
      stagger: 0.2,
      duration: 1,
      ease: "power2.in",
    }, "+=0.5"); // 0.5 second pause

    // Animation 3: Images slide BACK UP into viewport (return)
    tl.to(allImages, {
      y: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out",
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.rwrap}>
      {/* Image Group 1 */}
      <div ref={img1Ref} className={styles.img1}>
        <img src="/productionCommittee/01.jpg" alt="Production 1" />
        <img src="/productionCommittee/2.jpg" alt="Production 2" />
        <img src="/productionCommittee/3.jpg" alt="Production 3" />
      </div>

      {/* Image Group 2 */}
      <div ref={img2Ref} className={styles.img1}>
        <img src="/productionCommittee/04.jpg" alt="Production 4" />
        <img src="/productionCommittee/05.jpg" alt="Production 5" />
        <img src="/productionCommittee/06.jpg" alt="Production 6" />
      </div>

      {/* Image Group 3 */}
      <div ref={img3Ref} className={styles.img1}>
        <img src="/productionCommittee/07.jpg" alt="Production 7" />
        <img src="/productionCommittee/08.jpg" alt="Production 8" />
        <img src="/productionCommittee/09.jpg" alt="Production 9" />
      </div>
    </div>
  );
}