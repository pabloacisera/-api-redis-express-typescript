import { Request, Response } from "express";
import { BadRequestError, InternalServerError, NotFoundError } from "../customErrors/custom.errors";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private readonly service: AuthService

  constructor() {
    this.service = new AuthService()
  }

  async register(request: Request, response: Response) {
    const user = request.body

    try {

      if (!user.email || !user.password || !user.role) {
        throw new BadRequestError('Missing fields in the request body', {
          details: {
            email: !user.email ? 'Missing email' : undefined,
            password: !user.password ? 'Missing password' : undefined,
            role:!user.role? 'Missing role' : undefined,
          }
        })
      }
      const result = await this.service.register(user)

      if (!result) {  
        throw new NotFoundError('The request could not be executed', {
          details: {
            message: 'The server has not responded or the response has no content'
          }
        })
      }

      return response.status(201).json({
        data: result
      })
    } catch (error) {
      throw new InternalServerError('Error in sever', {
        details: error instanceof Error? error.message : 'Unknown error'
      })
    }
  }
}