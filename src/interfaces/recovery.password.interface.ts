export interface RecoveryPassword{
  success: boolean;
  message: string;
  data?: any;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}