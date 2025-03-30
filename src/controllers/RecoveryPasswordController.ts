import { Request, Response } from 'express'
import { RecoveryPasswordService } from '../services/RecoveryPasswordService'

export class RecoveryPasswordController {
  private recoveryService: RecoveryPasswordService

  constructor() {
    this.recoveryService = new RecoveryPasswordService()
  }

  public async createCode(req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    try {
      const generatedCode = await this.recoveryService.createCode(email)
      if (!generatedCode) {
        throw new Error('Error into request')
      }

      return res.status(200).json({
        'success': true,
        'data': generatedCode
      })

    } catch (error) {
      console.error(error)
      return res.status(500).send('internal server error')
    }
  }
}
