export interface Token {
  token: string;
}

export interface Payload {
  userId: number;
  email: string;
  role: string;
}

export interface ConfirmEmailResponse {
  success: boolean;
  message: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse  {
  success: boolean;
  message: string;
  user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    token?: string;
}