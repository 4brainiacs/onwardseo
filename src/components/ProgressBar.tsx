import React from 'react';
import type { ProgressInfo } from '../types';

interface ProgressBarProps {
  progress: ProgressInfo;
  urls: string[];
}

export function ProgressBar({ progress, urls }: ProgressBarProps) {
  const percentage = (progress.completed / progress.total) * 100;

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{progress.completed} of {progress.total} Completed</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto overscroll-contain">
        {urls.map((url, index) => (
          <div 
            key={url}
            className={`p-3 rounded-lg ${
              url === progress.currentUrl 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-white border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 break-all">
                  {url}
                </span>
                {url === progress.currentUrl && (
                  <div className="mt-1.5 text-sm text-blue-600 font-medium">
                    Pinging: {progress.currentService}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}