import { PrismaClient } from "@prisma/client";
import { IOwnerResponse } from "../interfaces/owner.interface";

export class BaseModel {
  private prismaClient: PrismaClient;
  private modelName: keyof PrismaClient;

  constructor(modelName: keyof PrismaClient) {
    this.prismaClient = new PrismaClient();
    this.modelName = modelName;
  }

  async create<T>(data: any): Promise<IOwnerResponse<T>> {
    try {
      const result = await (this.prismaClient[this.modelName] as any).create({ data });
      return {
        success: true,
        message: `${this.modelName.toString()} created successfully`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create ${this.modelName.toString()}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async findMany<T>(): Promise<IOwnerResponse<T[]>> {
    try {
      const results = await (this.prismaClient[this.modelName] as any).findMany();
      return {
        success: true,
        message: `${this.modelName.toString()} list retrieved`,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve ${this.modelName.toString()} list`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async findById<T>(id: string): Promise<IOwnerResponse<T>> {
    try {
      const result = await (this.prismaClient[this.modelName] as any).findUnique({ where: { id } });
      if (!result) {
        return {
          success: false,
          message: `${this.modelName.toString()} not found`,
        };
      }
      return {
        success: true,
        message: `${this.modelName.toString()} retrieved successfully`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve ${this.modelName.toString()}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async findByUnique<T>(criteria: Record<string, any>): Promise<IOwnerResponse<T>> {
    try {
      const result = await (this.prismaClient[this.modelName] as any).findUnique({ where: criteria });
      if (!result) {
        return {
          success: false,
          message: `${this.modelName.toString()} not found`,
        };
      }
      return {
        success: true,
        message: `${this.modelName.toString()} retrieved successfully`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve ${this.modelName.toString()}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async update<T>(id: string, data: Partial<T>): Promise<IOwnerResponse<T>> {
    try {
      const result = await (this.prismaClient[this.modelName] as any).update({
        where: { id },
        data
      });
      return {
        success: true,
        message: `${this.modelName.toString()} updated successfully`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update ${this.modelName.toString()}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async delete<T>(id: string): Promise<IOwnerResponse<T>> {
    try {
      const result = await (this.prismaClient[this.modelName] as any).delete({ where: { id } });
      return {
        success: true,
        message: `${this.modelName.toString()} deleted successfully`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete ${this.modelName.toString()}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}