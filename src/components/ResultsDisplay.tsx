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
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Ping Results</h2>
      
      <div className="space-y-4 max-h-[450px] overflow-y-auto overscroll-contain pb-4">
        {Object.entries(results).map(([url, pingResults]) => {
          const completedPings = pingResults.filter(r => r.status !== 'pending').length;
          const successPings = pingResults.filter(r => r.status === 'success').length;
          const progress = (completedPings / pingResults.length) * 100;
          const hasStarted = completedPings > 0;
          
          if (!hasStarted) return null;
          
          return (
            <div key={url} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-base font-medium text-gray-700 break-all mb-3">
                {url}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                  <span>{completedPings} of {pingResults.length} ({successPings} successful)</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
                {PING_SERVICES.map((service, index) => {
                  const result = pingResults[index];
                  return (
                    <div
                      key={service.name}
                      className={`flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 ${
                        result.status === 'pending' ? '' : 'animate-fade-in'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {result.status === 'pending' ? (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                        ) : result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-base text-gray-600 truncate">
                          {service.name}
                        </span>
                      </div>
                      <span className={`ml-2 text-base whitespace-nowrap ${
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