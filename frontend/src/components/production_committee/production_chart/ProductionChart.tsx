'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './ProductionChart.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const productionData = [
  { day: '1', crudeInput: 45000, production: 42000 },
  { day: '2', crudeInput: 46000, production: 43000 },
  { day: '3', crudeInput: 44500, production: 41500 },
  { day: '4', crudeInput: 47000, production: 44000 },
  { day: '5', crudeInput: 45500, production: 42500 },
  { day: '6', crudeInput: 46500, production: 43500 },
  { day: '7', crudeInput: 45000, production: 42000 },
  { day: '8', crudeInput: 48000, production: 45000 },
  { day: '9', crudeInput: 47500, production: 44500 },
  { day: '10', crudeInput: 46000, production: 43000 },
  { day: '11', crudeInput: 45500, production: 42500 },
  { day: '12', crudeInput: 47000, production: 44000 },
  { day: '13', crudeInput: 46500, production: 43500 },
  { day: '14', crudeInput: 45000, production: 42000 },
  { day: '15', crudeInput: 48500, production: 45500 },
  { day: '16', crudeInput: 47000, production: 44000 },
  { day: '17', crudeInput: 46000, production: 43000 },
  { day: '18', crudeInput: 45500, production: 42500 },
  { day: '19', crudeInput: 47500, production: 44500 },
  { day: '20', crudeInput: 46500, production: 43500 },
  { day: '21', crudeInput: 45000, production: 42000 },
  { day: '22', crudeInput: 48000, production: 45000 },
  { day: '23', crudeInput: 47000, production: 44000 },
  { day: '24', crudeInput: 46500, production: 43500 },
  { day: '25', crudeInput: 45500, production: 42500 },
  { day: '26', crudeInput: 47500, production: 44500 },
  { day: '27', crudeInput: 46000, production: 43000 },
  { day: '28', crudeInput: 45000, production: 42000 },
  { day: '29', crudeInput: 47000, production: 44000 },
  { day: '30', crudeInput: 46500, production: 43500 },
];

export default function ProductionChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Use regular useEffect to ensure DOM is ready
  useEffect(() => {
    if (!chartRef.current) return;

    // Set initial state
    gsap.set(chartRef.current, {
      x: 700,
      opacity: 0,
      rotationY: 90,
      scale: 0.6,
    });

    // Small delay to ensure ScrollTrigger is ready
    const timer = setTimeout(() => {
      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();

      // Create ScrollTrigger
      const trigger = ScrollTrigger.create({
        trigger: chartContainerRef.current,
        start: 'top 80%', // Start when container is 80% down the viewport
        end: 'bottom 20%',
        // markers: true, // Enable for debugging
        once: true,
        onEnter: () => {
          console.log('Chart ScrollTrigger fired!');
          
          // Animate chart in
          gsap.to(chartRef.current, {
            x: 0,
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 1.8,
            ease: 'back.out(1.7)',
            onComplete: () => {
              // Animate bars after chart is in
              animateBars();
            }
          });
        },
      });

      return () => {
        trigger.kill();
      };
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const animateBars = () => {
    setTimeout(() => {
      const bars = chartRef.current?.querySelectorAll('.recharts-bar-rectangle');
      if (bars && bars.length > 0) {
        console.log('Animating', bars.length, 'bars');
        gsap.from(bars, {
          scaleY: 0,
          transformOrigin: 'bottom',
          stagger: 0.015,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      }
    }, 100);
  };

  return (
    <div ref={chartContainerRef} className={styles.chartContainer}>
      <div ref={chartRef} className={styles.chart}>
        <h3 className={styles.chartTitle}>
          📊 إنتاج قسم التكرير - شهري
        </h3>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={productionData}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis
              dataKey="day"
              tick={{ fill: '#374151', fontSize: 10 }}
              axisLine={{ stroke: '#9ca3af' }}
              label={{ 
                value: 'اليوم', 
                position: 'insideBottom', 
                offset: -20,
                style: { fontSize: 12, fontWeight: 'bold' }
              }}
            />
            
            <YAxis
              tick={{ fill: '#374151', fontSize: 10 }}
              axisLine={{ stroke: '#9ca3af' }}
              label={{ 
                value: 'برميل/يوم', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12, fontWeight: 'bold' }
              }}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  crudeInput: 'النفط الخام المدخل',
                  production: 'الإنتاج',
                };
                return [value.toLocaleString(), labels[name] || name];
              }}
              labelFormatter={(label) => `اليوم ${label}`}
            />
            
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  crudeInput: 'النفط الخام المدخل',
                  production: 'الإنتاج',
                };
                return labels[value] || value;
              }}
            />
            
            <Bar 
              dataKey="crudeInput" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="production" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}