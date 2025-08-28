interface RateLimiterOptions {
  interval: number;
  maxRequests: number;
  uniqueTokenPerInterval: number;
}

export class RateLimiter {
  private requests: Map<string, { count: number, lastReset: number }>;
  private options: RateLimiterOptions;

  constructor(options: RateLimiterOptions) {
    this.requests = new Map();
    this.options = options;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRecord = this.requests.get(identifier);

    if (userRecord) {
      // Reset count if interval has passed
      if (now - userRecord.lastReset > this.options.interval) {
        this.requests.set(identifier, { count: 1, lastReset: now });
        return true;
      }

      // Check if request limit is exceeded
      if (userRecord.count >= this.options.maxRequests) {
        return false;
      }

      // Increment request count
      this.requests.set(identifier, {
        count: userRecord.count + 1,
        lastReset: userRecord.lastReset
      });
      return true;
    }

    // Create new record for this identifier
    this.requests.set(identifier, { count: 1, lastReset: now });
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const userRecord = this.requests.get(identifier);
    if (!userRecord) return this.options.maxRequests;
    
    const now = Date.now();
    if (now - userRecord.lastReset > this.options.interval) {
      return this.options.maxRequests;
    }
    
    return Math.max(0, this.options.maxRequests - userRecord.count);
  }

  getResetTime(identifier: string): number {
    const userRecord = this.requests.get(identifier);
    if (!userRecord) return Date.now() + this.options.interval;
    
    return userRecord.lastReset + this.options.interval;
  }

  // Method to get the current count for debugging
  getRequestCount(identifier: string): number {
    const userRecord = this.requests.get(identifier);
    if (!userRecord) return 0;
    
    const now = Date.now();
    if (now - userRecord.lastReset > this.options.interval) {
      return 0;
    }
    
    return userRecord.count;
  }
}