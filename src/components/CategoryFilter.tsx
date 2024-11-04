import React from 'react';
import { CheckSquare, Square, CheckSquare2 } from 'lucide-react';

export const CATEGORIES = {
  'Global Services': true,
  'Search Engine Services': true,
  'RSS Services': true,
  'Blog Directory Services': true,
  'Asian Services': true,
  'European Services': true,
  'Blog Platform Services': true,
} as const;

export type CategoryType = keyof typeof CATEGORIES;

interface CategoryFilterProps {
  selectedCategories: Set<CategoryType>;
  onCategoryChange: (categories: Set<CategoryType>) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const allSelected = selectedCategories.size === Object.keys(CATEGORIES).length;
  const someSelected = selectedCategories.size > 0 && !allSelected;

  const handleToggleAll = () => {
    if (allSelected) {
      onCategoryChange(new Set(['Global Services']));
    } else {
      onCategoryChange(new Set(Object.keys(CATEGORIES) as CategoryType[]));
    }
  };

  const handleToggleCategory = (category: CategoryType) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      if (newCategories.size > 1) {
        newCategories.delete(category);
      }
    } else {
      newCategories.add(category);
    }
    onCategoryChange(newCategories);
  };

  const renderCategoryButton = (category: string) => (
    <button
      key={category}
      onClick={() => handleToggleCategory(category as CategoryType)}
      className="flex items-center gap-2 text-base text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded hover:bg-gray-50 w-full min-h-[44px] touch-manipulation"
    >
      {selectedCategories.has(category as CategoryType) ? (
        <CheckSquare className="h-5 w-5 text-blue-600 flex-shrink-0" />
      ) : (
        <Square className="h-5 w-5 flex-shrink-0" />
      )}
      <span className="truncate">{category}</span>
    </button>
  );

  // Organize categories for better mobile layout
  const columnCategories = [
    ['Global Services', 'Search Engine Services', 'RSS Services'],
    ['Blog Directory Services', 'Asian Services'],
    ['European Services', 'Blog Platform Services']
  ];

  return (
    <div className="w-full max-w-4xl mb-4">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <button
          onClick={handleToggleAll}
          className="flex items-center gap-2 text-base text-gray-700 hover:text-gray-900 px-3 py-2.5 rounded hover:bg-gray-50 w-full min-h-[44px] touch-manipulation mb-2"
        >
          {allSelected ? (
            <CheckSquare className="h-5 w-5 text-blue-600" />
          ) : someSelected ? (
            <CheckSquare2 className="h-5 w-5 text-blue-600" />
          ) : (
            <Square className="h-5 w-5" />
          )}
          <span className="font-medium">All Categories</span>
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {columnCategories.map((column, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {column.map(renderCategoryButton)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}