import chalk from "chalk";
import { connectRedis } from "../configuration/redis.config";

export const saveRecoveryCode = async (email: string, code: string): Promise<void> => {
  const redisClient = await connectRedis();

  try {
    await redisClient.setEx(`code:${code}`, 60, code); // 60 segundos de expiración
    console.log(chalk.green(`Recovery code saved for email: ${email}`));
  } catch (error) {
    console.error(chalk.red(`Error storing recovery code in cache: ${error}`));
  } finally {
    await redisClient.quit();
  }
};
