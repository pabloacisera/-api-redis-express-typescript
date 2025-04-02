import { RedisClient } from "../configuration/redis.config";

// Asegúrate que todas las funciones usen el mismo formato de clave
export const saveRecoveryCode = async (email: string, code: string): Promise<void> => {
  const redisClient = new RedisClient();
  try {
    await redisClient.setex(`recovery:${email}`, 120, code); // Usa prefijo consistente
    console.log(`Código guardado para: ${email}`);
  } catch (error) {
    console.error('Error guardando código:', error);
    throw error;
  } 
};

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  const redisClient = new RedisClient();
  try {
    return await redisClient.get(`recovery:${email}`); // Mismo formato de clave
  } catch (error) {
    console.error('Error obteniendo código:', error);
    throw error;
  } 
};
