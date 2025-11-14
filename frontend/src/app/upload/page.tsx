import { Metadata } from 'next';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MediaUploadForm from '@/src/components/MediaUploadForm';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Upload Media | Company Achievements',
  description: 'Upload images and videos to showcase company achievements',
};

export default function UploadPage() {
  return (
    <div dir='rtl' className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                رجوع
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">صفحة ادخال بيانات الاعلام</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
   

        {/* Upload Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10">
          <MediaUploadForm />
        </div>

        {/* Help Section */}
        {/* <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              View Upload Tutorial
            </a>
          </p>
        </div> */}
      </main>
    </div>
  );
}