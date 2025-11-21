"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContinuousCarousel } from "../components/AnimatedCarousel";
import FooterComponent from "../components/FooterComponent";

import { useNewsTitles } from "../lib/hooks/useNewsTitles";
import { NewsScroller } from "../components/NewsScrolling";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SidebarComponent from "../components/Sidebar";
// import { WavyText } from "../components/WavyText";

gsap.registerPlugin(ScrollTrigger);

// Chart data for month days (1-30)
const monthlyData = [
  { day: 1, incoming: 45, outgoing: 32 },
  { day: 2, incoming: 52, outgoing: 38 },
  { day: 3, incoming: 48, outgoing: 41 },
  { day: 4, incoming: 61, outgoing: 35 },
  { day: 5, incoming: 55, outgoing: 44 },
  { day: 6, incoming: 38, outgoing: 28 },
  { day: 7, incoming: 42, outgoing: 31 },
  { day: 8, incoming: 50, outgoing: 36 },
  { day: 9, incoming: 47, outgoing: 39 },
  { day: 10, incoming: 58, outgoing: 42 },
  { day: 11, incoming: 63, outgoing: 48 },
  { day: 12, incoming: 41, outgoing: 33 },
  { day: 13, incoming: 49, outgoing: 37 },
  { day: 14, incoming: 56, outgoing: 45 },
  { day: 15, incoming: 44, outgoing: 30 },
  { day: 16, incoming: 51, outgoing: 40 },
  { day: 17, incoming: 59, outgoing: 43 },
  { day: 18, incoming: 46, outgoing: 34 },
  { day: 19, incoming: 53, outgoing: 38 },
  { day: 20, incoming: 62, outgoing: 47 },
  { day: 21, incoming: 40, outgoing: 29 },
  { day: 22, incoming: 48, outgoing: 35 },
  { day: 23, incoming: 57, outgoing: 41 },
  { day: 24, incoming: 43, outgoing: 32 },
  { day: 25, incoming: 54, outgoing: 39 },
  { day: 26, incoming: 60, outgoing: 46 },
  { day: 27, incoming: 39, outgoing: 27 },
  { day: 28, incoming: 47, outgoing: 36 },
  { day: 29, incoming: 55, outgoing: 42 },
  { day: 30, incoming: 50, outgoing: 38 },
];

// Pie chart data - Maintenance status totals
const maintenanceStatusData = [
  { name: 'مكتملة', value: 847, color: '#22c55e' },
  { name: 'قيد التنفيذ', value: 156, color: '#eab308' },
  { name: 'معلقة', value: 89, color: '#ef4444' },
];

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





// WavyText component with animated words (works with Arabic)
const WavyText = ({ text, rtl = false }: { text: string; rtl?: boolean }) => {
  const words = text.split(" ");
  
  return (
    <p 
      className="text-5xl font-extrabold flex items-center justify-center gap-4"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="wavy-char inline-block bg-linear-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent"
        >
          {word}
        </span>
      ))}
    </p>
  );
};



// Calculate totals
const totalIncoming = monthlyData.reduce((sum, item) => sum + item.incoming, 0);
const totalOutgoing = monthlyData.reduce((sum, item) => sum + item.outgoing, 0);

export default function Home() {
  const { data: newsItems } = useNewsTitles();

  const mainRef = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLImageElement>(null);

  const imageRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const barrel = barrelRef.current;
    const scroller = mainRef.current;

    if (!barrel || !scroller) return;

    // Kill any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Timeline 1: Move barrel from Section 1 to Section 2
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-2",
        scroller: scroller,
        start: "0% 95%",
        end: "80% 60%",
        scrub: true,
        // markers: true, // Uncomment for debugging
      }
    });

    tl1.to(barrel, {
      top: "145%",
      left: "20%",
      rotate: "0deg",
      scale: 0.9,
    });

    // Timeline 2: Move barrel from Section 2 to Section 3
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-3",
        scroller: scroller,
        start: "0% 95%",
        end: "20% 50%",
        scrub: true,
        // markers: true,
      }
    });



    tl2.to(barrel, {
      top: "245%",
      left: "10%",
      rotate: "0deg",
      scale: 1,
    });




    // Refresh on resize
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);


// Wavy animation for image text characters
    const chars = document.querySelectorAll(".wavy-char");
    if (chars.length > 0) {
      gsap.fromTo(
        chars,
        {
          y: 0,
        },
        {
          y: -20,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            each: 0.1,
            from: "center",
          },
        }
      );
    }




    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      {/* Top News Scroller */}
      <div className="shrink-0 z-20">
        <NewsScroller news={newsItems} />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Left: Scrollable Content */}
        <div className="flex flex-col flex-1 min-w-0 relative">
          <main
            ref={mainRef}
            className="flex-1 bg-white overflow-y-auto scroll-smooth relative"
          >
           
            {/* Section 1 - Hero with barrel in center-right */}
            <section className="section-1 h-screen bg-linear-to-br from-purple-600 to-purple-400 border-b border-purple-500 relative overflow-visible">
              
              {/* WavyText - Middle Top */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
                <WavyText text="شركة مصافي الوسط" rtl={true} />
              </div>
              
              {/* Barrel - Absolutely positioned */}
              <img
                ref={barrelRef}
                id="cans"
                src="/img/refinery.png"
                className="absolute w-[20%] z-2 transition-all duration-500"
                alt="barrel"
                style={{ 
                  top: "50%", 
                  left: "65%", 
                  transform: "translate(-50%, -50%)",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const placeholder = document.createElement("div");
                  placeholder.className = "absolute w-[20%] h-40 bg-orange-500 flex items-center justify-center text-white font-bold rounded transform -translate-x-1/2 -translate-y-1/2";
                  placeholder.style.top = "50%";
                  placeholder.style.left = "65%";
                  placeholder.innerText = "BARREL";
                  e.currentTarget.parentNode?.replaceChild(placeholder, e.currentTarget);
                }}
              />
            </section>



            {/* Section 2 - About section with barrel settling on left, chart on right */}
            <section className="section-2 min-h-screen bg-white py-20 relative overflow-visible flex items-center">
              <div className="container mx-auto px-10 flex justify-between items-center gap-10">
                {/* Left side - Empty space for barrel */}
                <div className="w-1/2"></div>
                
                {/* Right side - Chart */}
                <div className="w-1/2 pl-10">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                      إحصائيات الكتب
                    </h2>
                    <p className="text-lg text-purple-600 mb-8 text-center font-semibold">
                      خلال هذا الشهر
                    </p>
                    
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData}
                          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="day" 
                            tick={{ fill: '#374151', fontSize: 11 }}
                            axisLine={{ stroke: '#9ca3af' }}
                            interval={0}
                            tickMargin={8}
                          />
                          <YAxis 
                            tick={{ fill: '#374151', fontSize: 12 }}
                            axisLine={{ stroke: '#9ca3af' }}
                            label={{ value: 'عدد الكتب', angle: -90, position: 'insideLeft', style: { fill: '#374151', fontWeight: 600, fontSize: 12 } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '2px solid #8b5cf6',
                              borderRadius: '12px',
                              padding: '12px',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}
                            labelFormatter={(value) => `يوم ${value}`}
                            formatter={(value: number, name: string) => {
                              const label = name === 'incoming' ? 'الكتب الواردة' : 'الكتب الصادرة';
                              return [value, label];
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => {
                              return value === 'incoming' ? 'الكتب الواردة' : 'الكتب الصادرة';
                            }}
                            iconType="rect"
                          />
                          <Bar 
                            dataKey="incoming" 
                            fill="#8b5cf6" 
                            radius={[4, 4, 0, 0]}
                            name="incoming"
                          />
                          <Bar 
                            dataKey="outgoing" 
                            fill="#ec4899" 
                            radius={[4, 4, 0, 0]}
                            name="outgoing"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8 flex justify-around text-center">
                      <div className="bg-purple-50 rounded-xl p-4 flex-1 mx-2">
                        <p className="text-sm text-purple-600 font-semibold mb-1">إجمالي الواردة</p>
                        <p className="text-3xl font-bold text-purple-700">{totalIncoming}</p>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4 flex-1 mx-2">
                        <p className="text-sm text-pink-600 font-semibold mb-1">إجمالي الصادرة</p>
                        <p className="text-3xl font-bold text-pink-700">{totalOutgoing}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Yearly maintenance statistics with pie chart */}
            <section className="section-3 min-h-screen bg-purple-300 flex items-center justify-center relative overflow-visible py-20">
              <div className="container mx-auto px-10">
                <h3 className="text-5xl font-black text-purple-700 tracking-wide text-center mb-12">
                  إحصائيات الصيانة السنوية
                </h3>
                
                <div className="flex justify-end gap-6">
                  {/* Pie Chart */}
                  <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-[280px]">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      حالة أعمال الصيانة
                    </h4>
                    <div className="w-full h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={maintenanceStatusData}
                            cx="70%"
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
                    
                    {/* Summary Cards */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-green-600 font-semibold mb-1">مكتملة</p>
                        <p className="text-lg font-bold text-green-700">847</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-yellow-600 font-semibold mb-1">قيد التنفيذ</p>
                        <p className="text-lg font-bold text-yellow-700">156</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-red-600 font-semibold mb-1">معلقة</p>
                        <p className="text-lg font-bold text-red-700">89</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Bar Chart */}
                  <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-[320px]">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      أعمال الصيانة الشهرية
                    </h4>
                    <div className="w-full h-[200px]">
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
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number, name: string) => {
                              const labels: Record<string, string> = {
                                done: 'مكتملة',
                                pending: 'معلقة',
                                inProgress: 'قيد التنفيذ'
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
                                inProgress: 'قيد التنفيذ'
                              };
                              return labels[value] || value;
                            }}
                            iconType="rect"
                            iconSize={8}
                          />
                          <Bar dataKey="done" stackId="a" fill="#22c55e" name="done" />
                          <Bar dataKey="inProgress" stackId="a" fill="#eab308" name="inProgress" />
                          <Bar dataKey="pending" stackId="a" fill="#ef4444" name="pending" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Carousel */}
            <section className="w-full border-t border-gray-200 py-4 bg-gray-50">
              <ContinuousCarousel />
            </section>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="w-[200px] shrink-0 bg-gray-100 border-l border-gray-300 flex flex-col overflow-hidden">
          <SidebarComponent />
        </aside>
      </div>

      {/* Footer */}
      <div className="shrink-0 z-20">
        <FooterComponent />
      </div>
    </div>
  );
}