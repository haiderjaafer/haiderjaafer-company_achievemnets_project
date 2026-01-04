// Type definitions for GSAP timeline and animation properties
import { gsap } from 'gsap';

/**
 * Timeline props interface
 * Used for components that receive GSAP timeline as a prop
 */
export interface TimelineProps {
  timeline: gsap.core.Timeline; // GSAP timeline instance for coordinated animations
}

/**
 * Common GSAP easing strings
 * You can use any of these or any other GSAP ease string
 */
export type GsapEase = 
  | 'power3.out'
  | 'power3.in'
  | 'power3.inOut'
  | 'power2.out'
  | 'power2.in'
  | 'power2.inOut'
  | 'power1.out'
  | 'power1.in'
  | 'power1.inOut'
  | 'elastic.out'
  | 'elastic.in'
  | 'elastic.inOut'
  | 'back.out'
  | 'back.in'
  | 'back.inOut'
  | 'bounce.out'
  | 'bounce.in'
  | 'bounce.inOut'
  | 'circ.out'
  | 'circ.in'
  | 'circ.inOut'
  | 'expo.out'
  | 'expo.in'
  | 'expo.inOut'
  | 'sine.out'
  | 'sine.in'
  | 'sine.inOut'
  | string; // Allow any string for custom eases

/**
 * Extended timeline props with easing function
 * Used for components that need both timeline and custom easing
 */
export interface TimelineWithEaseProps extends TimelineProps {
  ease: string | GsapEase; // GSAP easing string (e.g., 'power3.out', 'elastic.out', etc.)
}