import { createClient } from "redis"
import { envs } from "./environments"

export class RedisClient {
  private client

  constructor() {
    this.client = createClient({
      url: `${envs.REDIS_HOST}:${envs.REDIS_PORT}`
    })
    this.client.on('error', (err) => console.error('Redis clien error:', err))
    this.client.connect()
  }

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  async get(key: string): Promise<string | null> {
    const result = await this.client.get(key)
    return result ? JSON.parse(result) : null
  }

  async setex(key: string, seconds: number, value: string) {
    await this.client.setEx(key, seconds, value)
  }
}