'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../lib/api/medai';
import { Category } from '../types/media';


interface CategorySelectProps {
  value: number | null;
  onChange: (categoryId: number) => void;
  error?: string;
}

export default function CategorySelect({ value, onChange, error }: CategorySelectProps) {
  // Fetch categories using React Query
  const { data: categories, isLoading, error: fetchError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return (
    <div className="w-full">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
        التصنيف <span className="text-red-500">*</span>
      </label>
      
      <select
        id="category"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={isLoading}
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        <option value="">
          {isLoading ? 'Loading categories...' : 'اختر صنف المنشور'}
        </option>
        
        {categories?.map((category: Category) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {fetchError && (
        <p className="mt-1 text-sm text-red-500">
          Failed to load categories. Please refresh the page.
        </p>
      )}
    </div>
  );
}