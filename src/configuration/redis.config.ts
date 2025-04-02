import { createClient } from "redis";
import { envs } from "./environments";

export class RedisClient {
  private client;

  constructor() {
    this.client = createClient({
      url: `${envs.REDIS_HOST}:${envs.REDIS_PORT}`
    });
    this.client.on('error', (err) => console.error('Redis client error:', err));
    this.client.connect();
  }

  async set(key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.set(key, stringValue);
  }

  async get(key: string): Promise<any | null> {
    const result = await this.client.get(key);
    if (!result) return null;

    try {
      return JSON.parse(result);
    } catch (error) {
      console.error(`Failed to parse Redis value for key ${key}:`, error);
      return result;
    }
  }

  async setex(key: string, seconds: number, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.setEx(key, seconds, stringValue);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }
}