export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path: string;
  }[]
}

export interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
}