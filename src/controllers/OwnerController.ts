import { Request, Response } from "express";
import { OwnerService } from "../services/OwnerService";

export class OwnerController {
  private ownerService: OwnerService

  constructor() {
    this.ownerService = new OwnerService()
  }

  async createOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerData = req.body;
      const newOwner = await this.ownerService.createOwner(ownerData)
      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message: 'new user has not been created',
        });
      }
      return res.status(201).json({ success: true, message: 'owner created successfully', data: newOwner })
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }
}