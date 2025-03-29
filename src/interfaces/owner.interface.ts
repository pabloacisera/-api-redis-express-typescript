export interface IOwner {
  id?: number;
  name: string;
  dni: string;
  cuit: string;
  age: string;
  address: string;
  phone: string;
  email: string;
  birthDate: Date;
  nationality: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface IOwnerCreate extends Omit<IOwner, 'id' | 'createdAt' | 'updatedAt' | 'birthDate'> {
  birthDate: Date | string;
}

export interface IOwnerUpdate extends Partial<IOwnerCreate> { }