import * as ExcelJS from 'exceljs';
import { DataSheet } from '../interfaces/excel.interface';
import { ApiError } from '../utils/ApiError';

export class ExcelService {
  async createExcel(dataSheet: DataSheet): Promise<Buffer> {
    try {
      const { titleSheet = 'default-sheet', data } = dataSheet;

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new ApiError('No data provided for Excel generation', 400);
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(titleSheet);

      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }
        };
      });

      data.forEach((row) => {
        const rowData = headers.map(header => row[header]);
        worksheet.addRow(rowData);
      });

      // Versión corregida y simplificada del autoajuste de columnas
      worksheet.columns.forEach((column) => {
        if (column.header) {
          const valueLengths = column.values?.slice(1).map(v => v?.toString().length || 0) || [];
          column.width = Math.max(
            10,
            column.header.length * 1.3,
            ...valueLengths
          );
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Excel generation error:', error);
      throw error instanceof ApiError
        ? error
        : new ApiError('Failed to generate Excel file', 500);
    }
  }

  async readExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook()

    await workbook.xlsx.load(buffer)

    const data:any[] = []
    workbook.eachSheet(worksheet => {
      const headers: string[] = []
      let firstRow = true

      worksheet.eachRow({ includeEmpty: false }, ( row, rowNumber ) => {
        if(firstRow) {
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            headers[colNumber - 1] = cell.text
          })
          firstRow = false
        } else {
          const rowData: any = {};
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            rowData[header] = cell.text;
          });
          data.push(rowData);
        }
      })
    })
    return data
  }
}