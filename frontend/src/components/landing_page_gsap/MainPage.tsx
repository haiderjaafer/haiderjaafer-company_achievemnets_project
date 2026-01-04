'use client'; // Enable client-side rendering for GSAP animations

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'; // Import GSAP library
import styles from './styles/Hero.module.css';

import Images from './Images';
import Header from './Header';
import Content from './Content';

/**
 * Home Page Component
 * Main landing page that orchestrates all animated components
 * Creates a master GSAP timeline and distributes it to child components
 * 
 * @returns {JSX.Element} Complete hero section with header, content, and images
 */
export default function HomePage() {
  // Ref to store the GSAP timeline instance
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // State to track if timeline is ready
  const [isReady, setIsReady] = useState(false);

  /**
   * useEffect hook to initialize GSAP timeline on component mount
   */
  useEffect(() => {
    // Create a new GSAP timeline for coordinating all animations
    timelineRef.current = gsap.timeline();
    
    // Mark as ready so components can render
    setIsReady(true);

    // Cleanup function: kill timeline when component unmounts
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Define custom easing function
  const ease = 'power3.out';

  // Show loading or empty state while timeline initializes
  if (!isReady || !timelineRef.current) {
    return (
      <div className={styles.hero}>
        <div className={styles.container}>
          {/* Empty div while initializing */}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.hero}>
      {/* Header: Logo and navigation menu */}
      {/* <Header timeline={timelineRef.current} ease={ease} /> */}

      {/* Main content container: holds text content and images */}
      <div className={styles.container}>
        {/* Content: Hero text and CTA button */}
        <Content timeline={timelineRef.current} />

        {/* Images: Three overlapping image boxes */}
        <Images timeline={timelineRef.current} ease={ease} />
      </div>
    </div>
  );
}