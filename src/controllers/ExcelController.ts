import { Request, Response } from "express";
import { ApiError } from "../customErrors/custom.errors";
import { ExcelService } from "../services/ExcelService";

export class ExcelController {
  private excelService: ExcelService

  constructor() {
    this.excelService = new ExcelService()
  }

  async generateExcel(req: Request, res: Response) {
    try {
      const { titleSheet, data } = req.body
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data provided')
      }

      const buffer = await this.excelService.createExcel({ titleSheet, data })

      // Configurar headers para descarga
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${titleSheet || 'export'}.xlsx`
      );

      return res.send(buffer);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}