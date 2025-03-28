import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { Payload, Token } from "../interfaces/auth.interface"

/**
 * Si no existe interface de payload podemos usar:
 * /*string | Buffer | object
 */
export const generateToken = (payload: Payload, secret: Secret, options?: SignOptions): Promise<Token> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options || {} , (err, token) => {
      if(err) {
        reject(err)
      } else {
        resolve({
          token: token || ''
        })
      }
    })
  })
}

/**
 * ejemplo de uso:
 * await generateToken(
    { id: 1 },
    'secret-key',
    { expiresIn: '1h', algorithm: 'HS256' } // Opciones completas
  );
 */

export const verifiedToken = async (token: Token, secret:Secret, options?: jwt.VerifyOptions) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token.token, secret, options || {}, (err, decoded) => {
      if(err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}