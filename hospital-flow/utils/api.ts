import { useEffect, useState } from 'react';

// Debounce function to prevent multiple calls in quick succession
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Request queue to track in-flight requests
const requestQueue = new Map<string, Promise<any>>();

// Generic API fetcher with request deduplication
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const requestKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || '')}`;
  
  // If there's already an in-flight request for this exact API call, return that promise
  if (requestQueue.has(requestKey)) {
    return requestQueue.get(requestKey)!;
  }
  
  const promise = fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      return response.json();
    })
    .finally(() => {
      // Remove from queue when done
      requestQueue.delete(requestKey);
    });
  
  // Add to queue
  requestQueue.set(requestKey, promise);
  
  return promise;
}

// Hook for making API calls with automatic debouncing
export function useDebounceApi<T>(
  url: string,
  options: RequestInit = {},
  debounceMs: number = 300
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedFetch = debounce(async () => {
    setIsLoading(true);
    try {
      const result = await fetchApi<T>(url, options);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, debounceMs);
  
  useEffect(() => {
    debouncedFetch();
  }, [url, JSON.stringify(options)]);
  
  return { data, error, isLoading };
} 