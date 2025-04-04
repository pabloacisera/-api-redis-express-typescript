import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
      file?: Multer.File;  // Añade esta línea
      files?: {
        [fieldname: string]: Multer.File[];
      };  // Opcional: si necesitas manejar múltiples archivos
    }
  }
}