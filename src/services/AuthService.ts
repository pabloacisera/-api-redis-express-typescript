import { PrismaClient } from "@prisma/client";
import { User } from "../interfaces/user.interface";

export class AuthService{
  
  private prisma: PrismaClient 

  constructor() {
    this.prisma = new PrismaClient();
  }
  async register(user: User): Promise<User> {
    let { email } = user
    try {
      let userFound = await this.prisma.user.findFirst({
        where: {
          email,
        }
      })

      if(userFound) {
        throw new Error()
      }

      return {
        ...user,
        isActive: true,
      }
    } catch (error: unknown) {
      console.error('Error: ', error)
      throw error
    }
  }
}