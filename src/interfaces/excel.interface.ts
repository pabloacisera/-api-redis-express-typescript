export interface DataSheet {
  titleSheet: string;
  data: any[];
}

// En interfaces/excel.interface.ts o donde tengas tus tipos
export interface ExcelExportResult {
  buffer: Buffer;
  hasData: boolean;
}