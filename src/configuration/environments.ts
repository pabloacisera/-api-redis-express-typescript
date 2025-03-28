import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface AppEnvs {
  PORT: number;
  BACKEND_URL: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  SECRET_KEY: string;
  GOOGLE_USER_APP: string;
  GOOGLE_PASSWORD_APP: string;
  GOOGLE_CLIENT_ID: string; 
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  EMAIL_PORT: string;
  EMAIL_HOST: string;
}

export const envs: AppEnvs = {
  PORT: parseInt(process.env.PORT || '3030', 10),
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3030',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SECRET_KEY: process.env.SECRET_KEY || '',
  GOOGLE_USER_APP: process.env.GOOGLE_USER_APP || '',
  GOOGLE_PASSWORD_APP: process.env.GOOGLE_PASSWORD_APP || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || '',
  EMAIL_PORT: process.env.EMAIL_PORT || '',
  EMAIL_HOST:process.env.EMAIL_HOST || '',
};

// Validaciones
if (isNaN(envs.PORT)) throw new Error('PORT must be a valid number');
if (!envs.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!envs.SECRET_KEY) throw new Error('JWT_SECRET is required')
if (!envs.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is required')
if (!envs.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is required')
if (!envs.GOOGLE_REDIRECT_URI) throw new Error('GOOGLE_REDIRECT_URI is required')
if (!envs.EMAIL_FROM) throw new Error('EMAIL_FROM is required')
if (!envs.EMAIL_FROM_NAME) throw new Error('EMAIL_FROM_NAME is required')
if (!envs.GOOGLE_USER_APP) throw new Error('GOOGLE_USER_APP  is required')
if (!envs.GOOGLE_PASSWORD_APP) throw new Error('GOOGLE_PASSWORD_APP is required')
if (!envs.EMAIL_PORT) throw new Error('EMAIL_PORT is required')
if (!envs.EMAIL_HOST) throw new Error('EMAIL_HOST is required') 
if(!envs.BACKEND_URL) throw new Error('BACKEND_URL is required')