/**
 * Manages in-memory cache for API responses
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 60000; // 1 minute cache

export const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};