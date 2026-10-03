import { logger } from "../logger";

type CacheValue = any;

/**
 * CacheService
 * High-performance abstraction for data caching.
 * Designed to be easily swapped with Redis (Upstash) for production.
 */
class CacheService {
  private cache: Map<string, { value: CacheValue; expiry: number }> = new Map();

  /**
   * Get item from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Set item in cache
   * @param key Cache key
   * @param value Data to store
   * @param ttl Time to live in seconds (default 5 mins)
   */
  async set(key: string, value: CacheValue, ttl: number = 300): Promise<void> {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
    
    // In a real production scenario with Redis:
    // await redis.set(key, JSON.stringify(value), 'EX', ttl);
    
    logger.debug({ key, ttl }, "Cache set");
  }

  /**
   * Invalidate cache for a specific key or pattern
   */
  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
    logger.debug({ key }, "Cache invalidated");
  }

  /**
   * Clear all cache (use with caution)
   */
  async flush(): Promise<void> {
    this.cache.clear();
    logger.info("Cache flushed");
  }
}

export const cacheService = new CacheService();
