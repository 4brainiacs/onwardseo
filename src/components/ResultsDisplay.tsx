import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { PING_SERVICES } from '../services/pingServices';
import type { PingResults } from '../types';

interface ResultsDisplayProps {
  results: PingResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const hasResults = Object.keys(results).length > 0;
  
  if (!hasResults) return null;
  
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ping Results</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(results).map(([url, pingResults]) => {
          const completedPings = pingResults.filter(r => r.status !== 'pending').length;
          const successPings = pingResults.filter(r => r.status === 'success').length;
          const progress = (completedPings / pingResults.length) * 100;
          const hasStarted = completedPings > 0;
          
          if (!hasStarted) return null;
          
          return (
            <div key={url} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 break-all mb-2">{url}</h3>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{completedPings} of {pingResults.length} ({successPings} successful)</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
                {PING_SERVICES.map((service, index) => {
                  const result = pingResults[index];
                  return (
                    <div
                      key={service.name}
                      className={`flex items-center justify-between rounded bg-gray-50 px-2.5 py-1.5 text-sm ${
                        result.status === 'pending' ? '' : 'animate-fade-in'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {result.status === 'pending' ? (
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                        ) : result.status === 'success' ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-gray-600 truncate">
                          {service.name}
                        </span>
                      </div>
                      <span className={`ml-2 whitespace-nowrap ${
                        result.status === 'pending' ? 'text-gray-400' :
                        result.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}