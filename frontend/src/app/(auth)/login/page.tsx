// app/(auth)/login/page.tsx

import LoginForm from 'src/components/auth/LoginForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'نظام ارشفة لجان الشركة',
  description: ' الدخول إلى نظام ارشفة اللجان',
};

export default function LoginPage() {
  return <LoginForm />;
}