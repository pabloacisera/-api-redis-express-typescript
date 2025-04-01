import { PrismaClient } from "@prisma/client";
import { Properties, PropertyResponse } from "../interfaces/properties.interface";

export class PropertyModel {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  private mapToResponse(property: any & { owner: any }): PropertyResponse {
    return {
      id: property.id,
      fileNumber: property.fileNumber,
      value: property.value,
      owner: {
        id: property.owner.id,
        name: property.owner.name,
        dni: property.owner.dni,
        cuit: property.owner.cuit,
        age: property.owner.age,
        address: property.owner.address,
        phone: property.owner.phone,
        email: property.owner.email,
        birthDate: property.owner.birthDate,
        nationality: property.owner.nationality
      },
      dateRegitried: property.dateRegitried.toISOString(),
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    };
  }

  async create(properties: Properties): Promise<PropertyResponse> {
    try {
      const newProperty = await this.prisma.properties.create({
        data: {
          fileNumber: properties.fileNumber,
          value: properties.value,
          ownerId: properties.ownerId,
          dateRegitried: properties.dateRegitried,
          address: properties.address
        },
        include: {
          owner: true // Incluir la relación con owner
        }
      })
      return this.mapToResponse(newProperty)

    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error("Failed to create property");
    }
  }

  async findAll(): Promise<PropertyResponse[]> {
    try {
      const properties = await this.prisma.properties.findMany({
        include: {
          owner: true // Incluir la relación con owner
        }
      })
      return properties.map(this.mapToResponse)
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error("Failed to fetch properties");
    }
  }

  async findById(id: number): Promise<PropertyResponse | null> {
    try {
      const property = await this.prisma.properties.findFirst({
        where: { id },
        include: {
          owner: true // Incluir la relación con owner
        }
      })
      return property ? this.mapToResponse(property) : null
    } catch (error) {
      console.error("Error fetching property by id:", error);
      throw new Error("Failed to fetch property by id");
    }
  }

  async update(id: number, properties: Partial<Properties>): Promise<PropertyResponse | null> {
    try {
      const updatedProperty = await this.prisma.properties.update({
        where: { id },
        data: properties,
        include: {
          owner: true // Incluir la relación con owner
        }
      })
      return updatedProperty ? this.mapToResponse(updatedProperty) : null
    } catch (error) {
      console.error("Error updating property by id:", error);
      throw new Error("Failed to update property by id");
    }

  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.properties.delete({ where: { id } })
    } catch (error) {
      console.error("Error deleting property by id:", error);
      throw new Error("Failed to delete property by id");
    }
  }
}