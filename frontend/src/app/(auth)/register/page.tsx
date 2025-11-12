
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'إنشاء حساب جديد - نظام ارشفة لجان الشركة',
  description: ' انشاء حساب جديد في نظام ارشفة لجان الشركة',
};

export default function RegisterPage() {
  return <RegisterForm />;
}