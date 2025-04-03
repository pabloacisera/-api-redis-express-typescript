export interface FromExcelToDbResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface FromExcelToDbService {
  importFromExcel(data: any[]): Promise<FromExcelToDbResponse>
}