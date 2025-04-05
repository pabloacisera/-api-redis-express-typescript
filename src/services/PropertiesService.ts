import { RedisClient } from "../configuration/redis.config";
import { Properties, PropertiesResponse } from "../interfaces/properties.interface";
import { BaseModel } from "../models/BaseModel";
import { ExcelService } from "./ExcelService";

export class PropertiesService extends BaseModel {
  private readonly redis
  private readonly excelService
  constructor() {
    super('properties')
    this.redis = new RedisClient()
    this.excelService = new ExcelService
  }

  private formatDate(dateInput: Date | string): Date {
    if (typeof dateInput === 'string') {
      // Convertir de "23/03/2025" a Date
      const [day, month, year] = dateInput.split('/');
      return new Date(`${year}-${month}-${day}`);
    }
    return dateInput;
  }

  async createProperties(data: Properties): Promise<PropertiesResponse<Properties>> {

    try {
      const validatedData = {
        ...data,
        dateRegitried: this.formatDate(data.dateRegitried) // Corregir formato de fecha
      };

      const dataSaved = await super.create(validatedData)

      await this.redis.setex(`properties:all`, 36000, JSON.stringify(dataSaved))

      return {
        success: true,
        data: data,
        message: 'Data retrieved',
        error: null
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error Server',
        error: error instanceof Error ? error : 'undefined'
      }
    }
  }

  async updateFromExcel(fileBuffer: Buffer): Promise<PropertiesResponse<Properties[]>> {
    try {
      const readData = await this.excelService.readExcel(fileBuffer);
      const results: Properties[] = [];

      for (const row of readData) {
        // Usar los nombres exactos de las columnas del Excel
        const fileNumber = row.file_number;
        const value = row.value;
        const ownerId = row.ownerId;
        const address = row.address;
        const dateRegitried = row.dateRegitried;

        // Validación con los nombres correctos
        if (!fileNumber || !value || !ownerId || !address) {
          console.warn('Fila omitida - falta información requerida:', row);
          continue;
        }

        const propertyData: Properties = {
          fileNumber: String(fileNumber),
          value: Number(value),
          ownerId: Number(ownerId),
          dateRegitried: dateRegitried ? this.formatDate(dateRegitried) : new Date(),
          address: String(address),
        };

        const createResponse = await super.create(propertyData);

        if (createResponse?.success && createResponse.data) {
          results.push(createResponse.data as Properties);
        }
      }

      if (results.length === 0) {
        return {
          success: false,
          message: 'No valid data found in Excel',
          data: null,
          error: null
        };
      }

      await this.redis.setex(`properties:all`, 36000, JSON.stringify(results));

      return {
        success: true,
        data: results,
        message: `${results.length} properties updated from Excel`,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error updating from Excel',
        error: error instanceof Error ? error : new Error('Unknown error'),
        data: null
      };
    }
  }

  async getExcelEmpty(): Promise<Buffer> {
    try {
      const columnsResponse = await this.getColumns('properties');
      console.log('columnas obtenidas: ', columnsResponse);

      if (!columnsResponse.success || !columnsResponse.data) {
        throw new Error(columnsResponse.message || 'Failed to get columns');
      }

      return await this.excelService.createEmptyExcel(columnsResponse.data, 'Properties template');
    } catch (error) {
      console.error(error);
      throw error; // Esto asegura que la promesa se rechace con el error
    }
  }

  async getAllProperties(): Promise<PropertiesResponse<Properties[]>> {
    try {
      const propertiesFromCache = await this.redis.get('properties:all');

      if (propertiesFromCache) {
        return {
          success: true,
          message: 'All properties retrieved from cache',
          data: JSON.parse(propertiesFromCache),
          error: null
        };
      }

      const propertiesFromDb = await super.findMany<Properties>();

      if (!propertiesFromDb.success || !propertiesFromDb.data) {
        throw new Error('No existen datos en db');
      }

      await this.redis.setex('properties:all', 36000, JSON.stringify(propertiesFromDb.data));

      return {
        success: true,
        message: 'All properties retrieved from DB',
        data: propertiesFromDb.data, // <-- Solo los datos
        error: null
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error en el servicio',
        error: error instanceof Error ? error : new Error('Unknown error'),
        data: null
      };
    }
  }
}






