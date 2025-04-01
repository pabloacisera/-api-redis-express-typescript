import { PrismaClient } from "@prisma/client";
import { hashSync } from 'bcrypt';
import randomBytes from 'randombytes';
import { getRecoveryCode, saveRecoveryCode } from "../helpers/recoveryCode.helper";
import { MailService } from "./mail.service";

interface RecoveryResponse {
  success: boolean;
  message: string;
  data?: any;
  debug?: {  // Para información de depuración en desarrollo
    storedCode?: string | null;
    receivedCode?: string;
  };
  error?: string;  // Para mensajes de error detallados
}

export class RecoveryPasswordService {
  private readonly prisma: PrismaClient;
  private readonly emailService: MailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.emailService = new MailService();
  }

  public async createAndSendCode(email: string): Promise<RecoveryResponse> {
    try {
      // Verificar si el email existe
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return { success: false, message: 'Email no registrado' };
      }

      // Generar código de 6 dígitos
      const code = randomBytes(3).toString('hex').toUpperCase();

      // Enviar por email
      const emailSent = await this.emailService.sendEmail({
        to: email,
        subject: 'Código de recuperación',
        html: `Tu código es: <strong>${code}</strong> (válido por 2 minutos)`
      });

      if (!emailSent) {
        return { success: false, message: 'Error al enviar el email' };
      }

      // Guardar en Redis (key: email, value: code)
      await saveRecoveryCode(email, code);

      return {
        success: true,
        message: 'Código enviado correctamente',
        data: { email }
      };
    } catch (error) {
      console.error('Error en createAndSendCode:', error);
      return { success: false, message: 'Error al generar el código' };
    }
  }

  public async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<RecoveryResponse> {
    try {
      // 1. Verificar el código
      const storedCode = await getRecoveryCode(email);

      if (!storedCode || storedCode.trim() !== code.trim()) {
        const response: RecoveryResponse = {
          success: false,
          message: 'Código inválido o expirado'
        };

        // Solo agregar debug en entorno de desarrollo
        if (process.env.NODE_ENV === 'development') {
          response.debug = {
            storedCode,
            receivedCode: code
          };
        }

        return response;
      }

      // 2. Buscar usuario
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      // 3. Hashear y actualizar contraseña
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashSync(newPassword, 10) }
      });

      // 4. Eliminar código usado
      //await deleteRecoveryCode(email);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };

    } catch (error) {
      const response: RecoveryResponse = {
        success: false,
        message: 'Error al cambiar la contraseña'
      };

      if (error instanceof Error) {
        response.error = error.message;
      }

      return response;
    }
  }
}