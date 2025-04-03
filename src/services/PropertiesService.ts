import { RedisClient } from "../configuration/redis.config";
import { BaseModel } from "../models/BaseModel";

export class PropertiesService extends BaseModel {
  private readonly redis
  constructor() {
    super('properties')
    this.redis = new RedisClient()
  }


}