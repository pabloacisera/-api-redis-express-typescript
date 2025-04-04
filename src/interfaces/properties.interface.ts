export interface Properties {
  fileNumber: string;
  value: number;
  ownerId: number;
  dateRegitried: Date;
  address: string;
}

export interface PropertiesResponse<T> {
  success: boolean;
  message?: string;
  data?: T | null;
  error?: string | Error | null;
}

// Entonces PropertyResponse sería:
export type PropertyResponse = PropertiesResponse<Properties>;