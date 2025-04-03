import { Owner } from '@prisma/client';
import { RedisClient } from '../configuration/redis.config';
import { FromExcelToDbResponse } from '../interfaces/chargeDataFromExcel.interface';
import { DataSheet, ExcelExportResult } from '../interfaces/excel.interface';
import { IOwner, IOwnerResponse } from "../interfaces/owner.interface";
import { BaseModel } from "../models/BaseModel";
import { ApiError } from '../utils/ApiError';
import { ExcelService } from './ExcelService';


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
          data: ownersCache,
          error: null
        }
      }
      const result = await super.findMany<Owner>()

      if (result.success && result.data) {
        await this.redis.setex(cachekey, 3600, result.data)
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
      // Intenta obtener de Redis
      const ownerCache = await this.redis.get(`owner:${id}`);

      if (ownerCache) {
        if (typeof ownerCache === 'object') {
          return {
            success: true,
            message: 'Owner retrieved from cache',
            data: ownerCache,
            error: null,
          };
        }
        return {
          success: false,
          message: 'Invalid cache format',
          error: 'Cached data is not in expected format',
          data: undefined
        };
      }

      // Si no está en caché, busca en la base de datos
      const dbResult = await super.findById<Owner>(id);

      if (!dbResult.success || !dbResult.data) {
        return {
          success: false,
          message: 'Owner not found',
          error: dbResult.error || 'Owner does not exist',
          data: undefined
        };
      }

      // Guarda en Redis con manejo de errores
      try {
        await this.redis.setex(`owner:${id}`, 3600, dbResult.data);
      } catch (redisError) {
        console.error('Failed to cache owner:', redisError);
        // No es crítico, podemos continuar
      }

      return {
        success: true,
        message: 'Owner retrieved from database',
        data: dbResult.data,
        error: null,
      };

    } catch (error) {
      console.error('Error in getOwnerById:', error);
      return {
        success: false,
        message: 'Failed to retrieve owner',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined,
      };
    }
  }

  async deleteOwner(id: string): Promise<IOwnerResponse<Owner | null>> {
    try {
      const ownerExists = await super.findById<Owner>(id);

      if (!ownerExists.success || !ownerExists.data) {
        return {
          success: false,
          message: 'Owner not found',
          data: null,
          error: ownerExists.error,
        };
      }

      const deleteOwner = await super.delete<Owner>(id);

      if (deleteOwner.success) {
        await this.redis.del(`owner:${id}`);
        return {
          success: true,
          message: 'Owner deleted successfully',
          data: deleteOwner.data,
          error: null,
        };
      } else {
        return deleteOwner;
      }

    } catch (error) {
      console.error('Error deleting owner:', error);
      return {
        success: false,
        message: 'Failed to delete owner',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateOwner(id: string, data: Partial<IOwner>): Promise<IOwnerResponse<Owner>> {
    try {
      if (data.birthDate && typeof data.birthDate === 'string') {
        data.birthDate = this.parseDateString(data.birthDate);
      }

      data.updatedAt = new Date();

      const result = await super.update<Owner>(id, data);

      if (result.success && result.data) {
        await this.redis.setex(`owner:${id}`, 3600, result.data);
        return {
          success: true,
          message: 'Owner updated successfully',
          data: result.data,
          error: null,
        };
      } else {
        return result;
      }

    } catch (error) {
      console.error('Error updating owner:', error);
      return {
        success: false,
        message: 'Failed to update owner',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined,
      };
    }
  }

  async generateExcel(): Promise<ExcelExportResult> {
    try {
      const response = await this.getAllOwners()

      if (!response.success) {
        throw new ApiError(response.message || 'Failed to get owners data', 400)
      }

      if (!response.data || response.data.length === 0) {
        return {
          buffer: Buffer.alloc(0),
          hasData: false
        }
      }

      const excelService = new ExcelService()

      const dataSheet: DataSheet = {
        titleSheet: 'propietarios',
        data: response.data.map(owner => ({
          ID: owner.id,
          NOMBRE: owner.name,
          DNI: owner.dni,
          CUIT: owner.cuit,
          EDAD: owner.age,
          DIRECCIÓN: owner.address,
          TELEFONO: owner.phone,
          EMAIL: owner.email,
          NACIMIENTO: owner.birthDate,
          NACIONALIDAD: owner.nationality,
          CREACIÓN: owner.createdAt,
          ACTUALIZACIÓN: owner.updatedAt,
        }))
      }

      const buffer = await excelService.createExcel(dataSheet)

      if (!buffer || !(buffer instanceof Buffer)) {
        throw new ApiError('Generated excelbuffer is invalid', 500)
      }
      return {
        buffer,
        hasData: true
      }
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw error
    }
  }

  async importFromExcel(data: any[]): Promise<FromExcelToDbResponse> {
    try {
      const results: IOwnerResponse<Owner>[] = []

      for (const i of data) {
        const ownerData: IOwner = {
          name: i.name,
          dni: i.dni,
          cuit: i.cuit,
          age: i.age,
          address: i.address,
          phone: i.phone,
          email: i.email,
          birthDate: i.birthDate,
          nationality: i.nationality,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const result = await this.createOwner(ownerData)
        const ownersCache = await this.redis.setex(`owner:${result.data?.id}`, 36000, result.data)
        results.push(result)
        return {
          success: true,
          message: 'owners sets to db',
          data: results
        }
      }
      return {
        success: true,
        message: 'Owners imported successfully',
        data: results
      };
    } catch (error) {
      console.error('Error importing owners from Excel:', error);
      return {
        success: false,
        message: 'Failed to import owners from Excel',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}







