import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { envs } from "../configuration/environments";
import { generateToken } from "../helpers/auth.helper";
import { ConfirmEmailResponse, Login, LoginResponse } from "../interfaces/auth.interface";
import { User, UserResponse } from "../interfaces/user.interface";
import { MailService } from "./mail.service";

export class AuthService{
  
  private prisma: PrismaClient
  private mailService: MailService

  constructor() {
    this.prisma = new PrismaClient()
    this.mailService = new MailService()
  }

  async confirmRegister(id: number): Promise< ConfirmEmailResponse >{
    try {
      const userFound = await this.prisma.user.findFirst({
        where: {id}
      })

      if(!userFound) {
        return {
          success:true,
          message: 'El usuario no se ha registrado con exito, intente nuevamente mas tarde'
        }
      }

      if (userFound.isActive) {
            return {
                success: true,
                message: 'La cuenta ya estaba activada anteriormente'
            };
        }

      await this.prisma.user.update({
        where: { id },
        data: { isActive: true }
      })
      
      return {
        success: true,
        message: 'Email confirmado correctamente. Usuario activo, ya puede iniciar sesión'
      }
    } catch (error) {
      console.error('Error al confirmar registro:', error);
        return {
            success: false,
            message: 'Ocurrió un error al confirmar el registro. Por favor intente más tarde.'
        };
    }
  }

  async sendConfirmationEmail(user: { email: string, name: string, id: number }) {
    try {
      console.log('🔧 Preparing confirmation email for:', user.email);
      const confirmationLink = `${envs.BACKEND_URL}:${envs.PORT}/auth/confirm_email/${user.id}`
      console.log('🔗 Generated confirmation link:', confirmationLink);

      const emailResult = await this.mailService.sendEmail({
        to: user.email,
        subject: 'Confirmación de registro',
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">¡Hola ${user.name}!</h1>
                    <p style="font-size: 16px;">Gracias por registrarte en nuestra plataforma. Por favor confirma tu dirección de email para activar tu cuenta.</p>
                    
                    <a href="${confirmationLink}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                        Confirmar mi cuenta
                    </a>
                    
                    <p style="font-size: 14px; color: #6b7280;">
                        Si no solicitaste este registro, por favor ignora este mensaje.
                    </p>
                    
                    <p style="font-size: 12px; color: #9ca3af;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        ${confirmationLink}
                    </p>
                </div>
            `
      })

      if (emailResult) {
        console.log('✅ Confirmation email sent successfully to:', user.email);
      } else {
        console.warn('⚠️ Email sending returned false for:', user.email);
      }

      return emailResult
    } catch (error) {
      console.error('Error to send confirmation email', error)
    }
  }

  async register(user: User): Promise<UserResponse> {
    let { email } = user
    try {
      let userFound = await this.prisma.user.findFirst({
        where: {
          email,
        }
      })

      if(userFound) {
        throw new Error('Email already exists')
      }

      let hashPass = await bcrypt.hash(user.password, 12)

      const userStruct = {
        name: user.name,
        username: user.username,
        email,
        password: hashPass,
        role: user.role,
        createdAt: new Date(),
        isActive: false,
      }

      const res = await this.prisma.user.create({
        data: userStruct
      })

      console.log('👤 User created:', { id: res.id, email: res.email });

      const emailSent = await this.sendConfirmationEmail({
        email: res.email,
        name: res.name,
        id: res.id,
      })

      if (!emailSent) {
        console.warn('⚠️ User registered but confirmation email not sent:', res.email);
      }
      
      const token = await generateToken({
        userId: res.id,
        email: res.email,
        role: res.role,
      },
        envs.SECRET_KEY,
        {
        expiresIn: '1h',
        algorithm: 'HS256',
      })

      return {
        id: Number(res.id),
        name: res.name,
        username: res.username,
        email: res.email,
        role: res.role,
        createdAt: res.createdAt.toISOString(),
        isActive: res.isActive,
        token,
      }
    } catch (error: unknown) {
      console.error('Error: ', error)
      throw error
    }
  }

  async login(user: Login): Promise<LoginResponse> {
    const { email, password } = user

    try {
      const userFound = await this.prisma.user.findFirst({
        where: {
          email,
        }
      })

      if (!userFound) {
        return {
          success: false,
          message: 'Invalid credentials',
        }
      }

      if (userFound.isActive === false) {
        return {
          success: false,
          message: 'The profile is not active. Check your email',
        }
      }

      const isMatch = await bcrypt.compare(password, userFound.password)

      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid email or password',
        }
      }

      const token = await generateToken({
        userId: userFound.id,
        email: userFound.email,
        role: userFound.role,
      },
        envs.SECRET_KEY,
        {
        expiresIn: '1h',
        algorithm: 'HS256',
      })

      return {
        success: true,
        message: 'Username logged successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while logging in',
      }
    }
  }
}