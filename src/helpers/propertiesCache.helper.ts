import chalk from "chalk";
import { envs } from "../configuration/environments";
import connectRedis from "../configuration/redis.config";
import { Properties, PropertyResponse } from "../interfaces/properties.interface";

const cache_expiration = parseInt(envs.REDIS_CACHE_EXPIRATION)

export async function createPropertyCache(property: PropertyResponse): Promise<void> {
  const redisClient = await connectRedis()

  try {
    await redisClient.setEx(`property:${property.fileNumber}`, cache_expiration, JSON.stringify(property))
  } catch (error) {
    console.error(chalk.red(`Error storing owner in cache: ${error}`));
  } finally {
    redisClient.quit()
  }
}

export async function getAllPropertiesCache(): Promise<PropertyResponse[]> {
  const redisClient = await connectRedis()
  try {
    const keys = await redisClient.keys("property:*")

    if (!keys.length) return []

    const properties = await Promise.all(
      keys.map(async (key) => {
        const data = await redisClient.get(key)
        return data ? JSON.parse(data) : null
      })
    )

    return properties.filter(property => property !== null) as PropertyResponse[]
  } catch (error) {
    console.error(chalk.red(`Error fetching all properties from cache: ${error}`));
    return []
  } finally {
    redisClient.quit()
  }
}

export async function getPropertyById(id: number): Promise<PropertyResponse | null> {
  const redisClient = await connectRedis()
  try {
    const cachedProperty = await redisClient.get(`property:${id}`)

    if (cachedProperty) {
      return JSON.parse(cachedProperty.toString())
    }

    return null
  } catch (error) {
    console.error(chalk.red(`Error fetching owner from cache: ${error}`));
    return null;
  } finally {
    redisClient.quit()
  }
}


// DELETE
export async function deletePropertyCache(id: string): Promise<boolean> {
  const redisClient = await connectRedis()
  try {
    const result = await redisClient.del(`property:${id}`)
    return result > 0
  } catch (error) {
    console.error(chalk.red(`Error deleting property from cache: ${error}`));
    return false
  } finally {
    await redisClient.quit()
  }
}

// UPDATE
export async function updatePropertyCache(id: string, updateData: Partial<Properties>): Promise<boolean> {
  const redisClient = await connectRedis()
  try {
    const existingProperty = await getPropertyById(Number(id))
    if (!existingProperty) return false

    // Asegurarse de que ownerId no sea undefined
    const updatedProperty = {
      ...existingProperty,
      ...updateData,
      ownerId: updateData.ownerId ?? existingProperty.owner.id
    }

    await redisClient.setEx(`property:${id}`, cache_expiration, JSON.stringify(updatedProperty))
    return true
  } catch (error) {
    console.error(chalk.red(`Error updating property in cache: ${error}`));
    return false
  } finally {
    await redisClient.quit()
  }
}