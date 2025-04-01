import { createPropertyCache } from '../helpers/propertiesCache.helper'
import { Properties, PropertyResponse } from '../interfaces/properties.interface'
import { PropertyModel } from '../models/PropertyModel'

export class PropertiesService {
  private model: PropertyModel

  constructor() {
    this.model = new PropertyModel()
  }

  async create(property: PropertyResponse): Promise<any> {
    try {
      const newProperty = await this.model.create(property)
      await createPropertyCache(newProperty)
      return newProperty
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<any> {
    return await this.model.findAll()
  }

  async findById(id: number): Promise<any> {
    return await this.model.findById(id)
  }

  async update(id: number, properties: Partial<Properties>): Promise<any> {
    return await this.model.update(id, properties)
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.model.delete(id)
      return true
    } catch (error) {
      return false
    }
  }
}