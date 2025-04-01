import { connectRedis } from "../configuration/redis.config";

// Asegúrate que todas las funciones usen el mismo formato de clave
export const saveRecoveryCode = async (email: string, code: string): Promise<void> => {
  const redisClient = await connectRedis();
  try {
    await redisClient.setEx(`recovery:${email}`, 120, code); // Usa prefijo consistente
    console.log(`Código guardado para: ${email}`);
  } catch (error) {
    console.error('Error guardando código:', error);
    throw error;
  } finally {
    await redisClient.quit();
  }
};

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  const redisClient = await connectRedis();
  try {
    return await redisClient.get(`recovery:${email}`); // Mismo formato de clave
  } catch (error) {
    console.error('Error obteniendo código:', error);
    throw error;
  } finally {
    await redisClient.quit();
  }
};