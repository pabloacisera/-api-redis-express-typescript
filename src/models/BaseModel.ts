import { PrismaClient } from "@prisma/client";

export class BaseModel {
  private prismaClient: PrismaClient
  private modelName: keyof PrismaClient

  constructor(modelName: keyof PrismaClient) {
    this.prismaClient = new PrismaClient()
    this.modelName = modelName
  }

  async create<T>(data: any): Promise<T> {
    return await (this.prismaClient[this.modelName] as any).create({ data })
  }

  async findMany<T>(): Promise<T[]> {
    return await (this.prismaClient[this.modelName] as any).findMany()
  }

  async findById<T>(id: string): Promise<T | null> {
    return await (this.prismaClient[this.modelName] as any).findFirst({ where: { id } })
  }

  async findByUnique<T>(value: any): Promise<T | null> {
    return await (this.prismaClient[this.modelName] as any).findUnique({ where: { value } })
  }

  async update<T>(id: string, data: Partial<T>): Promise<T> {
    return await (this.prismaClient[this.modelName] as any).update({ where: { id }, data })
  }

  async delete<T>(id: string): Promise<void> {
    await (this.prismaClient[this.modelName] as any).delete({ where: { id } })
  }
}