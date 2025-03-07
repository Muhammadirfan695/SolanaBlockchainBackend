export class MockCache {
  private static instance: MockCache;
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  private constructor() {}

  static getInstance(): MockCache {
    if (!MockCache.instance) {
      MockCache.instance = new MockCache();
    }
    return MockCache.instance;
  }

  async set(key: string, value: any, ttlMs: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}