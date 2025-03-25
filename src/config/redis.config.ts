import { createClient } from 'redis';
import { enviroments } from './dotenv.config';

// Configuración de Redis
const redisClient = createClient({
  socket: {
    host: enviroments.REDIS_HOST,
    port: parseInt(enviroments.REDIS_PORT || '6379', 10),
    reconnectStrategy: (retries) => {
      // Estrategia de reconexión exponencial con máximo de 5 segundos
      const delay = Math.min(retries * 100, 5000);
      console.log(`🔁 [REDIS] Intentando reconectar en ${delay}ms`);
      return delay;
    }
  },
  //password: enviroments.REDIS_PASSWORD // Añadir si es necesario
});

// Manejadores de eventos mejorados
redisClient.on('error', (err) => {
  console.error(`❌ [REDIS] Error: ${err.message}`);
});

redisClient.on('connect', () => {
  console.log('✅ [REDIS] Conectado al servidor Redis');
});

redisClient.on('ready', () => {
  console.log('🚀 [REDIS] Cliente listo para operar');
});

redisClient.on('reconnecting', () => {
  console.log('🔁 [REDIS] Reconectando...');
});

redisClient.on('end', () => {
  console.log('🚪 [REDIS] Conexión cerrada');
});

// Exportaciones
export const client = redisClient;

export const connectRedis = async () => {
  if (redisClient.isOpen) {
    console.log('ℹ️ [REDIS] El cliente ya está conectado');
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ [REDIS] Error crítico al conectar:', error);
    throw error;
  }
};