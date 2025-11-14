"use client"

import Link from "next/link";

interface UserData {
  userID: string;
  username: string;
  permission: string;
  role:string;
}

interface NavbarProps {
  userData?: UserData | null;
}



export default  function SidebarComponent({ userData }: NavbarProps) {
  return (
    <aside className="w-[200px] bg-gray-100 border-l border-gray-300 p-4 flex flex-col items-center">
         <h3 className="font-bold mb-2 text-gray-700 text-center text-lg">
    هيأت واقسام الشركة{userData?.role}
  </h3>
  
  {/* Full width horizontal line */}
  <hr className="border-gray-400 mb-4" />
  
  <ul className="space-y-2 text-gray-600 flex-1 text-center text-lg font-extrabold">
    
    <li className="cursor-pointer">هيأة الانتاج</li>
    <hr className="border-gray-400 mb-4" />
    <li className="cursor-pointer">قسم العقود والمشتريات</li>
    <hr className="border-gray-400 mb-4" />
    <Link href={'/maintenence'}><li className="cursor-pointer">هيأة الصيانة</li></Link>

      <hr className="border-gray-400 mb-4" />
   <Link href={'/upload'}>
    <li className="cursor-pointer">شعبة الاعلام</li></Link>
    <hr className="border-gray-400 mb-4" />


     <li className="cursor-pointer">شعبة الفاكس</li>
    <hr className="border-gray-400 mb-4" />

    

    <Link href={'/contracts'}> <li className="cursor-pointer">قسم العقود والمشتريات المحلية</li></Link>


  </ul>
</aside>
  )
}
