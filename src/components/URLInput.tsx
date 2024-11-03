import React, { useState } from 'react';
import { Send, AlertCircle, RotateCcw } from 'lucide-react';
import { validateUrl } from '../utils/urlUtils';

interface URLInputProps {
  onSubmit: (urls: string[]) => void;
  onReset: () => void;
  isLoading: boolean;
  isCompleted: boolean;
}

export function URLInput({ onSubmit, onReset, isLoading, isCompleted }: URLInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateUrls = (text: string) => {
    const urls = text
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length > 5) {
      setError('Maximum 5 URLs allowed');
      return null;
    }

    const invalidUrls = urls.filter(url => !validateUrl(url));
    
    if (invalidUrls.length > 0) {
      setError(`Invalid URL${invalidUrls.length > 1 ? 's' : ''}: ${invalidUrls.join(', ')}`);
      return null;
    }

    setError('');
    return urls;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedUrls = validateUrls(input);
    
    if (validatedUrls) {
      onSubmit(validatedUrls);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (error) {
      validateUrls(e.target.value);
    }
  };

  const handleReset = () => {
    setInput('');
    setError('');
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInput}
            placeholder="Enter up to 5 URLs (one per line)"
            className={`w-full min-h-[200px] rounded-lg border ${
              error ? 'border-red-300' : 'border-gray-300'
            } p-6 text-sm focus:border-blue-500 focus:ring-blue-500`}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {isCompleted ? (
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !!error}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Start Pinging</span>
                </>
              )}
            </button>
          )}
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}