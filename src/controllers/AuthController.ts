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

  async login(request: Request, response: Response) {
    const { email, password } = request.body

    try {
      if (!email ||!password) {
        throw new BadRequestError('Missing fields in the request body', {
          details: {
            email:!email? 'Missing email' : undefined,
            password:!password? 'Missing password' : undefined
          }
        })
      }

      const user = {
        email,
        password
      }

      const result = await this.service.login(user)

      if (!result) {
        throw new NotFoundError('Invalid credentials', {
          details: {
            message: 'The provided credentials are not valid'
          }
        })
      }

      return response.json({
        data: result
      })
    } catch (error) {
      throw new InternalServerError('Error in server', {
        details: error instanceof Error? error.message : 'Unknown error'
      })
    }
  }

  async confirmationEmail(request: Request, response: Response) {
    const { id } = request.params

    try {
      if (!id) {
        throw new BadRequestError('Missing required parameter', {
          details: {
            id: 'The id parameter is missing'
          }
        })
      }

      const result = await this.service.confirmRegister(parseInt(id))

      return response.json({
        data: result
      })
    } catch (error) {
      throw new InternalServerError('Error in server', {
        details: error instanceof Error? error.message : 'Unknown error'
      })
    }
  }
}