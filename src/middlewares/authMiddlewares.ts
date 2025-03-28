import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { envs } from "../configuration/environments";
import { verifiedToken } from "../helpers/auth.helper";
import { ApiError } from "../utils/ApiError";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(new ApiError('Acces denied. No token provided.', 401))
  }

  try {
    const decoded = await verifiedToken({ token }, envs.SECRET_KEY, {})
    res.locals.user = decoded
    next()
  } catch (error) {
    // Maneja el error de verificación del token
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError('El token ha expirado.', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Token inválido.', 401));
    } else {
      // Otro tipo de error
      console.error('Error al verificar el token:', error);
      next(new ApiError('Error de autenticación.', 401));
    }
  }
}