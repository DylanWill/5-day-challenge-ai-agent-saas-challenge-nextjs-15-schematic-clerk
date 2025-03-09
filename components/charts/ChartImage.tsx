'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ChartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * A component for displaying chart images generated with QuickChart
 */
export default function ChartImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = '',
  onLoad,
  onError
}: ChartImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle image loading
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle image loading errors
  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load chart image');
    if (onError) onError();
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <div className="text-red-500 text-center p-4">
            <p>{error}</p>
            <p className="text-sm text-gray-500 mt-2">Please check your chart configuration</p>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-md ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
} 