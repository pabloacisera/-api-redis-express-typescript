import * as ExcelJS from 'exceljs';
import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export class ExcelService {
  private static allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  static async generateAndDownloadExcel(res: Response, data: any[], filename: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (data.length > 0) {
      worksheet.addRow(Object.keys(data[0]));
      data.forEach(item => worksheet.addRow(Object.values(item)));
    }

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
    res.send(buffer);
  }

  static async processExcelFile(req: Request): Promise<{data: any[], modelName: string}> {
    const { modelName } = req.body;
    
    if (!modelName) {
      throw new ApiError('Model name is required', 400);
    }

    if (!this.hasValidFile(req)) {
      throw new ApiError('No file uploaded or invalid file format', 400);
    }

    const file = (req as any).file;

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new ApiError('Excel file has no worksheets', 400);
      }

      const data = this.extractDataFromWorksheet(worksheet);
      
      return {
        data,
        modelName
      };
    } catch (error) {
      throw new ApiError(`Error processing Excel: ${error}`, 500);
    }
  }

  private static hasValidFile(req: Request): boolean {
    const file = (req as any).file;
    return !!file && !!file.buffer && this.allowedMimeTypes.includes(file.mimetype);
  }

  private static extractDataFromWorksheet(worksheet: ExcelJS.Worksheet): any[] {
    const data: any[] = [];
    const headers = this.getHeaders(worksheet);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData: any = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (header) {
          rowData[header] = cell.value;
        }
      });
      data.push(rowData);
    });

    return data;
  }

  private static getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.text);
    });
    return headers;
  }
}
