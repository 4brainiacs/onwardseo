import React, { useState, useRef } from 'react';
import { Globe } from 'lucide-react';
import { URLInput } from './components/URLInput';
import { CategoryFilter, CategoryType } from './components/CategoryFilter';
import { ProgressBar } from './components/ProgressBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { PingControls } from './components/PingControls';
import { PingController } from './utils/PingController';
import { PING_SERVICES } from './services/pingServices';
import type { PingResults, ProgressInfo } from './types';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryType>>(
    new Set(['Global Services', 'Search Engine Services'])
  );
  const [results, setResults] = useState<PingResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo>({
    total: 0,
    completed: 0,
    currentUrl: '',
    currentService: ''
  });
  const [activeUrls, setActiveUrls] = useState<string[]>([]);
  const pingControllerRef = useRef<PingController | null>(null);

  const handleSubmit = async (urls: string[]) => {
    setIsLoading(true);
    setIsCompleted(false);
    setIsPaused(false);
    setResults({});
    setActiveUrls(urls);

    pingControllerRef.current = new PingController(
      (info) => setProgress(info),
      (results) => setResults(results)
    );

    try {
      await pingControllerRef.current.start(urls);
      setIsCompleted(true);
    } catch (error) {
      console.error('Ping process error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (pingControllerRef.current) {
      pingControllerRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (pingControllerRef.current) {
      pingControllerRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (pingControllerRef.current) {
      pingControllerRef.current.stop();
      setIsLoading(false);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setResults({});
    setIsLoading(false);
    setIsCompleted(false);
    setIsPaused(false);
    setProgress({
      total: 0,
      completed: 0,
      currentUrl: '',
      currentService: ''
    });
    setActiveUrls([]);
    pingControllerRef.current = null;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Ping Website URLs & Backlinks
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg leading-7 text-gray-600">
                Boost your website's visibility and get your pages indexed faster by search engines with <a href="https://onwardseo.com/" className="text-blue-600 hover:text-blue-800 font-bold">onwardSEO - SEO Agency</a>! Use our easy and efficient <strong>Bulk URL Pinger tool</strong> to enhance your online presence. Simply paste up to 5 URLs in the input box below and click the "Start Pinging" button. This will notify multiple search engines and web services about your URLs, helping to improve your site's SEO performance. <strong>It's quick, simple, and free—try it now with onwardSEO and take your website to the next level!</strong>
              </p>
            </div>
          </div>

          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />

          <URLInput
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isLoading}
            isCompleted={isCompleted}
          />

          {isLoading && (
            <div className="w-full max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <PingControls
                  isPaused={isPaused}
                  onPause={handlePause}
                  onResume={handleResume}
                  onStop={handleStop}
                  disabled={!isLoading || isCompleted}
                />
              </div>
              <ProgressBar progress={progress} urls={activeUrls} />
            </div>
          )}

          <ResultsDisplay results={results} />
        </div>
      </div>
    </div>
  );
}