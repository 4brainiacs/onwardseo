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

  // Organize categories into columns
  const leftColumnCategories = ['Global Services', 'Search Engine Services'];
  const middleColumnCategories = ['Blog Directory Services', 'Asian Services'];
  const rightColumnCategories = ['RSS Services', 'European Services', 'Blog Platform Services'];

  const renderCategoryButton = (category: string) => (
    <button
      key={category}
      onClick={() => handleToggleCategory(category as CategoryType)}
      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 p-1.5 rounded hover:bg-gray-50 w-full"
    >
      {selectedCategories.has(category as CategoryType) ? (
        <CheckSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
      ) : (
        <Square className="h-4 w-4 flex-shrink-0" />
      )}
      <span className="truncate">{category}</span>
    </button>
  );

  return (
    <div className="w-full max-w-4xl mb-2">
      <div className="bg-white rounded-lg border border-gray-200 p-2">
        <div className="mb-1 flex items-center">
          <button
            onClick={handleToggleAll}
            className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 p-1.5 rounded hover:bg-gray-50"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : someSelected ? (
              <CheckSquare2 className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span className="font-medium">All Categories</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 max-h-[180px] overflow-y-auto px-0.5">
          <div className="flex flex-col gap-0.5">
            {leftColumnCategories.map(renderCategoryButton)}
          </div>
          <div className="flex flex-col gap-0.5">
            {middleColumnCategories.map(renderCategoryButton)}
          </div>
          <div className="flex flex-col gap-0.5">
            {rightColumnCategories.map(renderCategoryButton)}
          </div>
        </div>
      </div>
    </div>
  );
}