import { Token } from "./auth.interface";

enum userRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: userRole;
  createdAt?: Date;
  isActive?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  token: Token;
}