'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TimelineWithEaseProps } from './types';
import styles from './styles/Header.module.css';

const Header: React.FC<TimelineWithEaseProps> = ({ timeline, ease }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const menuItem1Ref = useRef<HTMLDivElement>(null);
  const menuItem2Ref = useRef<HTMLDivElement>(null);
  const menuItem3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SET initial state for logo
    gsap.set(logoRef.current, {
      opacity: 0,
      y: 100,
    });

    // ANIMATE logo TO visible
    timeline.to(logoRef.current, {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: ease,
    });

    // SET initial state for menu items
    const menuItems = [menuItem1Ref.current, menuItem2Ref.current, menuItem3Ref.current];
    gsap.set(menuItems, {
      opacity: 0,
      y: -200,
    });

    // ANIMATE menu items TO visible
    timeline.to(menuItems, {
      duration: 2,
      opacity: 1,
      y: 0,
      stagger: {
        amount: 0.4,
      },
      ease: ease,
    });
  }, [timeline, ease]);

  return (
    <div className={styles.header}>
      <div className={styles.logo} ref={logoRef}>
        Logo
      </div>

      <div className={styles.menu}>
        <div className={styles.menuItem} ref={menuItem1Ref}>
          About
        </div>
        <div className={styles.menuItem} ref={menuItem2Ref}>
          Journal
        </div>
        <div className={styles.menuItem} ref={menuItem3Ref}>
          Contact
        </div>
      </div>
    </div>
  );
};

export default Header;