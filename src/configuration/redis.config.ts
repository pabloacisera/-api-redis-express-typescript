import chalk from 'chalk'
import { createClient } from 'redis'
import { envs } from './environments'

export const connectRedis = async () => {
  const redisClient = createClient({
    url: `${envs.REDIS_HOST}:${envs.REDIS_PORT}`
  })


  // Manejo de errores con estilo 🎨
  redisClient.on('error', (err) => {
    console.error(
      chalk.bgRed.white.bold(' 🚨 REDIS ERROR ') +
      chalk.red('\n → ') +
      chalk.white(err.message) +
      chalk.gray('\n' + '-'.repeat(50)))
  });

  // Conexión exitosa 🎉
  redisClient.on('connect', () => {
    console.log(
      chalk.bgGreen.black.bold(' ✅ REDIS CONNECTED ') +
      chalk.green('\n → ') +
      chalk.white(`Host: ${envs.REDIS_HOST}:${envs.REDIS_PORT}`) +
      chalk.gray('\n' + '━'.repeat(47)))
  });

  await redisClient.connect()
  return redisClient
}

export default connectRedis