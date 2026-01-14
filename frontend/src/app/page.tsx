'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from './horizontalScroll.module.css';
import { NewsScroller } from '../components/NewsScrolling';
import HomePage from '../components/landing_page_gsap/MainPage';
import { ContinuousCarousel } from '../components/AnimatedCarousel';
import { useNewsTitles } from '../lib/hooks/useNewsTitles';
import LoopText from '../components/loopText/LoopText';
import FooterComponent from '../components/FooterComponent';
import ProductionCommitteeLoopText from '../components/production_committee_loopText/ProductionCommitteeLoopText';
import WavyText from '../components/production_committee/wavy_text/WavyText';
import ProductionCommitteeImagesCarousel from '../components/production_committee/production_committee_images_carousel/ProductionCommitteeImagesCarousel';
import ProductionChart from '../components/production_committee/production_chart/ProductionChart';
import MaintainenceLoopText from '../components/maintainence_loopText/MaintainenceLoopText';
import { Navbar } from '@/components/Navbar';
// import Navbar from '../components/navbar/Navbar';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);




// Pie chart data - Maintenance status totals
const maintenanceStatusData = [
  { name: 'مكتملة', value: 847, color: '#22c55e' },
  { name: 'قيد التنفيذ', value: 156, color: '#eab308' },
  { name: 'معلقة', value: 89, color: '#ef4444' },
];

export default function Home() {

  const { data: newsItems } = useNewsTitles();

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);


  useGSAP(() => {
  // Wait for DOM to be ready
  if (horizontalWrapperRef.current && horizontalSectionRef.current) {
    const wrapper = horizontalWrapperRef.current;
    
    gsap.to(wrapper, {
      x: () => -(wrapper.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSectionRef.current,
        start: 'top top',
        end: () => `+=${wrapper.scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
      },
    });
  }

  // ADD THIS: Refresh ScrollTrigger after all sections load
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);

}, { scope: mainContainerRef });




  // useGSAP hook for horizontal scroll animation
  // useGSAP(() => {
  //   // Wait for DOM to be ready
  //   if (horizontalWrapperRef.current && horizontalSectionRef.current) {
  //     const wrapper = horizontalWrapperRef.current;
      
  //     gsap.to(wrapper, {
  //       x: () => -(wrapper.scrollWidth - window.innerWidth),
  //       ease: 'none',
  //       scrollTrigger: {
  //         trigger: horizontalSectionRef.current,
  //         start: 'top top',
  //         end: () => `+=${wrapper.scrollWidth}`,
  //         scrub: 1,
  //         pin: true,
  //         anticipatePin: 1,
  //         invalidateOnRefresh: true,
  //         markers: false, // Set to true for debugging
  //       },
  //     });
  //   }
  // }, { scope: mainContainerRef });

  // Navigation click handler
  const handleNavClick = (sectionId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: sectionId,
        offsetY: 0,
      },
      ease: 'power2.inOut',
    });
  };

  return (
    <>
      {/* News Scroller - Fixed at top */}
      <div className="shrink-0 z-20 fixed top-0 left-0 right-0">
        <NewsScroller news={newsItems} />

         <div>
        {/* <Navbar/> */}
        <Navbar/>
      </div>
      </div>

     

      <div ref={mainContainerRef} className={styles.mainContent}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#section-1')}
          >
            الصيانة
          </a>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#section-2')}
          >
            الاعلام
          </a>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#section-3')}
          >
            التكرير
          </a>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#section-4')}
          >
            هيأة الدهون
          </a>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#horizontal-section')}
          >
            مصفى كربلاء
          </a>
          <a 
            className={styles.menuItem} 
            onClick={() => handleNavClick('#horizontal-section')}
          >
            الموارد البشرية
          </a>
        </nav>

        {/* Section 1: HomePage (GSAP Landing Page) */}
        <section dir='' id="section-1" className={styles.section}>
          <MaintainenceLoopText/>
          <HomePage />
        </section>

        {/* Section 2: ContinuousCarousel at bottom */}
<section 
  id="section-2" 
  className={`${styles.section} ${styles.section2} `}
>
   <LoopText/>
 


  <div className=" absolute left-10 top-[20%] bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-[400px]">
                      <h4 className="text-lg font-bold text-gray-900  text-center">
                        حالة أعمال الاعلام
                      </h4>
                      <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={maintenanceStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={60}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                              labelLine={{ stroke: '#374151', strokeWidth: 1 }}
                            >
                              {maintenanceStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#ffffff', 
                                border: '2px solid #8b5cf6',
                                borderRadius: '12px',
                                padding: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                              }}
                              formatter={(value: number, name: string) => [value, name]}
                            />
                            <Legend 
                              verticalAlign="bottom"
                              iconType="circle"
                              wrapperStyle={{ paddingTop: '20px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                        </div>
                    
 
  
               <div className={styles.carouselContainer}>
                   <ContinuousCarousel />
                      </div>
</section>

        {/* Section 3 */}
        <section id="section-3" className={`${styles.section} ${styles.section3}`}>
          <ProductionCommitteeLoopText/>
          {/* <h1>Section 3</h1> */}
          {/* Production Chart - Top Right */}
          <ProductionChart />

          <ProductionCommitteeImagesCarousel/>

          <WavyText/>
        </section>

        {/* Section 4 */}
        <section id="section-4" className={`${styles.section} ${styles.section4}`}>
          <h1>هيأة الدهون</h1>

        </section>

        {/* Horizontal Scroll Container */}
        <div 
          id="horizontal-section" 
          ref={horizontalSectionRef} 
          className={styles.horizontalSection}
        >
          <div ref={horizontalWrapperRef} className={styles.horizontalWrapper}>
            {/* Section 5 */}
            <section id="section-5" className={`${styles.horizontalPanel} ${styles.section5}`}>
              <h1>مصفى كربلاء</h1>
            </section>

            {/* Section 6 */}
            <section id="section-6" className={`${styles.horizontalPanel} ${styles.section6}`}>
              <h1>Section 6</h1>
            </section>
          </div>
        </div>
         <div className="shrink-0 z-20">
        <FooterComponent />
      </div>
      </div>
    </>
  );
}