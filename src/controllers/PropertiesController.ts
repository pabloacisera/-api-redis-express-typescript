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

  async getAllProperties(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.propService.getAllProperties()
      return res.status(result.success ? 200 : 400).json(result)
    } catch (error) {
      console.error('Error in getAllProperties:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error getting properties',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async downloadExcelTemplate(req: Request, res: Response): Promise<any> {
    try {
      const buffer = await this.propService.getExcelEmpty()
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=properties_template.xlsx'
      )

      return res.send(buffer)
    } catch (error) {
      console.error('Error in downloadExcelTemplate:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error generating template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async importFromExcel(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        console.log('No se recibió archivo en la solicitud');
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      console.log('Archivo recibido:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const result = await this.propService.updateFromExcel(req.file.buffer);
      console.log('Resultado del procesamiento:', result);

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en importFromExcel:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during import',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}