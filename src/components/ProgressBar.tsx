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
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div 
            key={url}
            className={`text-sm ${url === progress.currentUrl ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 text-right">{index + 1}.</span>
              <span className="truncate">{url}</span>
            </div>
            {url === progress.currentUrl && (
              <div className="ml-7 text-xs">
                Currently pinging: {progress.currentService}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}