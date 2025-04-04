import { Request, Response } from "express";
import { PropertiesService } from "../services/PropertiesService";

export class PropertiesController {
  private propService: PropertiesService

  constructor() {
    this.propService = new PropertiesService()
  }

  async createProperty(req: Request, res: Response): Promise<void> {
    const data = req.body
    try {
      const response = await this.propService.createProperties(data)

      if (!response.success) {
        res.status(400).json({
          message: response.message,
          error: response.error
        });
        return;
      }
      res.status(201).json({
        message: 'property created successfully',
        data: response.data
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }
}