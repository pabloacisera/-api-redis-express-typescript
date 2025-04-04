import { Owner } from '@prisma/client';
import { RedisClient } from '../configuration/redis.config';
import { DataSheet, ExcelExportResult } from '../interfaces/excel.interface';
import { IOwner, IOwnerResponse } from "../interfaces/owner.interface";
import { BaseModel } from "../models/BaseModel";
import { ApiError } from '../utils/ApiError';
import { ExcelService } from './ExcelService';


export class OwnerService extends BaseModel {

  private redis = new RedisClient()
  private excelService: ExcelService

  constructor() {
    super('owner');
    this.excelService = new ExcelService()
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



  async getModelExcel(name: string): Promise<Buffer> {
    try {
      const columnsResponse = await this.getColumns('owners');
      console.log('columnas obtenidas: ', columnsResponse);

      if (!columnsResponse.success || !columnsResponse.data) {
        throw new Error(columnsResponse.message || 'Failed to get columns');
      }

      return await this.excelService.createEmptyExcel(columnsResponse.data, 'Owners template');
    } catch (error) {
      console.error(error);
      throw error; // Esto asegura que la promesa se rechace con el error
    }
  }

  async importFromExcel(buffer: Buffer, serviceName: string): Promise<{
    success: boolean;
    message: string;
    data?: any[];
    error?: string;
    stats?: {
      created: number;
      skipped: number;
      total: number;
    };
  }> {
    try {
      // 1. Leer el archivo Excel
      const data = await this.excelService.readExcel(buffer);
      console.log('📊 Datos del Excel:', JSON.stringify(data, null, 2));

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'El archivo Excel está vacío o no tiene datos válidos.'
        };
      }

      // 2. Procesar cada registro
      const results = {
        created: 0,
        skipped: 0,
        total: data.length
      };

      const processedData = [];

      for (const item of data) {
        try {
          // 2.1. Verificar si existe por DNI usando el método del BaseModel
          const existingOwnerResponse = await this.findByUnique<Owner>({ dni: item.dni });

          if (existingOwnerResponse.success && existingOwnerResponse.data) {
            console.log(`⏩ Propietario con DNI ${item.dni} ya existe, omitiendo`);
            results.skipped++;
            continue;
          }

          // 2.2. Preparar datos para creación
          const ownerData: IOwner = {
            name: item.name,
            dni: item.dni,
            cuit: item.cuit,
            age: item.age,
            address: item.address,
            phone: item.phone,
            email: item.email,
            birthDate: new Date(item.birth_date),
            nationality: item.nationality,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // 2.3. Crear en base de datos usando el método create del BaseModel
          const creationResult = await this.create<Owner>(ownerData);

          if (!creationResult.success || !creationResult.data) {
            console.error(`❌ Error creando propietario ${item.dni}:`, creationResult.message);
            continue;
          }

          // 2.4. Guardar en Redis
          await this.redis.set(`owner:${creationResult.data.id}`, creationResult.data);

          // Invalida la caché de todos los owners
          await this.redis.del('owners:all');

          // 2.5. Agregar a resultados
          processedData.push(creationResult.data);
          results.created++;
          console.log(`✅ Propietario ${item.dni} creado exitosamente`);

        } catch (error) {
          console.error(`⚠️ Error procesando registro ${item.dni}:`, error instanceof Error ? error.message : error);
        }
      }

      return {
        success: true,
        message: `Importación completada. Creados: ${results.created}, Omitidos: ${results.skipped}`,
        data: processedData,
        stats: results
      };

    } catch (error) {
      console.error('❌ Error al importar desde Excel:', error);
      return {
        success: false,
        message: 'Error al procesar el archivo Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

}
