import { PrismaClient } from "@prisma/client";
import { IOwner, IOwnerCreate } from "../interfaces/owner.interface";

export class OwnerModel {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createOwner(owner: IOwnerCreate): Promise<IOwner> {
    return await this.prisma.owner.create({ data: owner })
  }

  async findAll(): Promise<IOwner[]> {
    return await this.prisma.owner.findMany()
  }

  async findById(id: number): Promise<IOwner | null> {
    return await this.prisma.owner.findFirst({ where: { id } })
  }

  async updateOwner(id: number, owner: IOwner): Promise<IOwner> {
    return await this.prisma.owner.update({ where: { id }, data: owner })
  }

  async deleteOwner(id: number): Promise<void> {
    await this.prisma.owner.delete({ where: { id } })
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return this.prisma.owner.findUnique({
      where: { email }
    });
  }

  async findByDni(dni: string): Promise<IOwner | null> {
    return this.prisma.owner.findUnique({
      where: { dni }
    });
  }

  async findByCuit(cuit: string): Promise<IOwner | null> {
    return this.prisma.owner.findUnique({
      where: { cuit }
    });
  }
}