import { Request, Response } from "express";
import { ExcelService } from "../services/ExcelService";
import { OwnerService } from "../services/OwnerService";

export class OwnerController {
  private ownerService: OwnerService
  constructor() {
    this.ownerService = new OwnerService()
  }

  async createOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerData = req.body;
      const newOwner = await this.ownerService.createOwner(ownerData)
      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message: 'new user has not been created',
        });
      }
      return res.status(201).json({ success: true, message: 'owner created successfully', data: newOwner })
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async getAllOwners(req: Request, res: Response): Promise<Response> {
    try {
      const owners = await this.ownerService.getAllOwners()
      if (!owners.success) {
        return res.status(500).json({ success: false, message: 'internal server error', error: owners.error })
      }
      return res.status(200).json(owners)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const ownerResponse = await this.ownerService.getOwnerById(ownerId);

      if (!ownerResponse.success) {
        return res.status(404).json(ownerResponse); // Devuelve el mensaje de error del servicio
      }

      return res.status(200).json(ownerResponse);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error });
    }
  }

  async updateOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const ownerData = req.body;
      const updatedOwner = await this.ownerService.updateOwner(ownerId, ownerData)
      if (!updatedOwner.success) {
        return res.status(404).json({ success: false, message: 'owner not found' })
      }
      return res.status(200).json(updatedOwner)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const deletedOwner = await this.ownerService.deleteOwner(ownerId)
      if (!deletedOwner.success) {
        return res.status(404).json({ success: false, message: 'owner not found' })
      }
      return res.status(200).json(deletedOwner)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async downloadExcelWithOwners(req: Request, res: Response) {
    try {
      const { buffer, hasData } = await this.ownerService.generateExcel();

      if (!hasData) {
        return res.status(200).json({
          success: true,
          message: 'No se encontraron propietarios para exportar',
          data: null
        });
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=propietarios.xlsx');

      return res.send(buffer);
    } catch (error) {
      console.error('Error generando Excel:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al generar el archivo Excel'
      });
    }
  }

  async getModelExcel(req: Request, res: Response) {
    try {
      const { tableName } = req.body
      console.log(req.body)
      const excelBuffer = await this.ownerService.getModelExcel(tableName)
      // Configurar los headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');

      return res.send(excelBuffer);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async importFromExcel(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      if (!req.body.service) {
        return res.status(400).json({
          success: false,
          message: 'No service specified for import'
        });
      }

      // Pasar el buffer y el nombre del servicio al método del servicio
      const result = await this.ownerService.importFromExcel(
        req.file.buffer,
        req.body.service
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in importFromExcel:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during import',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
}
