import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface AppEnvs {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
}

export const envs: AppEnvs = {
  PORT: parseInt(process.env.PORT || '3030', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validaciones
if (isNaN(envs.PORT)) throw new Error('PORT must be a valid number');
if (!envs.DATABASE_URL) throw new Error('DATABASE_URL is required');