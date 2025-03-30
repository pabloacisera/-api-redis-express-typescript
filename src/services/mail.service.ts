import nodemailer from 'nodemailer';
import { envs } from "../configuration/environments";
import { createTransporter } from "../configuration/mailer.config";
import { EmailOptions, EmailTemplate } from "../interfaces/mail.interface";

export class MailService {
  private templates: Record<string, EmailTemplate> = {
    WELCOME: {
      subject: 'Bienvenido/a a nuestra plataforma',
      html: (data: { name: string }) => `
        <h1>Hola ${data.name}</h1>
        <p>Gracias por registrarse en nuestra aplicación</p>
      `
    },
    RESET_PASSWORD: {
      subject: 'Restablecer contraseña',
      html: (data: { token: string }) => `
        <h1>Restablecer contraseña</h1>
        <p>Para restablecer tu contraseña, haz click en el siguiente enlace: <a href="http://localhost:3000/auth/reset-password/${data.token}">Restablecer contraseña</a></p>
      `
    },

    RECOVERY_PASSWORD: {
      subject: 'Código de Recuperación de Contraseña',
      html: (data: { code: string }) => `
        <h1>Código de Recuperación de Contraseña</h1>
        <p>Tu código de recuperación es: <strong>${data.code}</strong></p>
        <p>Este código expirará en 10 minutos.</p>
      `
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {

      console.log('📤 Attempting to send email to:', options.to);
      console.log('📧 Email options:', {
        from: `"${envs.EMAIL_FROM_NAME}" <${envs.EMAIL_FROM}>`,
        subject: options.subject,
        html: options.html ? 'HTML content present' : 'No HTML content'
      });

      const transporter = createTransporter();

      const info = await transporter.sendMail({
        from: `"${envs.EMAIL_FROM_NAME}" <${envs.EMAIL_FROM}>`,
        ...options
      });

      console.log('📨 Email sent successfully!');
      console.log('🔍 Message ID:', info.messageId);
      console.log('👀 Preview URL:', nodemailer.getTestMessageUrl(info));

      return true
    } catch (error) {
      console.error('Error sending email: ', error)
      throw error
    }
  }

  async sendTemplateEmail(templateName: keyof typeof this.templates, to: string, data: any): Promise<boolean> {
    const template = this.templates[templateName]

    if (!template) {
      throw new Error(`Template "${templateName}" not found`)
    }

    const emailOptions: EmailOptions = {
      to,
      subject: template.subject,
      html: template.html(data)
    }

    return await this.sendEmail(emailOptions)
  }
}