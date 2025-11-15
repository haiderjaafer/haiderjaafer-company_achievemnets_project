// app/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContinuousCarousel } from "../components/AnimatedCarousel";
import { NewsScroller } from "../components/NewsScrolling";
import FooterComponent from "../components/FooterComponent";
import { useNewsTitles } from "../lib/hooks/useNewsTitles";
import SidebarComponent from "../components/Sidebar";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Fetch news titles from API
  const { data: newsItems = [], isLoading, error } = useNewsTitles();

  // Refs for animated elements
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // ============================================
      // 1. HERO SECTION ANIMATIONS (On Page Load)
      // ============================================
      
      // Timeline for sequential hero animations
      const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Animate hero container - Fade in with slight scale
      heroTimeline.from(heroRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
      });

      // Animate title - Slide up with fade
      heroTimeline.from(titleRef.current, {
        opacity: 0,
        y: 50, // Start 50px below
        duration: 0.8,
      }, '-=0.4'); // Start 0.4s before previous animation ends (overlap)

      // Animate subtitle - Slide up with fade (delayed)
      heroTimeline.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, '-=0.6'); // Overlap more for smooth flow

      // ============================================
      // 2. FEATURE CARDS ANIMATIONS (Staggered)
      // ============================================
      
      // Animate each card with stagger effect
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 80, // Start from below
        scale: 0.9, // Slightly smaller
        duration: 0.8,
        ease: 'back.out(1.2)', // Bounce effect
        stagger: {
          amount: 0.6, // Total time to stagger all cards
          from: 'start', // Start from first card
        },
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 80%', // Start when top of cards is 80% from top of viewport
          toggleActions: 'play none none none', // Only play once
        }
      });

      // ============================================
      // 3. CARD HOVER ANIMATIONS
      // ============================================
      
      // Add hover effect to each card
      cardRefs.current.forEach((card) => {
        if (!card) return;

        // Get the icon element inside the card
        const icon = card.querySelector('.card-icon');

        // Mouse enter - lift card and rotate icon
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10, // Lift up
            scale: 1.02, // Slightly bigger
            duration: 0.3,
            ease: 'power2.out',
            
          });

          // Rotate and scale icon
          gsap.to(icon, {
            rotation: 360, // Full rotation
            scale: 1.1,
            duration: 0.5,
            ease: 'back.out(2)'
          });
        });

        // Mouse leave - return to normal
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });

          // Reset icon
          gsap.to(icon, {
            rotation: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      });

      // ============================================
      // 4. PARALLAX EFFECT ON SCROLL
      // ============================================
      
      // Subtle parallax movement for hero section
      gsap.to(heroRef.current, {
        y: 50, // Move down as you scroll
        opacity: 0.8, // Fade out slightly
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1, // Smooth scrubbing, takes 1 second to "catch up"
        }
      });

      // ============================================
      // 5. FLOATING ANIMATION FOR ICONS
      // ============================================
      
      // Make icons float continuously
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const icon = card.querySelector('.card-icon');

        // Create infinite floating animation with different delays
        gsap.to(icon, {
          y: -10, // Float up
          duration: 2 + (index * 0.3), // Different duration for each icon
          repeat: -1, // Infinite
          yoyo: true, // Go back and forth
          ease: 'sine.inOut',
          delay: index * 0.2, // Stagger the start
        });
      });

    });

    // Cleanup function - kills all animations when component unmounts
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section - News Scroller (Dynamic Data from API) */}
      <NewsScroller 
        news={newsItems}
        isLoading={isLoading}
        error={error}
      />

      {/* Main Layout: Content + Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Left side: Main Content + Carousel */}
        <div className="flex flex-col flex-1">
          {/* Main Content Area */}
          <main className="flex-1 p-8 bg-white overflow-y-auto">
            {/* Hero Section */}
            <div 
              ref={heroRef}
              className="text-center mb-12"
            >
              <h1 
                ref={titleRef}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                مرحباً بك في نظام انجازية الشركة
              </h1>
              <p 
                ref={subtitleRef}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                نظام شامل وآمن لإدارة وأرشفة سجلات اللجان بشكل إلكتروني منظم
              </p>
            </div>

            {/* Feature Cards */}
            <div 
              ref={cardsContainerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {/* Card 1 - Electronic Archiving */}
              <div 
                ref={(el) => { cardRefs.current[0] = el; }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer"
              >
                <div className="card-icon w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">أرشفة إلكترونية</h3>
                <p className="text-gray-600">
                  نظام متقدم لأرشفة جميع وثائق ومستندات اللجان بشكل منظم وآمن
                </p>
              </div>

              {/* Card 2 - Quick Search */}
              <div 
                ref={(el) => { cardRefs.current[1] = el; }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer"
              >
                <div className="card-icon w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">بحث سريع</h3>
                <p className="text-gray-600">
                  إمكانية البحث السريع والوصول الفوري لجميع السجلات والوثائق
                </p>
              </div>

              {/* Card 3 - High Security */}
              <div 
                ref={(el) => { cardRefs.current[2] = el; }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer"
              >
                <div className="card-icon w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">أمان عالي</h3>
                <p className="text-gray-600">
                  حماية متقدمة للبيانات مع صلاحيات وصول محددة لكل مستخدم
                </p>
              </div>
            </div>
          </main>

          {/* Carousel - Dynamic Data from API */}
          <section className="w-full border-t border-gray-200">
            <ContinuousCarousel
              scrollSpeed={3000}
              itemsToShow={4}
              autoScroll={true}
            />
          </section>
        </div>

        {/* Right Sidebar - Fixed width */}
        <aside className="w-[200px] bg-gray-100 border-l border-gray-300 p-4 flex flex-col">
          <SidebarComponent />
        </aside>
      </div>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}