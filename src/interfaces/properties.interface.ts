export interface Properties {
  fileNumber: string;
  value: number;
  ownerId: number;
  dateRegitried: Date;
  address: string;
}

export interface PropertyResponse extends Properties {
  id: number;
  owner: {
    id: number;
    name: string;
    dni: string;
    cuit: string;
    age: string;
    address: string;
    phone: string;
    email: string;
    birthDate: Date;
    nationality: string;
  };
  createdAt: string;
  updatedAt: string;
  error?: string;
}