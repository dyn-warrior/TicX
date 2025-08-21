import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// Queue management utilities
export class MatchmakingQueue {
  private static getQueueKey(entryAmount: number): string {
    return `queue:${entryAmount}`;
  }

  /**
   * Add a user to the matchmaking queue
   */
  static async joinQueue(
    entryAmount: number,
    userId: string,
    leverage: number
  ): Promise<void> {
    const queueKey = this.getQueueKey(entryAmount);
    const payload = {
      userId,
      entryAmount,
      leverage,
      timestamp: Date.now(),
    };

    await redis.lpush(queueKey, JSON.stringify(payload));
  }

  /**
   * Remove a user from the queue
   */
  static async leaveQueue(entryAmount: number, userId: string): Promise<boolean> {
    const queueKey = this.getQueueKey(entryAmount);
    const queueLength = await redis.llen(queueKey);

    if (queueLength === 0) return false;

    // Get all items in queue
    const items = await redis.lrange(queueKey, 0, -1);
    
    for (let i = 0; i < items.length; i++) {
      try {
        const payload = JSON.parse(items[i]);
        if (payload.userId === userId) {
          // Remove this specific item
          await redis.lrem(queueKey, 1, items[i]);
          return true;
        }
      } catch (error) {
        console.error('Error parsing queue item:', error);
      }
    }

    return false;
  }

  /**
   * Try to match two players from the queue
   */
  static async findMatch(entryAmount: number): Promise<{
    player1: any;
    player2: any;
  } | null> {
    const queueKey = this.getQueueKey(entryAmount);
    
    // Use Lua script for atomic operation
    const luaScript = `
      local queueKey = KEYS[1]
      local queueLength = redis.call('LLEN', queueKey)
      
      if queueLength < 2 then
        return nil
      end
      
      local player1 = redis.call('RPOP', queueKey)
      local player2 = redis.call('RPOP', queueKey)
      
      return {player1, player2}
    `;

    const result = await redis.eval(luaScript, [queueKey], []) as string[] | null;

    if (!result) return null;

    try {
      return {
        player1: JSON.parse(result[0]),
        player2: JSON.parse(result[1]),
      };
    } catch (error) {
      console.error('Error parsing matched players:', error);
      return null;
    }
  }

  /**
   * Get queue length for a specific entry amount
   */
  static async getQueueLength(entryAmount: number): Promise<number> {
    const queueKey = this.getQueueKey(entryAmount);
    return await redis.llen(queueKey);
  }

  /**
   * Get all active queues with their lengths
   */
  static async getAllQueues(): Promise<Record<string, number>> {
    const pattern = 'queue:*';
    const keys = await redis.keys(pattern);
    const queues: Record<string, number> = {};

    for (const key of keys) {
      const entryAmount = key.replace('queue:', '');
      queues[entryAmount] = await redis.llen(key);
    }

    return queues;
  }

  /**
   * Clear a specific queue (admin function)
   */
  static async clearQueue(entryAmount: number): Promise<void> {
    const queueKey = this.getQueueKey(entryAmount);
    await redis.del(queueKey);
  }
}

// Rate limiting utilities
export class RateLimiter {
  /**
   * Check if a user can perform an action based on rate limit
   */
  static async checkRateLimit(
    userId: string,
    action: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${action}:${userId}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Use Lua script for atomic rate limiting
    const luaScript = `
      local key = KEYS[1]
      local window_start = tonumber(ARGV[1])
      local now = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      
      -- Remove old entries
      redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
      
      -- Count current entries
      local current = redis.call('ZCARD', key)
      
      if current < limit then
        -- Add new entry
        redis.call('ZADD', key, now, now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
        return {1, limit - current - 1, now + window_ms}
      else
        -- Rate limited
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')[2]
        local reset_time = oldest and (tonumber(oldest) + window_ms) or (now + window_ms)
        return {0, 0, reset_time}
      end
    `;

    const result = await redis.eval(
      luaScript,
      [key],
      [windowStart.toString(), now.toString(), limit.toString(), windowMs.toString()]
    ) as [number, number, number];

    return {
      allowed: result[0] === 1,
      remaining: result[1],
      resetTime: result[2],
    };
  }
}

// Session management
export class SessionManager {
  /**
   * Store session data
   */
  static async setSession(sessionId: string, data: any, ttlSeconds: number): Promise<void> {
    const key = `session:${sessionId}`;
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  }

  /**
   * Get session data
   */
  static async getSession(sessionId: string): Promise<any | null> {
    const key = `session:${sessionId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Delete session
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await redis.del(key);
  }
}
