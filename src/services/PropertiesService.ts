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

      await this.redis.setex(`properties:all`, 36000, dataSaved)

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
}