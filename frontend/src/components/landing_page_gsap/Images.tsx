'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TimelineWithEaseProps } from './types';
import styles from './styles/Images.module.css';

const Images: React.FC<TimelineWithEaseProps> = ({ timeline, ease }) => {
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // === IMAGE 1 ===
    // SET initial state
    gsap.set(image1Ref.current, {
      opacity: 0,
      y: 1200,
      scale: 1.6,
    });

    // ANIMATE TO visible
    timeline.to(
      image1Ref.current,
      {
        duration: 1.2,
        y: 0,
        opacity: 1,
        ease: ease,
      },
      '-=1'
    );
    
    timeline.to(
      image1Ref.current,
      {
        duration: 2,
        scale: 1,
        ease: ease,
      },
      '-=1.2'
    );

    // === IMAGE 2 ===
    // SET initial state
    gsap.set(image2Ref.current, {
      opacity: 0,
      y: 1200,
      scale: 1.6,
    });

    // ANIMATE TO visible
    timeline.to(
      image2Ref.current,
      {
        duration: 1.2,
        y: 0,
        opacity: 1,
        ease: ease,
      },
      '-=1'
    );
    
    timeline.to(
      image2Ref.current,
      {
        duration: 2,
        scale: 1,
        ease: ease,
      },
      '-=1'
    );

    // === IMAGE 3 ===
    // SET initial state
    gsap.set(image3Ref.current, {
      opacity: 0,
      y: 1200,
      scale: 1.6,
    });

    // ANIMATE TO visible
    timeline.to(
      image3Ref.current,
      {
        duration: 1.2,
        y: 0,
        opacity: 1,
        ease: ease,
      },
      '-=1'
    );
    
    timeline.to(
      image3Ref.current,
      {
        duration: 2,
        scale: 1,
        ease: ease,
      },
      '-=1'
    );
  }, [timeline, ease]);

  return (
    <div className={styles.images}>
      <div className={styles.box1} ref={image1Ref}></div>
      <div className={styles.box2} ref={image2Ref}></div>
      <div className={styles.box3} ref={image3Ref}></div>
    </div>
  );
};

export default Images;