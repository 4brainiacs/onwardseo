import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export function EmbedCode() {
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(1600);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setIframeHeight(1800); // Increased height for mobile
      } else if (window.innerWidth <= 768) {
        setIframeHeight(1700); // Increased height for tablet
      } else {
        setIframeHeight(1600); // Increased height for desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const embedCode = `<iframe 
  class="url-pinger-iframe"
  src="https://stalwart-biscochitos-6548b2.netlify.app" 
  title="URL Pinger Tool"
  style="width: 100%; height: ${iframeHeight}px; border: none; max-width: 100vw; overflow: hidden; background-color: #FFFFFF;"
  scrolling="no"
  frameborder="0"
  loading="lazy"
  allow="clipboard-write"
  importance="high"
></iframe>
<style>
  /* URL Pinger Tool - Responsive iframe adjustments */
  .url-pinger-iframe {
    width: 100%;
    max-width: 100vw;
    border: none;
    overflow: hidden;
    min-height: 1600px !important;
    transition: height 0.3s ease;
    background-color: #FFFFFF;
  }
  @media screen and (max-width: 480px) {
    .url-pinger-iframe {
      height: 1800px !important;
      min-height: 1800px !important;
    }
  }
  @media screen and (min-width: 481px) and (max-width: 768px) {
    .url-pinger-iframe {
      height: 1700px !important;
      min-height: 1700px !important;
    }
  }
  @media screen and (min-width: 769px) {
    .url-pinger-iframe {
      height: 1600px !important;
      min-height: 1600px !important;
    }
  }
</style>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Embed this tool</h4>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">
        {embedCode}
      </pre>
    </div>
  );
}