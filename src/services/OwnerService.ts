import { Owner } from '@prisma/client';
import { RedisClient } from '../configuration/redis.config';
import { IOwner, IOwnerResponse } from "../interfaces/owner.interface";
import { BaseModel } from "../models/BaseModel";


export class OwnerService extends BaseModel {

  private redis = new RedisClient()

  constructor() {
    super('owner');
  }

  private parseDateString(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  async createOwner(data: IOwner): Promise<IOwnerResponse<Owner>> {
    try {
      // Procesamiento de datos
      if (typeof data.birthDate === 'string') {
        data.birthDate = this.parseDateString(data.birthDate);
      }

      const now = new Date();
      data.createdAt = now;
      data.updatedAt = now;

      // Crear en base de datos
      const result = await super.create<Owner>(data);

      if (result.success && result.data) {
        // Guardar en Redis
        await this.redis.set(`owner:${result.data.id}`, result.data);
      }
      return result as IOwnerResponse<Owner>
    } catch (error) {
      console.error('Error creating owner:', error);
      return {
        success: false,
        message: 'Failed to create owner',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllOwners(): Promise<IOwnerResponse<Owner[]>> {
    try {
      const cachekey = 'owners:all'
      const ownersCache = await this.redis.get(cachekey)
      if (ownersCache) {
        return {
          success: true,
          message: 'Owners retrieved from cache',
          data: JSON.parse(ownersCache),
          error: null
        }
      }
      const result = await super.findMany<Owner>()

      if (result.success && result.data) {
        await this.redis.setex(cachekey, 3600, JSON.stringify(result.data))
      }
      return result
    } catch (error) {
      console.error('Error getting all owners:', error);
      return {
        success: false,
        message: 'Failed to get owners',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined
      };
    }
  }

  async getOwnerById(id: string): Promise<IOwnerResponse<Owner>> {
    try {
      const ownerCache = await this.redis.get(`owner:${id}`)
      if (ownerCache) {
        return {
          success: true,
          message: 'owner get by id fron cache',
          data: JSON.parse(ownerCache)
        }
      }
      const result = await super.findById<Owner>(id)

      if (result.success && result.data) {
        await this.redis.setex(`owner:${id}`, 3600, JSON.stringify(result.data))
      }
      return {
        success: true,
        message: 'owner get by id',
        data: result.data
      }
    } catch (err) {
      return {
        success: false,
        message: 'internal server error',
      }
    }
  }
}


