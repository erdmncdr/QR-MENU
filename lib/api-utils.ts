import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formatZodErrors } from './validations'
import { AppError, formatErrorResponse } from './errors'
import { env } from './env'

/**
 * Wrapper for API route handlers with consistent error handling
 */
export async function handleApiError(
  error: unknown
): Promise<NextResponse> {
  // Log error
  console.error('API Error:', error)

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: formatZodErrors(error),
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    return handlePrismaError(error)
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    const response = formatErrorResponse(
      error,
      env.NODE_ENV === 'development'
    )
    return NextResponse.json(
      { error: response.error, ...(response.stack && { stack: response.stack }) },
      { status: response.statusCode }
    )
  }

  // Handle unknown errors
  const isDev = env.NODE_ENV === 'development'
  return NextResponse.json(
    {
      error: isDev
        ? error instanceof Error
          ? error.message
          : 'An unexpected error occurred'
        : 'Internal server error',
      ...(isDev && error instanceof Error && { stack: error.stack }),
    },
    { status: 500 }
  )
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: any): NextResponse {
  // P2002: Unique constraint violation
  if (error.code === 'P2002') {
    return NextResponse.json(
      {
        error: 'A record with this value already exists',
        field: error.meta?.target?.[0] || 'unknown',
      },
      { status: 409 }
    )
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: 'Record not found' },
      { status: 404 }
    )
  }

  // P2003: Foreign key constraint violation
  if (error.code === 'P2003') {
    return NextResponse.json(
      {
        error: 'Related record not found',
        field: error.meta?.field_name || 'unknown',
      },
      { status: 400 }
    )
  }

  // Generic Prisma error
  return NextResponse.json(
    {
      error: env.NODE_ENV === 'development'
        ? `Database error: ${error.message}`
        : 'Database operation failed',
    },
    { status: 500 }
  )
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Created response helper
 */
export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 })
}

/**
 * No content response helper
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}
