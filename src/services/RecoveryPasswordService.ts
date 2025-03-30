// RecoveryPasswordService.ts
import { PrismaClient } from "@prisma/client"
import randomBytes from 'randombytes'
import { MailService } from "./mail.service"
import { saveRecoveryCode } from "../helpers/recoveryCode.helper"

export class RecoveryPasswordService {

  private readonly prisma: PrismaClient
  private readonly emailService: MailService


  // Inyectamos la conexión a Redis desde fuera (controlador o donde sea)
  constructor() {
    this.prisma = new PrismaClient()
    this.emailService = new MailService()
  }

  public async createCode(email: string) {

    // Buscar al usuario en la base de datos
    const userFound = await this.prisma.user.findUnique({ where: { email } })

    if (!userFound) {
      return 'Email not registered yet'
    }

    // Generar un código aleatorio
    const randomByte = randomBytes(6)
    const hexString = randomByte.toString('base64')
    console.log('tipo de hex: ', hexString,typeof hexString)
    // Configurar el correo con el código
    const emailOptions = {
      to: userFound.email,
      subject: 'Código de Recuperación de Contraseña',
      html: `
        <h1>Código de Recuperación de Contraseña</h1>
        <p>Tu código de recuperación es: <strong>${hexString}</strong></p>
        <p>Este código expirará en 1 minuto.</p>
      `
    }

    try {
      // Enviar el correo al usuario
      const mailSent = await this.emailService.sendEmail(emailOptions)
      if (!mailSent) {
        return 'Error sending email'
      }

      // Guardar el código en Redis con un tiempo de expiración de 60 segundos
      await saveRecoveryCode(email, hexString);

      return hexString // Devolver el código generado si el correo se envió correctamente
    } catch (error) {
      console.error('Error al enviar el correo:', error)
      return 'Error al enviar el correo'
    }
  }
}

