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

  async getAllOwners(req: Request, res: Response): Promise<Response> {
    try {
      const owners = await this.ownerService.getAllOwners()
      if (!owners.success) {
        return res.status(500).json({ success: false, message: 'internal server error', error: owners.error })
      }
      return res.status(200).json(owners)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const ownerResponse = await this.ownerService.getOwnerById(ownerId);

      if (!ownerResponse.success) {
        return res.status(404).json(ownerResponse); // Devuelve el mensaje de error del servicio
      }

      return res.status(200).json(ownerResponse);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error });
    }
  }

  async updateOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const ownerData = req.body;
      const updatedOwner = await this.ownerService.updateOwner(ownerId, ownerData)
      if (!updatedOwner.success) {
        return res.status(404).json({ success: false, message: 'owner not found' })
      }
      return res.status(200).json(updatedOwner)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = req.params.id;
      const deletedOwner = await this.ownerService.deleteOwner(ownerId)
      if (!deletedOwner.success) {
        return res.status(404).json({ success: false, message: 'owner not found' })
      }
      return res.status(200).json(deletedOwner)
    } catch (error) {
      return res.status(500).json({ success: false, message: 'internal server error', error: error })
    }
  }
}