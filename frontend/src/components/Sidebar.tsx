"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface UserData {
  userID: string;
  username: string;
  permission: string;
  role: string;
}

interface NavbarProps {
  userData?: UserData | null;
}

export default function SidebarComponent({ userData }: NavbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🚪 Logging out...');

      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important: Include cookies
      });

      if (response.ok) {
        console.log('✅ Logout successful');
        
        // Redirect to login page
        router.push('/login');
        router.refresh(); // Force refresh to clear any cached data
      } else {
        console.error('❌ Logout failed:', await response.text());
        alert('فشل تسجيل الخروج. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      alert('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-[200px] bg-gray-100 border-l border-gray-300 p-4 flex flex-col items-center">
      <h3 className="font-bold mb-2 text-gray-700 text-center text-lg">
        هيأت واقسام الشركة {userData?.role}
      </h3>
      
      {/* Full width horizontal line */}
      <hr className="border-gray-400 mb-4" />
      
      <ul className="space-y-2 text-gray-600 flex-1 text-center text-lg font-extrabold">
        <li className="cursor-pointer">هيأة الانتاج</li>
        <hr className="border-gray-400 mb-4" />
        
        <li className="cursor-pointer">قسم العقود والمشتريات</li>
        <hr className="border-gray-400 mb-4" />
        
        <Link href={'/maintenence'}>
          <li className="cursor-pointer">هيأة الصيانة</li>
        </Link>
        <hr className="border-gray-400 mb-4" />
        
        <Link href={'/upload'}>
          <li className="cursor-pointer">شعبة الاعلام</li>
        </Link>
        <hr className="border-gray-400 mb-4" />

        <li className="cursor-pointer">شعبة الفاكس</li>
        <hr className="border-gray-400 mb-4" />

        <Link href={'/contracts'}>
          <li className="cursor-pointer">قسم العقود والمشتريات المحلية</li>
        </Link>
      </ul>

      {/* Logout Button */}
      <div className="w-full mt-4 pt-4 border-t border-gray-400 ">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            w-full px-4 py-2 rounded-lg font-bold text-white
            flex items-center justify-center gap-2
            transition-all duration-200 cursor-pointer
            ${isLoggingOut 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }
          `}
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
        </button>
      </div>
    </aside>
  );
}