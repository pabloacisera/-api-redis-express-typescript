import dotenv from 'dotenv'

dotenv.config()

export const enviroments = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT,
  API_URL: process.env.API_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
}