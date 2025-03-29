import { Request, Response } from "express"
import { IResponse } from "../interfaces/owner.interface"
import { ExcelService } from "../services/ExcelService"
import { OwnerService } from "../services/OwnerService"

export class OwnerController {
  private ownerService: OwnerService

  constructor() {
    this.ownerService = new OwnerService()
  }

  async createOwner(req: Request, res: Response): Promise<Response<IResponse<any>>> {
    try {
      console.log('Request Body: ', req.body)
      const response = await this.ownerService.createOwner(req.body)
      return res.status(201).json(response)
    } catch (error: any) {
      console.error('Error create owner: ', error)
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

  async downloadDocumentFromOwners(req: Request, res: Response): Promise<any> {
    try {
      const response = await this.ownerService.downloadDocumentsOwners()

      await ExcelService.generateAndDownloadExcel(
        res,
        response,
        'Owners_document.xlsx'
      )
    } catch (error: any) {
      console.error('Error downloading documents: ', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error generating Excel file'
      });
    }
  }
}