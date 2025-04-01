import { Owner } from '@prisma/client';
import { IOwner, IOwnerResponse } from "../interfaces/owner.interface";
import { BaseModel } from "../models/BaseModel";

export class OwnerService extends BaseModel {
  constructor() {
    super('owner')
  }

  private parseDateString(dateString: string): Date {
    // Asumimos el formato dd/mm/yyyy
    const [day, month, year] = dateString.split('/').map(Number);

    // Los meses en JavaScript son 0-indexed (0 = Enero, 11 = Diciembre)
    return new Date(year, month - 1, day);
  }

  async createOwner(data: IOwner): Promise<IOwnerResponse<Owner>> {

    if (typeof data.birthDate === 'string') {
      data.birthDate = this.parseDateString(data.birthDate)
    }

    if (!data.createdAt) {
      data.createdAt = new Date()
    }

    if (!data.updatedAt) {
      data.updatedAt = new Date()
    }

    return super.create(data)
  }
}