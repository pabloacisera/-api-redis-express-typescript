import * as ExcelJS from 'exceljs';
import { Request, Response } from 'express';
import { createOwnerCache, getOwnerFromCache } from '../helpers/ownerCache.helper';
import { OwnerModel } from '../models/OwnerModel';
import { ApiError } from '../utils/ApiError';

export class ExcelService {
  private static model: OwnerModel = new OwnerModel()
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
      const dataConverted = this.convertDataTypes(data)
      console.log('Datos procesados:', dataConverted);


      /**
      * Debemos recorrer el arreglo de objetos y por cada id buscar si existe en base  de datos, si no existe lo incoporamos 
      * a DB y luego actualizamos redis, si existe lo obviamos ya que las base de da datos no necesitan que se ingrese es dato
      * */
      /**
      * utilizamos un bucle for porque dentro del foreach no se puede usar await
      * */

      for (let i of dataConverted) {
        try {
          let resCache = await getOwnerFromCache(Number(i.id))
          if (!resCache) {
            console.log(`No se ha encontrado informacion en cache con id: ${i.id}`)
            // consultar en base de datos:    
            const resFromDb = await this.model.findById(i.id)
            if (!resFromDb) {
              console.log('NO existe el dato en DB')
              await this.model.createOwner(i)
              await createOwnerCache(i)
            }
            console.log('Datos obtenido por id desde base de datos: ', resFromDb)
          }
          console.log('Datos obtenidos por id desde cache: ', resCache)
        } catch (error) {
          console.error('error desde cache: ', error)
        }
      }
      return dataConverted;
    } catch (error) {
      throw new ApiError(`Error processing Excel: ${error}`, 500);
    }
  }

  static convertDataTypes(data: any[]): any[] {
    const parseSafeDate = (dateValue: any): Date | null => {
      try {
        const date = new Date(dateValue);
        return !isNaN(date.getTime()) ? date : null;
      } catch {
        return null;
      }
    };
    return data.map(item => {
      const now = new Date();
      return {
        id: parseInt(item.id, 10),
        name: String(item.name),
        dni: String(item.dni),
        cuit: String(item.cuit),
        age: String(item.age),
        address: String(item.address),
        phone: String(item.phone),
        email: String(item.email.text),
        birthDate: new Date(item.birthDate),
        nationality: String(item.nationality || 'Argentina'),
      }
    })
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
