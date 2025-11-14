// app/page.tsx
'use client';


import { ContinuousCarousel } from "../components/AnimatedCarousel";
import { NewsScroller } from "../components/NewsScrolling";
import FooterComponent from "../components/FooterComponent";
import { useNewsTitles } from "../lib/hooks/useNewsTitles";
import SidebarComponent from "../components/Sidebar";



export default function Home() {

  // Fetch news titles from API
  const { data: newsItems = [], isLoading, error } = useNewsTitles();


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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                مرحباً بك في نظام انجازية الشركة
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نظام شامل وآمن لإدارة وأرشفة سجلات اللجان بشكل إلكتروني منظم
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">أرشفة إلكترونية</h3>
                <p className="text-gray-600">
                  نظام متقدم لأرشفة جميع وثائق ومستندات اللجان بشكل منظم وآمن
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">بحث سريع</h3>
                <p className="text-gray-600">
                  إمكانية البحث السريع والوصول الفوري لجميع السجلات والوثائق
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
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



















// 'use client';

// import { ContinuousCarousel } from "../components/AnimatedCarousel";
// import FooterComponent from "../components/FooterComponent";
// import { NewsScroller } from "../components/NewsScrolling";
// import Sidebar from "../components/Sidebar";



// // News items
// export const  newsItems = [
//   {
//     id: 1,
//     text: "🚀 قامت كوادر شركة مصافي الوسط مصفى الدورة بتشغيل وحدة الازمرة الانتاجية لانتاج 100 الف برميل يوميا وسوف تساعد هذه الخطوة على رفع الانتاج والاموال للدولة",
//     icon: 'zap' as const,
//     urgency: 'high' as const,
//   },
//   {
//     id: 2,
//     text: "📈 تشكيل لجنة مع وزارة النفط لوضع اليات التعيين للعقود بالقوانين ",
//     icon: 'trending' as const,
//     urgency: 'medium' as const,
//   },
//   {
//     id: 3,
//     text: "🌟 السيد معاون المدير العام يشرف على لجنة تبسيط الاجراءات الحكومية في شركة مصافي الوسط",
//     icon: 'bell' as const,
//     urgency: 'low' as const,
//   },
//   {
//     id: 4,
//     text: "🎉 المدير العام يفتتح وحدة لمعالجة الاسفلت في مصفى الدورة",
//     icon: 'trending' as const,
//     urgency: 'medium' as const,
//   },
//   {
//     id: 5,
//     text: "⚡ معاون المدير العام يزور مصفى النجف",
//     icon: 'zap' as const,
//     urgency: 'low' as const,
//   },
//   {
//     id: 6,
//     text: "🔒 قسم تقنية المعلومات يقوم بعمل ورشة للمنتسبين للتعريف عن تبسيط الاجراءات داخل الشركة",
//     icon: 'bell' as const,
//     urgency: 'high' as const,
//   },

//   {
//     id: 7,
//     text: "🔒  قسم الصيانة قام بعمل صيانة الى وحدة التشيكية   ",
//     icon: 'bell' as const,
//     urgency: 'high' as const,
//   },

//     {
//     id: 8,
//     text: " 🚗 قسم الصيانة قام بعمل صيانة الى وحدة التشيكية   ",
//     icon: 'bell' as const,
//     urgency: 'high' as const,
//   },
// ];

// // Carousel items
// export const carouselItems = [
//   {
//     id: 1,
//     title: "شركة مصافي الوسط",
//     description: "مصفى الدورة يقوم بصيانة وحدة الازمرة الانتاجية ",
//     imageUrl: "https://media.shafaq.com/media/arcella/1728832760276.png",
//     category: "هيأة الصيانة",
//   },
//   {
//     id: 2,
//     title: "زيادة انتاج مصفى الدورة",
//     description: " قسم التكرير بالمصفى ينتج 140 ألف برميل يومياً",
//     imageUrl: "https://i.ytimg.com/vi/D7Hl9zLd1jo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAiJ7a161tmy7b6-Un7xqczdjVtNg",
//     category: "قسم التكرير",
//   },
//   {
//     id: 3,
//     title: "افتتاح وحدة الهدرجة الثالثة",
//     description: "افتتاح وحدة هدرجة جديدة لمصفى الدورة",
//     imageUrl: "https://mrc.oil.gov.iq/upload/2919580926.jpg",
//     category: "الاعلام",
//   },
//   {
//     id: 4,
//     title: "صيانة الوحدات التشغيلية",
//     description: "كوادر هيأة الصيانة والاقسام الساندة في شركة مصافي الوسط",
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOJhwstHlVGjvlJNsHFdiabNG8Mv40ZyM9AQ&s",
//     category: "هيأة الصيانة",
//   },

//    {
//     id: 5,
//     title: "جولة ميدانية داخل الشركة",
//     description: "جولة ميدانية في ليل شهر رمضان المبارك للسيد المدير العام ",
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-7WTk2eZxox_lIbpaMt1-h329TqLnjQ1CxQ&s",
//     category: "الاعلام",
//   },
// ];

// export default function Home() {
//   return (
//    <div className="flex flex-col min-h-screen">
//       {/* 🔹 Top Section - News Scroller */}
//       <NewsScroller news={newsItems} />

//       {/* 🔹 Main Layout: Content + Sidebar */}
//       <div className="flex flex-1 min-h-0">
//         {/* Left side: Main Content + Carousel */}
//         <div className="flex flex-col flex-1">
//           {/* Main Content Area */}
//           <main className="flex-1 p-8 bg-white overflow-y-auto">
//             {/* Hero Section */}
//             {/* <div className="text-center mb-12">
//               <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                 مرحباً بك في نظام انجازية الشركة
//               </h1>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                 نظام شامل وآمن لإدارة وأرشفة سجلات اللجان بشكل إلكتروني منظم
//               </p>
//             </div> */}

//             {/* Feature Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//               {/* Card 1 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">أرشفة إلكترونية</h3>
//                 <p className="text-gray-600">
//                   نظام متقدم لأرشفة جميع وثائق ومستندات اللجان بشكل منظم وآمن
//                 </p>
//               </div> */}

//               {/* Card 2 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">بحث سريع</h3>
//                 <p className="text-gray-600">
//                   إمكانية البحث السريع والوصول الفوري لجميع السجلات والوثائق
//                 </p>
//               </div> */}

//               {/* Card 3 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">أمان عالي</h3>
//                 <p className="text-gray-600">
//                   حماية متقدمة للبيانات مع صلاحيات وصول محددة لكل مستخدم
//                 </p>
//               </div> */}

//               {/* Card 4 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">تقارير شاملة</h3>
//                 <p className="text-gray-600">
//                   إمكانية إنشاء تقارير مفصلة وإحصائيات دقيقة عن جميع الأنشطة
//                 </p>
//               </div> */}

//               {/* Card 5 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">توفير الوقت</h3>
//                 <p className="text-gray-600">
//                   تقليل الوقت المستغرق في البحث والإدارة بشكل كبير
//                 </p>
//               </div> */}

//               {/* Card 6 */}
//               {/* <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
//                 <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">تعاون فعال</h3>
//                 <p className="text-gray-600">
//                   إمكانية العمل الجماعي والتعاون بين الأقسام المختلفة
//                 </p>
//               </div> */}
//             </div>

//             {/* Contact Section */}
//             {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
//               <div className="text-center">
//                 <h3 className="text-3xl font-bold mb-4">هل تحتاج إلى مساعدة؟</h3>
//                 <p className="text-lg mb-6 max-w-2xl mx-auto">
//                   قسم تقنية المعلومات - شعبة الشبكات والانظمة البرمجية
//                 </p>
//                 <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-md">
//                   تواصل معنا
//                 </button>
//               </div>
//             </div> */}
//           </main>

//           {/* ✅ Carousel - Sticks above footer, aligned with sidebar */}
//           <section className="w-full border-t border-gray-200">
//             <ContinuousCarousel
//               items={carouselItems}
//               scrollSpeed={3000}
//               itemsToShow={4}
//               autoScroll={true}
//             />
//           </section>
//         </div>

//         {/* 🔹 Right Sidebar - Fixed width */}
//         <aside className="w-[200px] bg-gray-100 border-l border-gray-300 p-4 flex flex-col">
//           <Sidebar />
//         </aside>
//       </div>

//       {/* 🔹 Footer */}
//       <FooterComponent />
//     </div>
//   );
// }