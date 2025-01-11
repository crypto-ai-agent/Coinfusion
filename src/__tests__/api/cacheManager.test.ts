import { describe, it, expect, beforeEach } from 'vitest';
import { getCachedData, setCachedData } from '../../utils/api/cacheManager';

describe('Cache Manager', () => {
  beforeEach(() => {
    // Clear any cached data before each test
    const cache = new Map();
  });

  it('should store and retrieve cached data', () => {
    const testData = { test: 'data' };
    const cacheKey = 'test_key';

    setCachedData(cacheKey, testData);
    const cachedData = getCachedData(cacheKey);

    expect(cachedData).toEqual(testData);
  });

  it('should return null for non-existent cache key', () => {
    const cachedData = getCachedData('non_existent_key');
    expect(cachedData).toBeNull();
  });

  it('should handle cache expiration', async () => {
    const testData = { test: 'data' };
    const cacheKey = 'test_key';

    setCachedData(cacheKey, testData);
    
    // Wait for cache to expire (cache duration is 1 minute in implementation)
    await new Promise(resolve => setTimeout(resolve, 61000));
    
    const cachedData = getCachedData(cacheKey);
    expect(cachedData).toBeNull();
  });
});