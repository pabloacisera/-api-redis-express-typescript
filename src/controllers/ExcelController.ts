import { Request, Response } from 'express';
import { ApiError, InternalServerError } from '../customErrors/custom.errors';
import { ExcelService } from '../services/ExcelService';

export class UploadController {
  static async uploadExcel(req: Request, res: Response) {
    try {
      const data = await ExcelService.processExcelFile(req);
      res.json({ success: true, data });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          details: error.details
        });
      } else {
        // Para errores no controlados
        const internalError = new InternalServerError(
          'An unexpected error occurred',
          error instanceof Error ? error.stack : undefined
        );
        res.status(internalError.statusCode).json({
          success: false,
          message: internalError.message,
          details: internalError.details
        });
      }
    }
  }
}