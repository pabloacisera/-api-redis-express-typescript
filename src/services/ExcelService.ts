import * as ExcelJS from 'exceljs';
import { DataSheet } from '../interfaces/excel.interface';
import { ApiError } from '../utils/ApiError';

export class ExcelService {
  private static allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  async createExcel(datasheet: DataSheet): Promise<any> {
    try {
      const { titleSheet, data } = datasheet

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(titleSheet);

      const headers = Object.keys(data[0])
      worksheet.addRow(headers)

      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true }
      headerRow.eachCell((cell, index) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } }
      })

      data.forEach((row, rowIndex) => {
        const rowData = headers.map(header => row[header])
        worksheet.addRow(rowData)
      })
      worksheet.columns.forEach(column => {
        column.width = Math.max(
          10,
          (column.header?.length || 0) * 1.3,
          ...(column.values?.map(v => v?.toString().length || 0) as number[])
        )
      })
      return workbook.xlsx.writeBuffer()
    } catch (error) {
      throw new ApiError('Error generating Excel file', 500);
    }
  }
}
