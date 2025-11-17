/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, false)
  }
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: string
  statusCode: number
  details?: unknown
  stack?: string
}

/**
 * Format error for API response
 */
export function formatErrorResponse(
  error: unknown,
  includeStack: boolean = false
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      ...(includeStack && { stack: error.stack }),
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
      ...(includeStack && { stack: error.stack }),
    }
  }

  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
  }
}

/**
 * Check if error is operational (expected errors vs programming errors)
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}
