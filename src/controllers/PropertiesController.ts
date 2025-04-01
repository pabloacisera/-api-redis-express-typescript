import { Request, Response } from 'express'
import { PropertiesService } from '../services/PropertiesService'

export class PropertiesController {
  private propertiesService: PropertiesService

  constructor() {
    this.propertiesService = new PropertiesService()
  }

  async createProperty(req: Request, res: Response): Promise<Response<any>> {
    try {
      const response = await this.propertiesService.create(req.body)
      return res.status(201).json(response)
    } catch (error: any) {
      console.error('Error creating property:', error)
      return res.status(500).json({ error: 'Failed to create property' })
    }
  }

  async getAllProperties(req: Request, res: Response): Promise<Response<any>> {
    try {
      const response = await this.propertiesService.findAll()
      return res.json(response)
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      return res.status(500).json({ error: 'Failed to fetch properties' })
    }
  }

  async getPropertyById(req: Request, res: Response): Promise<Response<any>> {
    try {
      const response = await this.propertiesService.findById(+req.params.id)
      if (!response) return res.status(404).json({ error: 'Property not found' })
      return res.json(response)
    } catch (error: any) {
      console.error('Error fetching property by id:', error)
      return res.status(500).json({ error: 'Failed to fetch property by id' })
    }
  }

  async updateProperty(req: Request, res: Response): Promise<Response<any>> {
    try {
      const response = await this.propertiesService.update(+req.params.id, req.body)
      if (!response) return res.status(404).json({ error: 'Property not found' })
      return res.json(response)
    } catch (error: any) {
      console.error('Error updating property:', error)
      return res.status(500).json({ error: 'Failed to update property' })
    }
  }

  async deleteProperty(req: Request, res: Response): Promise<Response<any>> {
    try {
      const response = await this.propertiesService.delete(+req.params.id)
      if (!response) return res.status(404).json({ error: 'Property not found' })
      return res.status(204).json({})
    } catch (error: any) {
      console.error('Error deleting property:', error)
      return res.status(500).json({ error: 'Failed to delete property' })
    }
  }
}