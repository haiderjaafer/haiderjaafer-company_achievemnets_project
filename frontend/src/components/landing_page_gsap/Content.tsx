'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './styles/Content.module.css';
import { TimelineProps } from './types';

// Monthly maintenance data for the year
const monthlyMaintenanceData = [
  { month: 'يناير', done: 65, pending: 8, inProgress: 12 },
  { month: 'فبراير', done: 72, pending: 6, inProgress: 14 },
  { month: 'مارس', done: 78, pending: 9, inProgress: 11 },
  { month: 'أبريل', done: 68, pending: 7, inProgress: 15 },
  { month: 'مايو', done: 74, pending: 5, inProgress: 13 },
  { month: 'يونيو', done: 82, pending: 10, inProgress: 8 },
  { month: 'يوليو', done: 69, pending: 8, inProgress: 16 },
  { month: 'أغسطس', done: 71, pending: 6, inProgress: 12 },
  { month: 'سبتمبر', done: 76, pending: 9, inProgress: 14 },
  { month: 'أكتوبر', done: 80, pending: 7, inProgress: 10 },
  { month: 'نوفمبر', done: 67, pending: 8, inProgress: 17 },
  { month: 'ديسمبر', done: 45, pending: 6, inProgress: 14 },
];

const Content: React.FC<TimelineProps> = ({ timeline }) => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // === H1 ANIMATION (Cool slide from top with blur) ===
    gsap.set(h1Ref.current, {
      opacity: 0,
      y: -100,              // Start above
      scale: 0.8,           // Start smaller
      rotationX: -90,       // 3D rotation
      filter: 'blur(10px)', // Blurred initially
    });

    timeline.to(h1Ref.current, {
      duration: 1.2,
      opacity: 1,
      y: 0,                 // Slide down to position
      scale: 1,             // Grow to normal size
      rotationX: 0,         // Rotate to flat
      filter: 'blur(0px)',  // Clear the blur
      ease: 'back.out(1.7)', // Overshoot effect
      transformOrigin: 'center center',
    });

    // === P ANIMATION (Slide from bottom with glow) ===
    gsap.set(pRef.current, {
      opacity: 0,
      y: 80,                // Start below
      scale: 0.9,
      filter: 'blur(5px)',
    });

    timeline.to(pRef.current, {
      duration: 1,
      opacity: 1,
      y: 0,                 // Slide up to position
      scale: 1,
      filter: 'blur(0px)',
      ease: 'power3.out',
    }, '-=0.8'); // Start 0.8s before h1 finishes (overlap)

    // === CARD ANIMATION (Slide from left with 3D rotation) ===
    gsap.set(cardRef.current, {
      opacity: 0,
      x: -600,              // Start from left
      rotationY: -90,       // 3D rotation
      scale: 0.5,
    });

    timeline.to(cardRef.current, {
      duration: 1.5,
      opacity: 1,
      x: 0,                 // Slide to center
      rotationY: 0,         // Rotate to flat
      scale: 1,
      ease: 'back.out(1.4)',
      transformOrigin: 'center center',
    }, '-=0.5'); // Start 0.5s before p finishes

    // Optional: Bounce after card lands
    timeline.to(cardRef.current, {
      duration: 0.3,
      y: -10,
      ease: 'power2.out',
    });

    timeline.to(cardRef.current, {
      duration: 0.3,
      y: 0,
      ease: 'bounce.out',
    });

  }, [timeline]);

  return (
    <div className={styles.content}>
      {/* H1 with cool animation */}
      {/* <h1 
        ref={h1Ref}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        العمود الفقري لصناعة
      </h1> */}

      {/* P with cool animation */}
      {/* <p 
        ref={pRef}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        التكرير في وسط العراق
      </p> */}

      {/* Chart card */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-[520px]"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
          أعمال الصيانة الشهرية
        </h4>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyMaintenanceData}
              margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="month"
                tick={{ fill: '#374151', fontSize: 8, fontWeight: 'bold' }}
                axisLine={{ stroke: '#9ca3af' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />

              <YAxis
                tick={{ fill: '#374151', fontSize: 9 }}
                axisLine={{ stroke: '#9ca3af' }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #8b5cf6',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    done: 'مكتملة',
                    pending: 'معلقة',
                    inProgress: 'قيد التنفيذ',
                  };
                  return [value, labels[name] || name];
                }}
              />

              <Legend
                wrapperStyle={{ paddingTop: '5px', fontSize: '10px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    done: 'مكتملة',
                    pending: 'معلقة',
                    inProgress: 'قيد التنفيذ',
                  };
                  return labels[value] || value;
                }}
                iconType="rect"
                iconSize={8}
              />

              <Bar dataKey="done" stackId="a" fill="#22c55e" />
              <Bar dataKey="inProgress" stackId="a" fill="#eab308" />
              <Bar dataKey="pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Content;