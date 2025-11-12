'use client';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FooterComponent from '../components/FooterComponent';
import Sidebar from '../components/Sidebar';



interface UserData {
  userID: string;
  username: string;
  permission: string;
  role:string;
}

interface ClientLayoutProps {   // combine UserData interface and children in single interface
  children?: React.ReactNode;
  userData?: UserData | null;   // userData it could UserData or null  
}

//this action { children, userData }: ClientLayoutProps must destructuring from single props ClientLayoutProps

export default function ClientLayout({ children,userData }: ClientLayoutProps) {  // will receive userData as props and pass it into Navbar
  const pathname = usePathname();
  const isPrintRoute = pathname?.startsWith('/print');
  const isLoginRoute = pathname === '/login';
  const isRegisterRoute = pathname === '/register';
  const bossName =  pathname?.startsWith('/bossNameDetails');

  const hideLayout = isPrintRoute || isLoginRoute || isRegisterRoute || bossName;

  console.log("ClientLayout - Pathname:", pathname);
  

  return (
    <div className="font-serif flex flex-col min-h-screen">
      {/* {!hideLayout && <Sidebar userData={userData}  />}     */}

      <main className="grow">
        {children}
      </main>

      {/* {!hideLayout && <FooterComponent />} */}

      <ToastContainer />
    </div>
  );
}


















// 'use client';

// import { usePathname } from 'next/navigation';
// import  Navbar  from '@/components/Navbar';
// import FooterComponent from '@/components/FooterComponent';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function ClientLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const isPrintRoute = pathname?.startsWith('/print');
//   const isLoginRoute = pathname === '/login'; //  Check for login

//   const isRegisterRoute = pathname === '/register';

//   const hideLayout = isPrintRoute || isLoginRoute || isRegisterRoute;

//   return (
//     <div className="font-serif flex flex-col min-h-screen">
//       {!hideLayout && <Navbar />}

//       <main className="flex-grow">
//         {children}
//       </main>

//       {!hideLayout && <FooterComponent />}
 
   
//     </div>
//   );
// }
