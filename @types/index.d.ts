import { Multer } from 'multer'

declare global {
  namespace Express {
    export interface Request {
      file?: Multer.File;
      files?: Record<string, Multer.File[]>;
    }
  }
}