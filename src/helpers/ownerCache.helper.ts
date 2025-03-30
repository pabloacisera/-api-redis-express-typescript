import chalk from "chalk";
import { envs } from "../configuration/environments";
import connectRedis from "../configuration/redis.config";
import { IOwner } from "../interfaces/owner.interface";

const cache_expiration = parseInt(envs.REDIS_CACHE_EXPIRATION)

export async function createOwnerCache(owner: IOwner): Promise<void> {
  const redisClient = await connectRedis();
  try {
    await redisClient.setEx(
      `owner:${owner.id}`,
      cache_expiration,
      JSON.stringify(owner)
    )
  } catch (error) {
    console.error(chalk.red(`Error storing owner in cache: ${error}`));
  } finally {
    redisClient.quit()
  }
}

export async function getOwnerFromCache(id: number): Promise<IOwner | null> {
  const redisClient = await connectRedis();
  try {
    const cachedOwner = await redisClient.get(`owner:${id}`);

    if (cachedOwner) {
      return JSON.parse(cachedOwner.toString());
    }

    return null;
  } catch (error) {
    console.error(chalk.red(`Error fetching owner from cache: ${error}`));
    return null;
  } finally {
    redisClient.quit()
  }
}

export async function patchOwnerCache(id: string, updateData: Partial<IOwner>): Promise<boolean> {
  const redisClient = await connectRedis();
  try {
    // 1. Obtener el owner existente
    const existingOwner = await getOwnerFromCache(Number(id));
    if (!existingOwner) return false;

    // 2. Aplicar los cambios
    const updatedOwner = { ...existingOwner, ...updateData };

    // 3. Guardar de nuevo en caché
    await createOwnerCache(updatedOwner);
    return true;
  } catch (error) {
    console.error(chalk.red(`Error patching owner in cache: ${error}`));
    return false;
  } finally {
    await redisClient.quit();
  }
}

// DELETE
export async function deleteOwnerCache(id: string): Promise<boolean> {
  const redisClient = await connectRedis();
  try {
    const result = await redisClient.del(`owner:${id}`);
    return result > 0;
  } catch (error) {
    console.error(chalk.red(`Error deleting owner from cache: ${error}`));
    return false;
  } finally {
    await redisClient.quit();
  }
}

// LIST ALL (opcional)
export async function getAllOwnersCache(): Promise<IOwner[]> {
  const redisClient = await connectRedis();
  try {
    const keys = await redisClient.keys("owner:*");
    if (!keys.length) return [];

    const owners = await Promise.all(
      keys.map(async (key) => {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
      })
    );

    return owners.filter(owner => owner !== null) as IOwner[];
  } catch (error) {
    console.error(chalk.red(`Error getting all owners from cache: ${error}`));
    return [];
  } finally {
    await redisClient.quit();
  }
}
