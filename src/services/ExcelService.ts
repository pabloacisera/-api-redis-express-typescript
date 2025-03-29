import * as ExcelJS from 'exceljs';
import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export class ExcelService {

  private static allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  static async generateAndDownloadExcel(res: Response, data: any[], filename: string): Promise<void> {
    // 1. Generar el Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (data.length > 0) {
      worksheet.addRow(Object.keys(data[0])); // Headers
      data.forEach(item => worksheet.addRow(Object.values(item))); // Rows
    }

    // 2. Convertir a Buffer
    const buffer = await workbook.xlsx.writeBuffer() as Buffer;

    // 3. Descargar
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
    res.send(buffer);
  }

  static async processExcelFile(req: Request): Promise<any[]> {
    if (!this.hasValidFile(req)) {
      throw new ApiError('No file uploaded or invalid file format', 400);
    }

    const file = (req as any).file; // Type assertion temporal

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new ApiError('Excel file has no worksheets', 400);
      }

      const data = this.extractDataFromWorksheet(worksheet);
      console.log('Datos procesados:', data);
      return data;
    } catch (error) {
      throw new ApiError(`Error processing Excel: ${error}`, 500);
    }
  }

  private static hasValidFile(req: Request): boolean {
    const file = (req as any).file;
    return !!file &&
      !!file.buffer &&
      this.allowedMimeTypes.includes(file.mimetype);
  }

  private static extractDataFromWorksheet(worksheet: ExcelJS.Worksheet): any[] {
    const data: any[] = [];
    const headers = this.getHeaders(worksheet);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezados

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