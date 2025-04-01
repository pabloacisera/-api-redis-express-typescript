import { Request, Response } from 'express';
import { RecoveryPasswordService } from '../services/RecoveryPasswordService';

export class RecoveryPasswordController {
  private readonly service: RecoveryPasswordService;

  constructor() {
    this.service = new RecoveryPasswordService();
  }

  public async sendCode(req: Request, res: Response) {
    const { email } = req.body;
    const result = await this.service.createAndSendCode(email);
    return res.status(result.success ? 200 : 400).json(result);
  }

  public async resetPassword(req: Request, res: Response) {
    const { email, code, newPassword } = req.body;
    const result = await this.service.resetPassword(email, code, newPassword);
    return res.status(result.success ? 200 : 400).json(result);
  }
}