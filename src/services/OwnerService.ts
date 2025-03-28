import { IOwner, IOwnerCreate, IResponse } from "../interfaces/owner.interface";
import { OwnerModel } from "../models/OwnerModel";
import { ApiError } from "../utils/ApiError";

export class OwnerService {
  private readonly model: OwnerModel

  constructor() {
    this.model = new OwnerModel()
  }

  async createOwner(owner: IOwnerCreate): Promise<IResponse<IOwner>> {
    try {
      const existingEmail = await this.model.findByEmail(owner.email)

      if (existingEmail) {
        throw new ApiError('Email already in use', 400)
      }

      const existingDni = await this.model.findByDni(owner.dni)

      if (existingDni) {
        throw new ApiError('DNI already in use', 400)
      }

      const existingCuit = await this.model.findByCuit(owner.cuit)

      if (existingCuit) {
        throw new ApiError('CUIT already in use', 400)
      }

      const ownerData = await this.model.createOwner(owner)

      return {
        success: true,
        message: 'Owner created successfully',
        data: owner
      }
    } catch (error) {
      throw new ApiError(`Error creating owner: ${error}`, 500)
    }
  }

  async getAllOwners(): Promise<IResponse<IOwner[]>> {
    try {
      const owners = await this.model.findAll()

      return {
        success: true,
        message: 'Owners retrieved successfully',
        data: owners
      }
    } catch (error) {
      throw new ApiError(`Error fetching owners: ${error}`, 500)
    }
  }

  async getOwnerById(id: number): Promise<IResponse<IOwner | null>> {
    try {
      const owner = await this.model.findById(id)

      if (!owner) {
        throw new ApiError('Owner not found', 404)
      }

      return {
        success: true,
        message: 'Owner retrieved successfully',
        data: owner
      }
    } catch (error) {
      throw new ApiError(`Error fetching owner: ${error}`, 500)
    }
  }

  async updateOwner(id: number, ownerData: IOwner): Promise<IResponse<IOwner>> {
    try {
      const existingOwner = await this.model.updateOwner(id, ownerData)

      if (!existingOwner) {
        throw new ApiError('Owner not found', 404)
      }

      if (ownerData.email && ownerData.email !== existingOwner.email) {
        const existingEmail = await this.model.findByEmail(ownerData.email);
        if (existingEmail) {
          throw new ApiError('Email already in use', 400);
        }
      }

      if (ownerData.dni && ownerData.dni !== existingOwner.dni) {
        const existingDni = await this.model.findByDni(ownerData.dni);
        if (existingDni) {
          throw new ApiError('DNI already in use', 400);
        }
      }

      if (ownerData.cuit && ownerData.cuit !== existingOwner.cuit) {
        const existingCuit = await this.model.findByCuit(ownerData.cuit);
        if (existingCuit) {
          throw new ApiError('CUIT already in use', 400);
        }
      }

      const updatedOwner = await this.model.updateOwner(id, ownerData);

      return {
        success: true,
        message: 'Owner updated successfully',
        data: updatedOwner
      }
    } catch (error) {
      throw new ApiError(`Error updating owner: ${error}`, 500)
    }
  }

  async deleteOwner(id: number): Promise<IResponse<void>> {
    try {
      const deletedOwner = await this.model.findById(id)

      if (!deletedOwner) {
        throw new ApiError('Owner not found', 404)
      }

      await this.model.deleteOwner(id)

      return {
        success: true,
        message: 'Owner deleted successfully'
      }
    } catch (error) {
      throw new ApiError(`Error deleting owner: ${error}`, 500)
    }
  }
}