import { Request, Response } from "express"
import { IResponse } from "../interfaces/owner.interface"
import { OwnerService } from "../services/OwnerService"

export class OwnerController {
  private ownerService: OwnerService

  constructor() {
    this.ownerService = new OwnerService()
  }

  async createOwner(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      const response = await this.ownerService.createOwner(req.body)
      return res.status(201).json(response)
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getAllOwners(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      const response = await this.ownerService.getAllOwners()
      return res.json(response)
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      const response = await this.ownerService.getOwnerById(parseInt(req.params.id))
      return res.json(response)
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async updateOwner(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      const response = await this.ownerService.updateOwner(parseInt(req.params.id), req.body)
      return res.json(response)
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      const response = await this.ownerService.deleteOwner(parseInt(req.params.id))
      return res.json(response)
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}