export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends ApiError{
  constructor(message: string, details?: any) {
    super(400, message, true, details)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, details?: any) {
    super(401, message, true, details)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "No encontrado", details: any) {
    super(404, message, true, details);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, details: any) {
    super(500, message, true, details);
  }
}